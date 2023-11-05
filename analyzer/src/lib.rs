use std::env;

use chrono::Utc;

use interactive_json_process::InteractiveJsonProcess;

use crate::store::get_analysis_job::Error;

mod models {
    pub use move_info::MoveInfo;
    pub use query::Query;
    pub use result::Result;

    mod coord;
    mod move_info;
    mod query;
    mod result;
}

mod interactive_json_process;

mod store {
    pub mod fail_analyzing;
    pub mod finish_analyzing;
    pub mod insert_analysis;
    pub mod get_analysis_job;
    pub mod start_analyzing;
    mod store;
}

mod sgf;

pub async fn analyze() {
    // get analysis job

    let analysis_job = match store::get_analysis_job::request().await {
        Ok(data) => {
            println!("found. id={}", data.id);
            data
        }
        Err(err) => {
            match err {
                Error::NotFound => {
                    println!("not found. skipped.");
                    return;
                }
                Error::RequestError(err) => panic!("request error: get analyzing job. message={}", err)
            }
        }
    };

    // start analyzing

    let start = Utc::now();
    store::start_analyzing::request(analysis_job.id).await.expect("request error: start analyzing.");

    // sgf -> query

    let sgf = match sgf::ParsedSGF::try_from(analysis_job.record.sgf_text.as_ref()) {
        Ok(sgf) => sgf,
        Err(_) => {
            eprintln!("invalid sgf text found. id={}", analysis_job.id);
            store::fail_analyzing::request(analysis_job.id, "invalid sgf text".to_string()).await.expect("request error: fail analyzing.");
            return;
        }
    };
    let query: models::Query = sgf.into();
    let query = query.with_id(analysis_job.id.to_string());

    // launch process

    let cmd = env::var("ANALYZER_COMMAND").expect("ANALYZER_COMMAND");
    let opt = env::var("ANALYZER_OPTIONS").expect("ANALYZER_OPTIONS");
    let options = opt.split(" ").collect();
    let mut process = InteractiveJsonProcess::<models::Result>::new(cmd.as_str(), options).expect("failed to launch process.");

    // setup receiver

    let limit = query.number_of_turns();
    let mut rx = process.receive().unwrap();
    let task = tokio::spawn(async move {
        let move_per_turns = env::var("MOVE_PER_TURNS")
            .ok()
            .and_then(|v| v.parse::<usize>().ok())
            .unwrap_or(3);

        for i in 0..limit {
            let mut data = match rx.recv().await {
                None => return Err("unexpected data error"),
                Some(data) => data
            };

            let id = data.id.parse::<i64>().unwrap();
            data.sort();
            for move_info in data.move_infos.into_iter().take(move_per_turns) {
                let _ = store::insert_analysis::request(id, data.turn_number as i64, move_info).await;
            }

            println!("progress: {:.1}%", i as f32 * 100.0 / limit as f32);
        }

        Ok(())
    });

    // start analysis

    let result: Result<(), &str> = async {
        process.send(&query).await.map_err(|_| "start analyzer")?;
        task.await.map_err(|_| "unexpected error in analyzing task")?
    }.await;

    match result {
        Ok(_) => {
            store::finish_analyzing::request(analysis_job.id).await.expect("request error: finish analyzing.");
            let duration = Utc::now() - start;

            println!("finished in {} ms.", duration.num_milliseconds())
        }
        Err(msg) => {
            eprintln!("{}", msg);
            store::fail_analyzing::request(analysis_job.id, msg.to_string()).await.expect("request error: fail analyzing.");
        }
    }
}
