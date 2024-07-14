import { graphql } from "@/generated/gql";

const INSERT_RECORD = graphql(`
mutation InsertRecord($sgf: String!, $playerColor: String!) {
    insert_records_one(object: { sgf_text: $sgf, player_color: $playerColor }) {
        id
    }
}
`);

export default INSERT_RECORD;
