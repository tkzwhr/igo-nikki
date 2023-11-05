use serde::{Serialize, Serializer};
use serde::ser::SerializeSeq;

#[derive(Debug)]
pub enum Coord {
    Black(String),
    White(String),
}

impl Serialize for Coord {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> where S: Serializer {
        let mut seq = serializer.serialize_seq(Some(2))?;
        match self {
            Coord::Black(s) => {
                seq.serialize_element("B")?;
                seq.serialize_element(s)?;
            }
            Coord::White(s) => {
                seq.serialize_element("W")?;
                seq.serialize_element(s)?;
            }
        }
        seq.end()
    }
}

#[cfg(test)]
mod tests {
    use super::Coord;

    #[test]
    fn jsonシリアライズできること() {
        // Arrange
        let data = vec![
            Coord::Black("A1".to_string()),
            Coord::White("B2".to_string()),
        ];

        // Act
        let result = data.into_iter().map(|x| serde_json::to_string(&x).unwrap()).collect::<Vec<_>>();

        // Assert
        assert_eq!(result.len(), 2);
        assert_eq!(&result[0], r#"["B","A1"]"#);
        assert_eq!(&result[1], r#"["W","B2"]"#);
    }
}
