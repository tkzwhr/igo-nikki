import { graphql } from "@/generated/gql";

const GET_ANALYSIS = graphql(`
query GetAnalysis($recordId: Int!) {
    analysis(
        order_by: { turn_number: asc, prior: desc }
        where: { record_id: { _eq: $recordId } }
    ) {
        move
        prior
        score_lead
        turn_number
        utility
        visits
        winrate
    }
}
`);

export default GET_ANALYSIS;
