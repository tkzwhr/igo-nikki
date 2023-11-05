use sgf_parse::{GameTree, SgfNode};
use sgf_parse::go::{Move, Point, Prop};

use crate::models;

#[derive(Debug, PartialEq)]
pub struct ParsedSGF(SgfNode<Prop>);

impl TryFrom<&str> for ParsedSGF {
    type Error = String;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        let mut game_trees = sgf_parse::parse(value).map_err(|err| err.to_string())?;

        if game_trees.len() != 1 {
            return Err("multiple games not supported".to_string());
        }

        let go_game = match game_trees.pop() {
            Some(GameTree::GoGame(props)) => Ok(props),
            _ => Err("unsupported game type")
        }?;

        Ok(ParsedSGF(go_game))
    }
}

impl Into<models::Query> for ParsedSGF {
    fn into(self) -> models::Query {
        let board_size = match self.0.get_property("SZ") {
            Some(Prop::SZ((x, y))) => (*x, *y),
            _ => (19, 19)
        };

        let komi = match self.0.get_property("KM") {
            Some(Prop::KM(komi)) => *komi,
            _ => 0.0
        };

        let initial_black = match self.0.get_property("AB") {
            Some(Prop::AB(points)) => {
                let mut values = points.iter().map(|p| point_to_string(p, board_size)).collect::<Vec<_>>();
                values.sort();
                values
            }
            _ => vec![]
        };

        let initial_white = match self.0.get_property("AW") {
            Some(Prop::AW(points)) => {
                let mut values = points.iter().map(|p| point_to_string(p, board_size)).collect::<Vec<_>>();
                values.sort();
                values
            }
            _ => vec![]
        };

        let mut moves = vec![];
        let mut start_color_is_black: Option<bool> = None;
        let mut ptr = self.0.children.first();
        while ptr.is_some() {
            let current_ptr = ptr.unwrap();

            let coord_b = match current_ptr.get_property("B") {
                Some(Prop::B(m)) => Some(m),
                _ => None
            };
            let coord_w = match current_ptr.get_property("W") {
                Some(Prop::W(m)) => Some(m),
                _ => None
            };

            if start_color_is_black.is_none() {
                start_color_is_black = Some(coord_b.is_some());
            }

            let coord = match coord_b.or(coord_w) {
                Some(Move::Move(point)) => point_to_string(point, board_size),
                _ => "pass".to_string()
            };
            moves.push(coord);

            ptr = current_ptr.children.first();
        }

        models::Query::new(
            komi as f32,
            board_size,
            initial_black,
            initial_white,
            start_color_is_black.unwrap(),
            moves,
        )
    }
}

fn point_to_string(point: &Point, board_size: (u8, u8)) -> String {
    let x = point.x as u32;
    let x_char = char::from_u32('A' as u32 + (if x > 7 { x + 1 } else { x })).unwrap();
    let y = board_size.1 - point.y;
    format!("{}{}", x_char, y)
}

#[cfg(test)]
mod tests {
    use super::ParsedSGF;

    mod try_from {
        use sgf_parse::go::Prop;

        use super::ParsedSGF;

        #[test]
        fn 成功すること() {
            // Arrange
            let sgf_text = "(;GM[1]FF[4]CA[UTF-8]SZ[9])";

            // Act
            let result: ParsedSGF = sgf_text.try_into().unwrap();

            // Assert
            assert_eq!(result.0.get_property("SZ").unwrap(), &Prop::SZ((9, 9)));
        }

        #[test]
        fn sgfテキストではない場合はエラーになること() {
            // Arrange
            let sgf_text = "parse error";

            // Act
            let result: Result<ParsedSGF, String> = sgf_text.try_into();

            // Assert
            assert_eq!(result, Err("Error tokenizing: Missing property identifier".to_string()));
        }

        #[test]
        fn 複数のゲームがある場合はエラーになること() {
            // Arrange
            let sgf_text = "(;GM[1]FF[4]CA[UTF-8]KM[6.5]SZ[9])(;GM[1]FF[4]CA[UTF-8]KM[6.5]SZ[9])";

            // Act
            let result: Result<ParsedSGF, String> = sgf_text.try_into();

            // Assert
            assert_eq!(result, Err("multiple games not supported".to_string()));
        }

        #[test]
        fn 碁ではない場合はエラーになること() {
            // Arrange
            let sgf_text = "(;GM[2]FF[4]CA[UTF-8]SZ[8])";

            // Act
            let result: Result<ParsedSGF, String> = sgf_text.try_into();

            // Assert
            assert_eq!(result, Err("unsupported game type".to_string()));
        }
    }

    mod into {
        use crate::models;

        use super::ParsedSGF;

        #[test]
        fn 成功すること() {
            // Arrange
            let sgf_text = "(;GM[1]FF[4]CA[UTF-8]KM[6.5]SZ[9]AB[cg][gc]HA[2];W[gg];B[cc];W[ee])";

            // Act
            let parsed_sgf: ParsedSGF = sgf_text.try_into().unwrap();
            let result: models::Query = parsed_sgf.into();
            let result = serde_json::to_string(&result).unwrap();

            // Assert
            assert_eq!(result, r#"{"id":"id","rules":"japanese","komi":6.5,"boardXSize":9,"boardYSize":9,"analyzeTurns":[1,2,3],"initialStones":[["B","C2"],["B","G6"]],"moves":[["W","G2"],["B","C6"],["W","E4"]]}"#)
        }
    }
}
