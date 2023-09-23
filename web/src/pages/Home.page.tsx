import GoPlayer from '@/components/GoPlayer';
import { Button, Card, Empty, FloatButton } from 'antd';
import React, { useEffect, useState } from 'react';
import ImportDetailModal from '@/components/ImportDetail.modal';
import styled from 'styled-components';
import useRecord from '@/hooks/record';
import SelectImportMethodModal from '@/components/SelectImportMethod.modal';
import RecordList from '@/components/RecordList';
import { ImportData } from '@/helpers/import.helper';

const Styled = styled.div`
  display: flex;
  gap: 24px;

  .date {
    width: 360px;

    .menu {
      border-inline-end-width: 0;
    }
  }

  .go-player {
    width: 720px;
    height: 540px;
  }
`;

export default function HomePage() {
  const [selectImportIsOpen, setSelectImportIsOpen] = useState(false);
  const [importDetailIsOpen, setImportDetailIsOpen] = useState(false);
  const [records, recordFn] = useRecord();
  const [currentRecordId, setCurrentRecordId] = useState(0);
  const [sgfText, setSgfText] = useState('');

  useEffect(() => {
    recordFn.fetchRecords().then();
  }, []);

  useEffect(() => {
    if (records.data.length > 0) {
      setCurrentRecordId(records.data[0].id);
    }
  }, [records.data]);

  const doImport = (sgfText?: string) => {
    setSelectImportIsOpen(false);

    if (sgfText === undefined) {
      return;
    }
    setSgfText(sgfText);

    setImportDetailIsOpen(true);
  };

  const storeSgf = async (importData?: ImportData) => {
    setImportDetailIsOpen(false);

    if (importData !== undefined) {
      await recordFn.insertRecord(importData.sgf, importData.playerColor);
    }
  };

  if (records.loading) {
    return <div></div>;
  }

  const miscComponents = (
    <>
      <FloatButton type="primary" onClick={() => setSelectImportIsOpen(true)} />
      <SelectImportMethodModal isOpen={selectImportIsOpen} submit={doImport} />
      <ImportDetailModal
        isOpen={importDetailIsOpen}
        sgf={sgfText}
        submit={storeSgf}
      />
    </>
  );

  if (records.data.length === 0) {
    return (
      <>
        <Empty description="棋譜がありません">
          <Button type="primary" onClick={() => setSelectImportIsOpen(true)}>
            棋譜を追加する
          </Button>
        </Empty>
        {miscComponents}
      </>
    );
  }

  return (
    <>
      <Styled>
        <Card className="date">
          <RecordList
            records={records.data}
            selectedRecordId={currentRecordId}
            onSelect={setCurrentRecordId}
            onDelete={recordFn.deleteRecord}
          />
        </Card>
        <div className="go-player">
          <GoPlayer
            sgf={
              records.data.find(
                ({ id }: { id: number }) => id === currentRecordId,
              )?.sgf_text ?? ''
            }
          ></GoPlayer>
        </div>
      </Styled>
      {miscComponents}
    </>
  );
}
