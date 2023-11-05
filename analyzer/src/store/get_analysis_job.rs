use graphql_client::GraphQLQuery;
use graphql_client::reqwest::post_graphql;

use super::store::get_client;

#[derive(GraphQLQuery)]
#[graphql(
schema_path = "../graphql/schema.graphql",
query_path = "../graphql/queries/get_analysis_job.graphql",
response_derives = "Debug"
)]
struct GetAnalysisJob;

#[derive(Debug)]
pub enum Error {
    RequestError(reqwest::Error),
    NotFound,
}

pub async fn request() -> Result<get_analysis_job::GetAnalysisJobAnalysisJobs, Error> {
    let (client, url) = get_client();

    post_graphql::<GetAnalysisJob, _>(&client, &url, get_analysis_job::Variables {})
        .await
        .map_err(|err| Error::RequestError(err))?
        .data
        .and_then(|mut data| data.analysis_jobs.pop())
        .ok_or(Error::NotFound)
}
