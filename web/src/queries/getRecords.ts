import { graphql } from "@/generated/gql";

const GET_RECORDS = graphql(`
query GetRecords($id: String!) {
    records(where: {user: {id: {_eq: $id}}}) {
        id
        sgf_text
        player_color
        analysis_job {
            started_at
            finished_at
            error_message
        }
    }
}
`);

export default GET_RECORDS;
