import CustomDatePicker from "@/components/CustomDatePicker";
import type GameData from "@/models/GameData";
import type { GameResult } from "@/models/GameData";
import { Form, Input, InputNumber, Radio, Select, Tag } from "antd";
import { useEffect, useState } from "react";

type Props = {
  gameData: GameData;
  onUpdate: (gameData: GameData) => void;
};

export default function GameInfo(props: Props) {
  const [form] = Form.useForm();
  const [showsColor, setShowsColor] = useState(false);
  const [showsPoints, setShowsPoints] = useState(false);

  useEffect(() => {
    form.setFieldValue("gameName", props.gameData.gameName);
    form.setFieldValue("gameComment", props.gameData.gameComment);
    form.setFieldValue("playerColor", props.gameData.playerColor ?? "BLACK");
    form.setFieldValue("blackPlayer", props.gameData.blackPlayer);
    form.setFieldValue("whitePlayer", props.gameData.whitePlayer);
    form.setFieldValue("playedAt", props.gameData.playedAt ?? new Date());
    form.setFieldValue("handicap", props.gameData.handicap ?? "no");
    form.setFieldValue("komi", props.gameData.komi);
    form.setFieldValue("result", props.gameData.result?.type ?? "draw");
    form.setFieldValue(
      "color",
      props.gameData.result?.type !== "draw"
        ? props.gameData.result?.color ?? "BLACK"
        : "BLACK",
    );
    form.setFieldValue(
      "points",
      props.gameData.result?.type === "winsByPoints"
        ? props.gameData.result?.points ?? 0.5
        : 0.5,
    );

    if (props.gameData.result) {
      setShowsColor(props.gameData.result.type !== "draw");
      setShowsPoints(props.gameData.result.type === "winsByPoints");
    }

    updateFormValues({});
  }, [form.setFieldValue, props.gameData]);

  // biome-ignore lint/suspicious/noExplicitAny: ignore
  const updateFormValues = (values: any) => {
    if (values.result) {
      const resultType = values.result as GameResult["type"];
      setShowsColor(resultType !== "draw");
      setShowsPoints(resultType === "winsByPoints");
    }

    let result: GameResult;
    switch (form.getFieldValue("result") as GameResult["type"]) {
      case "draw": {
        result = {
          type: "draw",
        };
        break;
      }
      case "resign": {
        result = {
          type: "resign",
          color: form.getFieldValue("color"),
        };
        break;
      }
      case "winsByPoints": {
        result = {
          type: "winsByPoints",
          color: form.getFieldValue("color"),
          points: form.getFieldValue("points"),
        };
        break;
      }
    }

    props.onUpdate(
      props.gameData.update({
        gameName: form.getFieldValue("gameName"),
        gameComment: form.getFieldValue("gameComment"),
        playerColor: form.getFieldValue("playerColor"),
        blackPlayer: form.getFieldValue("blackPlayer"),
        whitePlayer: form.getFieldValue("whitePlayer"),
        playedAt: form.getFieldValue("playedAt"),
        handicap: form.getFieldValue("handicap"),
        komi: form.getFieldValue("komi"),
        result,
      }),
    );
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 17 }}
      onValuesChange={updateFormValues}
    >
      <Form.Item name="gameName" label="タイトル">
        <Input placeholder="タイトル" />
      </Form.Item>
      <Form.Item name="gameComment" label="コメント">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="playerColor" label="プレイヤー">
        <Radio.Group>
          <Radio value="BLACK">
            <Tag color="#000">黒</Tag>
          </Radio>
          <Radio value="WHITE">白</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="blackPlayer" label="黒対局者">
        <Input placeholder="黒対局者" />
      </Form.Item>
      <Form.Item name="whitePlayer" label="白対局者">
        <Input placeholder="白対局者" />
      </Form.Item>
      <Form.Item name="playedAt" label="対局日">
        <CustomDatePicker />
      </Form.Item>
      <Form.Item name="handicap" label="手合割">
        <Select
          options={[
            { value: "no", label: "互先" },
            { value: "no2", label: "定先" },
            { value: "2", label: "２子局" },
            { value: "3", label: "３子局" },
            { value: "4", label: "４子局" },
            { value: "5", label: "５子局" },
            { value: "6", label: "６子局" },
            { value: "7", label: "７子局" },
            { value: "8", label: "８子局" },
            { value: "9", label: "９子局" },
          ]}
        />
      </Form.Item>
      <Form.Item name="komi" label="コミ">
        <InputNumber step={0.5} />
      </Form.Item>

      <Form.Item label="結果">
        <Form.Item name="result">
          <Select
            options={[
              { value: "resign", label: "中押し" },
              { value: "winsByPoints", label: "目勝ち" },
              { value: "draw", label: "持碁" },
            ]}
          />
        </Form.Item>
        {showsColor && (
          <Form.Item name="color" label="勝者">
            <Radio.Group>
              <Radio value="BLACK">
                <Tag color="#000">黒</Tag>
              </Radio>
              <Radio value="WHITE">白</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        {showsPoints && (
          <Form.Item name="points" label="目差">
            <InputNumber min={0.5} step={0.5} />
          </Form.Item>
        )}
      </Form.Item>
    </Form>
  );
}
