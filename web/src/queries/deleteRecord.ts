import { graphql } from "@/generated/gql";

const DELETE_RECORD = graphql(`
mutation DeleteRecord($pk: Int!) {
    delete_analysis(where: {record_id: {_eq: $pk}}) {
        affected_rows
    }
    delete_analysis_jobs(where: {record_id: {_eq: $pk}}) {
        affected_rows
    }
    delete_records_by_pk(id: $pk) {
        id
    }
}
`);

export default DELETE_RECORD;
