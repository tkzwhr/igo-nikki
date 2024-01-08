import { useSuspenseQuery } from '@apollo/client';
import { Alert, Button, Card, Radio, Space, Spin } from 'antd';
import { format } from 'date-fns';
import React, { Suspense, useContext } from 'react';

import AnalysisChart from '@/components/AnalysisChart';
import GetAnalysis from '@/graphql/get_analysis.graphql';
import { HomeContext } from '@/hooks/home.reducer';
import { useStorage } from '@/hooks/storage';

function Inner() {
  const [store, dispatch] = useContext(HomeContext);
  const { insertAnalysisJob } = useStorage();

  const record = store.records.find((r) => r.id === store.recordId)!;

  const { data: analysis } = useSuspenseQuery<any>(GetAnalysis, {
    variables: { recordId: record.id },
  });

  if (!record.analysis_job) {
    return (
      <Button type="primary" onClick={() => insertAnalysisJob(record.id)}>
        解析を実行する
      </Button>
    );
  }

  if (!record.analysis_job.finished_at) {
    let startedAt = '解析待機中...';

    if (record.analysis_job.started_at) {
      startedAt = format(
        new Date(record.analysis_job.started_at),
        'yyyy/M/d H:mm:ss 解析開始',
      );
    }

    return (
      <Space direction="vertical">
        <Alert message={startedAt} type="info" showIcon />
        {record.analysis_job.error_message && (
          <Alert
            message={record.analysis_job.error_message}
            type="error"
            showIcon
          />
        )}
      </Space>
    );
  }

  const finishedAt = format(
    new Date(record.analysis_job.finished_at),
    'yyyy/M/d H:mm:ss 解析完了',
  );
  return (
    <Space direction="vertical">
      <Alert message={finishedAt} type="success" showIcon></Alert>
      <AnalysisChart
        data={analysis['analysis']}
        onTurnUpdate={(turn) => store.goPlayerRef.current.goTo(turn)}
      />
      <Space>
        <div>碁盤の表示モード</div>
        <Radio.Group
          value={store.analysisDisplayMode}
          onChange={(evt) =>
            dispatch({
              type: 'SET_ANALYSIS_DISPLAY_MODE',
              mode: evt.target.value,
            })
          }
          buttonStyle="solid"
        >
          <Radio.Button value="winrate">勝率</Radio.Button>
          <Radio.Button value="score_lead">目差</Radio.Button>
        </Radio.Group>
      </Space>
    </Space>
  );
}

export default function AnalysisContainer() {
  const [store] = useContext(HomeContext);

  if (store.recordId === null) {
    return <></>;
  }

  return (
    <Card>
      <Suspense fallback={<Spin />}>
        <Inner />
      </Suspense>
    </Card>
  );
}
