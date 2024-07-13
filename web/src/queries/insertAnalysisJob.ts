import { graphql } from "@/generated/gql";

const INSERT_ANALYSIS_JOB = graphql(`
mutation InsertAnalysisJob($recordId: Int!) {
    insert_analysis_jobs_one(object: {record_id: $recordId}) {
        id
    }
}
`);

export default INSERT_ANALYSIS_JOB;
