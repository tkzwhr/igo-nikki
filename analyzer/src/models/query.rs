use serde::Serialize;

use super::coord::Coord;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Query {
    id: String,
    rules: String,
    komi: f32,
    board_x_size: u8,
    board_y_size: u8,
    analyze_turns: Vec<u16>,
    initial_stones: Vec<Coord>,
    moves: Vec<Coord>,
}

impl Query {
    pub fn new(komi: f32, board_size: (u8, u8), initial_black: Vec<String>, initial_white: Vec<String>, start_color_is_black: bool, coords: Vec<String>) -> Query {
        let mut initial_stones = vec![];
        for p in initial_black {
            initial_stones.push(Coord::Black(p));
        }
        for p in initial_white {
            initial_stones.push(Coord::White(p));
        }

        let analyze_turns = (1..=coords.len()).map(|i| i as u16).collect();

        let moves = coords
            .into_iter()
            .enumerate()
            .map(|(index, p)| {
                if index % 2 == 0 && start_color_is_black {
                    Coord::Black(p)
                } else if index % 2 == 1 && !start_color_is_black {
                    Coord::Black(p)
                } else {
                    Coord::White(p)
                }
            })
            .collect();

        Query {
            id: "id".to_string(),
            rules: "japanese".to_string(),
            komi,
            board_x_size: board_size.0,
            board_y_size: board_size.1,
            analyze_turns,
            initial_stones,
            moves,
        }
    }

    pub fn with_id(self, id: String) -> Query {
        Query {
            id: id.to_string(),
            ..self
        }
    }

    pub fn number_of_turns(&self) -> usize {
        self.analyze_turns.len()
    }
}

#[cfg(test)]
mod tests {
    use super::Query;

    #[test]
    fn 生成できること() {
        // Arrange
        let initial_black = vec!["A1", "A2", "A3"].into_iter().map(|v| v.into()).collect();
        let initial_white = vec!["B1", "B2", "B3"].into_iter().map(|v| v.into()).collect();
        let coords = vec!["C1", "C2", "C3"].into_iter().map(|v| v.into()).collect();

        // Act
        let result = Query::new(6.5, (9, 9), initial_black, initial_white, true, coords);
        let result = serde_json::to_string(&result).unwrap();

        // Assert
        assert_eq!(result, r#"{"id":"id","rules":"japanese","komi":6.5,"boardXSize":9,"boardYSize":9,"analyzeTurns":[1,2,3],"initialStones":[["B","A1"],["B","A2"],["B","A3"],["W","B1"],["W","B2"],["W","B3"]],"moves":[["B","C1"],["W","C2"],["B","C3"]]}"#)
    }
}
