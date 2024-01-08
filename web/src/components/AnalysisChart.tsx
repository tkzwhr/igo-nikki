import { DualAxes } from '@ant-design/charts';
import React, { useMemo } from 'react';

import { AnalysisData } from '@/models/AnalysisData';

type Props = {
  data: AnalysisData[];
  onTurnUpdate?: (turn: number) => void;
};

const turn0: AnalysisData & { turn: string } = {
  move: '',
  prior: 1,
  score_lead: 0,
  turn_number: 0,
  utility: 0,
  visits: 0,
  winrate: 0.5,
  turn: '0',
};

export default function AnalysisChart(props: Props) {
  const data = useMemo(() => {
    return props.data.reduce(
      (acc, v) => {
        if (acc.find((d) => d.turn_number === v.turn_number) === undefined) {
          acc.push({
            ...v,
            turn: `${v.turn_number}`,
          });
        }
        return acc;
      },
      [turn0],
    );
  }, [props.data]);
  const maxScoreLead =
    useMemo(
      () =>
        data.reduce(
          (acc, v) =>
            Math.abs(v.score_lead) > acc ? Math.abs(v.score_lead) : acc,
          0,
        ),
      [data],
    ) * 1.2;

  const handlePlotEvent = (_: any, event: any) => {
    if (event.type === 'tooltip:show') {
      try {
        const turn = parseInt(event.data.title);
        props.onTurnUpdate?.(turn);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <DualAxes
      width={400}
      height={200}
      data={[data, data]}
      xField="turn"
      yField={['winrate', 'score_lead']}
      meta={{
        winrate: {
          min: 0,
          max: 1,
          formatter: (v: number) => {
            if (v > 0.5) {
              return `黒 ${v * 100}%`;
            }
            if (v < 0.5) {
              return `白 ${(1 - v) * 100}%`;
            }
            return '50%';
          },
          alias: '勝率',
        },
        score_lead: {
          min: -maxScoreLead,
          max: maxScoreLead,
          alias: '目差',
        },
      }}
      onEvent={handlePlotEvent}
    />
  );
}
