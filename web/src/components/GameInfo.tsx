import { Form, FormInstance, Input, InputNumber, Radio, Select } from 'antd';
import { useBoolean } from 'react-use';
import CustomDatePicker from '@/components/CustomDatePicker';
import { GameData } from '@/helpers/sgf.helper';
import { useEffect } from 'react';

type Props = {
  initialValue?: GameData;
  onGameDataUpdate: (gameData: GameData) => void;
};

function parseResult(result?: string): {
  result?: string;
  count?: string;
} {
  if (result === '0' || result?.endsWith('R')) {
    return { result };
  }

  const [res, count] = (result ?? '').split('+');

  return { result: res, count };
}

function stringifyResult(form: FormInstance): string | undefined {
  const result = form.getFieldValue('result');

  if (result === '0' || result.endsWith('R')) {
    return result;
  }

  const count = form.getFieldValue('count');

  return `${result}+${count}`;
}

export default function GameInfo(props: Props) {
  const [form] = Form.useForm();
  const [showsCount, setShowsCount] = useBoolean(false);

  useEffect(() => {
    const playerColor =
      props.initialValue?.whitePlayer === 'You' ? 'WHITE' : 'BLACK';
    const parsedResult = parseResult(props.initialValue?.result);

    form.setFieldValue('gameName', props.initialValue?.gameName);
    form.setFieldValue('gameComment', props.initialValue?.gameComment);
    form.setFieldValue('playerColor', playerColor);
    form.setFieldValue('blackPlayer', props.initialValue?.blackPlayer);
    form.setFieldValue('whitePlayer', props.initialValue?.whitePlayer);
    form.setFieldValue('playedAt', props.initialValue?.playedAt ?? new Date());
    form.setFieldValue('handicap', props.initialValue?.handicap ?? 'no');
    form.setFieldValue('komi', props.initialValue?.komi);
    form.setFieldValue('result', parsedResult?.result);
    form.setFieldValue('count', parsedResult?.count);

    setShowsCount(parsedResult?.count !== undefined);

    updateValues({});
  }, []);

  const updateValues = (values: any) => {
    if (values['result'] !== undefined) {
      setShowsCount(values['result'] === 'B' || values['result'] === 'W');
    }

    props.onGameDataUpdate({
      gameName: form.getFieldValue('gameName'),
      gameComment: form.getFieldValue('gameComment'),
      playerColor: form.getFieldValue('playerColor'),
      blackPlayer: form.getFieldValue('blackPlayer'),
      whitePlayer: form.getFieldValue('whitePlayer'),
      playedAt: form.getFieldValue('playedAt'),
      handicap: form.getFieldValue('handicap'),
      komi: form.getFieldValue('komi'),
      result: stringifyResult(form),
    });
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 17 }}
      onValuesChange={updateValues}
    >
      <Form.Item name="gameName" label="タイトル">
        <Input placeholder="タイトル" />
      </Form.Item>
      <Form.Item name="gameComment" label="コメント">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="playerColor" label="プレイヤー">
        <Radio.Group>
          <Radio value="BLACK">黒</Radio>
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
            { value: 'no', label: '互先' },
            { value: 'no2', label: '定先' },
            { value: '2', label: '２子局' },
            { value: '3', label: '３子局' },
            { value: '4', label: '４子局' },
            { value: '5', label: '５子局' },
            { value: '6', label: '６子局' },
            { value: '7', label: '７子局' },
            { value: '8', label: '８子局' },
            { value: '9', label: '９子局' },
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
              { value: 'B+R', label: '黒 中押し勝ち' },
              { value: 'W+R', label: '白 中押し勝ち' },
              { value: 'B', label: '黒 ○目勝ち' },
              { value: 'W', label: '白 ○目勝ち' },
              { value: '0', label: '持碁' },
            ]}
          />
        </Form.Item>
        {showsCount && (
          <Form.Item name="count" label="目差">
            <InputNumber min={0.5} step={0.5} />
          </Form.Item>
        )}
      </Form.Item>
    </Form>
  );
}
