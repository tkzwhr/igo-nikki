use graphql_client::GraphQLQuery;
use graphql_client::reqwest::post_graphql;

use super::store::get_client;

#[derive(GraphQLQuery)]
#[graphql(
schema_path = "../graphql/schema.graphql",
query_path = "../graphql/queries/fail_analyzing.graphql",
response_derives = "Debug"
)]
struct FailAnalyzing;

#[derive(Debug)]
pub enum Error {
    RequestError(reqwest::Error),
    UnknownError,
}

pub async fn request(id: i64, error_message: String) -> Result<fail_analyzing::FailAnalyzingUpdateAnalysisJobsByPk, Error> {
    let (client, url) = get_client();

    let vars = fail_analyzing::Variables {
        pk: id,
        error_message,
    };

    post_graphql::<FailAnalyzing, _>(&client, &url, vars)
        .await
        .map_err(|err| Error::RequestError(err))?
        .data
        .and_then(|data| data.update_analysis_jobs_by_pk)
        .ok_or(Error::UnknownError)
}
