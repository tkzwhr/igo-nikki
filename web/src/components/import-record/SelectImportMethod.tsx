import {
  isValidCosumiUrl,
  parseCosumiUrl,
  readFile,
} from "@/helpers/import.helper";
import GameData from "@/models/GameData";
import { Alert, Button, Input, Radio, Space } from "antd";
import { useState } from "react";
import styled from "styled-components";

type Props = {
  onSelect: (gameData: GameData) => void;
};

const StyledSpace = styled(Space)`
  .cosumi {
    width: 100%;
  }
`;

export default function SelectImportMethod(props: Props) {
  const [type, setType] = useState("file");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const next = async (file?: File | undefined) => {
    let gameData: GameData | null = null;

    switch (type) {
      case "file": {
        if (!file) {
          return;
        }

        const sgf = await readFile(file);
        gameData = GameData.parse(sgf);

        if (!gameData) {
          setError("有効なSGFファイルではありません。");
          return;
        }

        break;
      }
      case "sgf": {
        gameData = GameData.parse(text);

        if (!gameData) {
          setError("有効なSGFデータではありません。");
          return;
        }

        break;
      }
      case "cosumi": {
        if (!isValidCosumiUrl(text)) {
          setError("COSUMIの結果ページを指定してください。");
          return;
        }

        const { sgfText, playerIsBlack } = parseCosumiUrl(text);
        gameData = GameData.parse(sgfText, playerIsBlack ? "BLACK" : "WHITE");

        if (!gameData) {
          setError("COSUMIのパラメータが不正です。");
          return;
        }

        break;
      }
      default: {
        return;
      }
    }

    props.onSelect(gameData);
  };

  return (
    <StyledSpace direction="vertical" size="large">
      {error !== null && <Alert message={error} type="error" />}
      <Radio.Group
        value={type}
        onChange={(evt) => setType(evt.target.value)}
        buttonStyle="solid"
      >
        <Radio.Button value="file">ファイルから</Radio.Button>
        <Radio.Button value="sgf">SGFテキストから</Radio.Button>
        <Radio.Button value="cosumi">COSUMIの結果ページから</Radio.Button>
      </Radio.Group>
      {type === "file" && (
        <Input type="file" onChange={(evt) => next(evt.target.files?.[0])} />
      )}
      {type === "sgf" && (
        <>
          <Input.TextArea onChange={(evt) => setText(evt.target.value)} />
          <Button type="primary" onClick={() => next()}>
            次へ
          </Button>
        </>
      )}
      {type === "cosumi" && (
        <Space.Compact className="cosumi">
          <Input onChange={(evt) => setText(evt.target.value)} />
          <Button type="primary" onClick={() => next()}>
            次へ
          </Button>
        </Space.Compact>
      )}
    </StyledSpace>
  );
}
