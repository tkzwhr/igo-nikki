import { Button, Card, Empty, FloatButton, Skeleton, Space } from "antd";
import React, { Suspense, useCallback } from "react";
import styled from "styled-components";

import ActionMenuContainer from "@/containers/ActionMenu.container";
import AnalysisContainer from "@/containers/Analysis.container";
import BoardContainer from "@/containers/Board.container";
import GameListContainer from "@/containers/GameList.container";
import ImportRecordModal from "@/containers/ImportRecord.modal";
import { HomeContext, useHomeReducer } from "@/hooks/home.reducer";

const StyledDiv = styled.div`
  max-height: 640px;  
  overflow: auto;
`;

function Inner() {
  const reducer = useHomeReducer();

  const showImportRecordModal = useCallback(() => {
    reducer[1]({ type: "SET_SHOWS_IMPORT_RECORD_MODAL", flag: true });
  }, [reducer]);

  if (reducer[0].records.length === 0) {
    return (
      <HomeContext.Provider value={reducer}>
        <Card>
          <Empty description="棋譜がありません">
            <Button type="primary" onClick={showImportRecordModal}>
              棋譜を追加する
            </Button>
          </Empty>
        </Card>
        <FloatButton type="primary" onClick={showImportRecordModal} />
        <ImportRecordModal />
      </HomeContext.Provider>
    );
  }

  return (
    <HomeContext.Provider value={reducer}>
      <Space align="start">
        <Space direction="vertical">
          <StyledDiv>
            <GameListContainer />
          </StyledDiv>
          <ActionMenuContainer />
        </Space>
        <BoardContainer />
        <AnalysisContainer />
      </Space>
      <FloatButton type="primary" onClick={showImportRecordModal} />
      <ImportRecordModal />
    </HomeContext.Provider>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<Skeleton active />}>
      <Inner />
    </Suspense>
  );
}
