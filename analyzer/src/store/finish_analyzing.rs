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
query_path = "../graphql/queries/finish_analyzing.graphql",
response_derives = "Debug"
)]
struct FinishAnalyzing;

#[derive(Debug)]
pub enum Error {
    RequestError(reqwest::Error),
    UnknownError,
}

pub async fn request(id: i64) -> Result<finish_analyzing::FinishAnalyzingUpdateAnalysisJobsByPk, Error> {
    let (client, url) = get_client();

    let vars = finish_analyzing::Variables {
        pk: id,
        finished_at: Utc::now().naive_utc(),
    };

    post_graphql::<FinishAnalyzing, _>(&client, &url, vars)
        .await
        .map_err(|err| Error::RequestError(err))?
        .data
        .and_then(|data| data.update_analysis_jobs_by_pk)
        .ok_or(Error::UnknownError)
}
