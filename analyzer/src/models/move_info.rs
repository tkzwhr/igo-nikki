use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MoveInfo {
    pub r#move: String,
    pub visits: u16,
    pub winrate: f32,
    pub score_lead: f32,
    pub prior: f32,
    pub utility: f32,
}
