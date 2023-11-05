use graphql_client::GraphQLQuery;
use graphql_client::reqwest::post_graphql;

use crate::models::MoveInfo;

use super::store::get_client;

// https://github.com/graphql-rust/graphql-client#custom-scalars
#[allow(non_camel_case_types)]
type float8 = f32;

#[derive(GraphQLQuery)]
#[graphql(
schema_path = "../graphql/schema.graphql",
query_path = "../graphql/queries/insert_analysis.graphql",
response_derives = "Debug"
)]
struct InsertAnalysis;

#[derive(Debug)]
pub enum Error {
    RequestError(reqwest::Error),
    NotFound,
}

pub async fn request(record_id: i64, turn_number: i64, move_info: MoveInfo) -> Result<insert_analysis::InsertAnalysisInsertAnalysisOne, Error> {
    let (client, url) = get_client();

    let vars = insert_analysis::Variables {
        move_: move_info.r#move,
        prior: move_info.prior,
        record_id,
        score_lead: move_info.score_lead,
        turn_number,
        utility: move_info.utility,
        visits: move_info.visits as i64,
        winrate: move_info.winrate,
    };

    post_graphql::<InsertAnalysis, _>(&client, &url, vars)
        .await
        .map_err(|err| Error::RequestError(err))?
        .data
        .and_then(|data| data.insert_analysis_one)
        .ok_or(Error::NotFound)
}
