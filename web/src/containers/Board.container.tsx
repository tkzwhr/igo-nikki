import { useSuspenseQuery } from "@apollo/client";
import { Card, Spin } from "antd";
import React, { Suspense, useContext } from "react";
import styled from "styled-components";

import GoPlayer from "@/components/GoPlayer";
import GetAnalysis from "@/graphql/get_analysis.graphql";
import { mergeAnalysis } from "@/helpers/sgf.helper";
import { HomeContext } from "@/hooks/home.reducer";

const StyledCard = styled(Card)`
  width: 720px;
  height: 580px;
`;

function Inner() {
  const [store] = useContext(HomeContext);

  // biome-ignore lint/style/noNonNullAssertion: ignore
  const record = store.records.find((r) => r.id === store.recordId)!;

  // biome-ignore lint/suspicious/noExplicitAny: ignore
  const { data: analysis } = useSuspenseQuery<any>(GetAnalysis, {
    variables: { recordId: record.id },
  });

  const newSgfText = mergeAnalysis(
    record.sgf_text,
    analysis,
    store.analysisDisplayMode,
  );

  return <GoPlayer sgf={newSgfText} ref={store.goPlayerRef} />;
}

export default function BoardContainer() {
  const [store] = useContext(HomeContext);

  if (store.recordId === null) {
    return <div />;
  }

  return (
    <StyledCard>
      <Suspense fallback={<Spin />}>
        <Inner />
      </Suspense>
    </StyledCard>
  );
}
