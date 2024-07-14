import EditGameInfo from "@/components/import-record/EditGameInfo";
import SelectImportMethod from "@/components/import-record/SelectImportMethod";
import { HomeContext } from "@/hooks/home.reducer";
import { useStorage } from "@/hooks/storage";
import type GameData from "@/models/GameData";
import { Modal, Steps } from "antd";
import { useCallback, useContext, useState } from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  margin-top: 16px;
`;

const steps = [{ title: "方法の選択" }, { title: "詳細設定" }];
const stepItems = steps.map((p) => ({ key: p.title, title: p.title }));

export default function ImportRecordModal() {
  const [store, dispatch] = useContext(HomeContext);
  const { insertRecord } = useStorage();
  const [page, setPage] = useState(0);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [updatedGameData, setUpdatedGameData] = useState<GameData | null>(null);

  const goToDetail = useCallback((gameData: GameData) => {
    setGameData(gameData);
    setPage(1);
  }, []);

  const doImport = useCallback(async () => {
    dispatch({ type: "SET_SHOWS_IMPORT_RECORD_MODAL", flag: false });

    const data = updatedGameData ?? gameData;
    if (data) {
      await insertRecord(data);
    }
  }, [dispatch, gameData, insertRecord, updatedGameData]);

  const reset = useCallback(() => setPage(0), []);

  return (
    <Modal
      title="棋譜をインポートする"
      open={store.showsImportRecordModal}
      onOk={doImport}
      okButtonProps={{ disabled: page < steps.length - 1 }}
      onCancel={() =>
        dispatch({ type: "SET_SHOWS_IMPORT_RECORD_MODAL", flag: false })
      }
      afterClose={reset}
      width={720}
    >
      <Steps current={page} items={stepItems} />
      <StyledDiv>
        {page === 0 && <SelectImportMethod onSelect={goToDetail} />}
        {page === 1 && gameData && (
          <EditGameInfo gameData={gameData} onUpdate={setUpdatedGameData} />
        )}
      </StyledDiv>
    </Modal>
  );
}
