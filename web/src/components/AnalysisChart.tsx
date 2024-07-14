import type { AnalysisData } from "@/models/AnalysisData";
import { DualAxes } from "@ant-design/charts";
import { useMemo } from "react";

type Props = {
  data: AnalysisData[];
  onTurnUpdate?: (turn: number) => void;
};

const turn0: AnalysisData & { turn: string } = {
  move: "",
  prior: 1,
  score_lead: 0,
  turn_number: 0,
  utility: 0,
  visits: 0,
  winrate: 0.5,
  turn: "0",
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
  const maxScoreLead = Math.round(
    useMemo(
      () =>
        data.reduce(
          (acc, v) =>
            Math.abs(v.score_lead) > acc ? Math.abs(v.score_lead) : acc,
          0,
        ),
      [data],
    ) * 1.2,
  );

  // biome-ignore lint/suspicious/noExplicitAny: ignore
  const handlePlotEvent = (data: any) => {
    // biome-ignore lint/suspicious/noExplicitAny: ignore
    data.chart.on("tooltip:show", (ev: any) => {
      try {
        const turn = Number.parseInt(ev.data.data.x);
        props.onTurnUpdate?.(turn);
      } catch (e) {
        console.warn(e);
      }
    });
  };

  return (
    <DualAxes
      width={400}
      height={250}
      data={data}
      legend={true}
      xField="turn"
      onReady={handlePlotEvent}
    >
      {[
        {
          type: "line",
          yField: "winrate",
          shapeField: "smooth",
          axis: {
            y: {
              position: "right",
              title: "勝率",
              labelFormatter: (v: number) => {
                if (v > 0.5) {
                  return `黒 ${v * 100}%`;
                }
                if (v < 0.5) {
                  return `白 ${(1 - v) * 100}%`;
                }
                return "50%";
              },
            },
          },
          scale: {
            y: {
              type: "linear",
              domain: [0, 1],
              tickMethod: () => [0, 0.25, 0.5, 0.75, 1.0],
            },
          },
        },
        {
          type: "line",
          yField: "score_lead",
          shapeField: "hvh",
          axis: {
            y: {
              position: "left",
              title: "目差",
            },
          },
          scale: {
            y: {
              type: "linear",
              domain: [-maxScoreLead, maxScoreLead],
              tickMethod: () => [
                -maxScoreLead,
                -maxScoreLead / 2,
                0,
                maxScoreLead / 2,
                maxScoreLead,
              ],
            },
          },
        },
      ]}
    </DualAxes>
  );
}
