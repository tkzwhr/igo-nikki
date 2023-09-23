import { Input, Modal, Radio, Space } from 'antd';
import { useEffect, useState } from 'react';
import {
  readFile,
  parseCosumiUrl,
  isValidCosumiUrl,
} from '@/helpers/import.helper';
import { parse } from '@/helpers/sgf.helper';

type Props = {
  isOpen: boolean;
  submit: (sgfText?: string) => void;
};

export default function SelectImportMethodModal(props: Props) {
  const [type, setType] = useState('file');
  const [file, setFile] = useState<undefined | File>();
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!props.isOpen) {
      setType('file');
      setFile(undefined);
      setText('');
      setUrl('');
    }
  }, [props.isOpen]);

  const isValid =
    (type === 'file' && file !== undefined) ||
    (type === 'sgf' && text.length > 0) ||
    (type === 'cosumi' && isValidCosumiUrl(url));

  const onSubmit = async () => {
    let sgf = 'error';
    switch (type) {
      case 'file': {
        sgf = await readFile(file!);
        break;
      }
      case 'sgf':
        sgf = text;
        break;
      case 'cosumi': {
        sgf = parseCosumiUrl(url);
        break;
      }
    }

    if (parse(sgf) === null) {
      return;
    }

    props.submit(sgf);
  };

  return (
    <Modal
      title="棋譜をインポートする"
      open={props.isOpen}
      onOk={onSubmit}
      onCancel={() => props.submit()}
      okButtonProps={{ disabled: !isValid }}
    >
      <Space direction="vertical" size="large">
        <Radio.Group
          value={type}
          onChange={(evt) => setType(evt.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="file">ファイルから</Radio.Button>
          <Radio.Button value="sgf">SGFテキストから</Radio.Button>
          <Radio.Button value="cosumi">COSUMIの結果ページから</Radio.Button>
        </Radio.Group>
        {type === 'file' && (
          <Input
            type="file"
            onChange={(evt) => setFile(evt.target.files?.[0])}
          />
        )}
        {type === 'sgf' && (
          <Input.TextArea
            value={text}
            onChange={(evt) => setText(evt.target.value)}
          />
        )}
        {type === 'cosumi' && (
          <Input value={url} onChange={(evt) => setUrl(evt.target.value)} />
        )}
      </Space>
    </Modal>
  );
}
