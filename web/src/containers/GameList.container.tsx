import { Card } from "antd";
import { useCallback, useContext } from "react";
import styled from "styled-components";

import GameList from "@/components/GameList";
import { HomeContext } from "@/hooks/home.reducer";
import { useStorage } from "@/hooks/storage";

const StyledCard = styled(Card)`
  width: 360px;
`;

export default function GameListContainer() {
  const [store, dispatch] = useContext(HomeContext);
  const { deleteRecord } = useStorage();

  const doDeleteRecord = useCallback(
    async (id: number) => {
      dispatch({ type: "SET_RECORD_ID", recordId: null });
      await deleteRecord(id);
    },
    [dispatch, deleteRecord],
  );

  return (
    <StyledCard>
      <GameList
        records={store.records}
        selectedId={store.recordId}
        onSelect={(id) => dispatch({ type: "SET_RECORD_ID", recordId: id })}
        onDelete={doDeleteRecord}
      />
    </StyledCard>
  );
}
