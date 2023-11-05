use serde::Deserialize;

use super::move_info::MoveInfo;

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Result {
    pub id: String,
    pub turn_number: u16,
    pub move_infos: Vec<MoveInfo>,
}

impl Result {
    pub fn sort(&mut self) {
        self.move_infos.sort_by(|a, b| b.prior.partial_cmp(&a.prior).unwrap());
    }
}

#[cfg(test)]
mod tests {
    use crate::models::MoveInfo;

    use super::Result;

    #[test]
    fn ソートされること() {
        // Arrange
        let move_infos = vec![
            MoveInfo {
                r#move: "Mid".to_string(),
                visits: 0,
                winrate: 0.0,
                score_lead: 0.0,
                prior: 2.0,
                utility: 0.0,
            },
            MoveInfo {
                r#move: "High".to_string(),
                visits: 0,
                winrate: 0.0,
                score_lead: 0.0,
                prior: 3.0,
                utility: 0.0,
            },
            MoveInfo {
                r#move: "Low".to_string(),
                visits: 0,
                winrate: 0.0,
                score_lead: 0.0,
                prior: 1.0,
                utility: 0.0,
            },
        ];
        let mut data = Result {
            id: "id".to_string(),
            turn_number: 1,
            move_infos,
        };

        // Act
        data.sort();

        // Assert
        let result = data.move_infos.iter().map(|x| x.r#move.as_str()).collect::<Vec<_>>();
        assert_eq!(result, vec!["High", "Mid", "Low"])
    }
}
