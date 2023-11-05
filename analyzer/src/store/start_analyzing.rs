use chrono::{NaiveDateTime, Utc};
use graphql_client::GraphQLQuery;
use graphql_client::reqwest::post_graphql;

use super::store::get_client;

// https://github.com/graphql-rust/graphql-client#custom-scalars
#[allow(non_camel_case_types)]
type timestamp = NaiveDateTime;

#[derive(GraphQLQuery)]
#[graphql(
schema_path = "../graphql/schema.graphql",
query_path = "../graphql/queries/start_analyzing.graphql",
response_derives = "Debug"
)]
struct StartAnalyzing;

#[derive(Debug)]
pub enum Error {
    RequestError(reqwest::Error),
    UnknownError,
}

pub async fn request(id: i64) -> Result<start_analyzing::StartAnalyzingUpdateAnalysisJobsByPk, Error> {
    let (client, url) = get_client();

    let vars = start_analyzing::Variables {
        pk: id,
        started_at: Utc::now().naive_utc(),
    };

    post_graphql::<StartAnalyzing, _>(&client, &url, vars)
        .await
        .map_err(|err| Error::RequestError(err))?
        .data
        .and_then(|data| data.update_analysis_jobs_by_pk)
        .ok_or(Error::UnknownError)
}
