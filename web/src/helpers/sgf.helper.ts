import { parse as parseSgf, stringify as stringifySgf } from '@sabaki/sgf';

import { AnalysisData } from '@/models/AnalysisData';

type Analysis = {
  analysis: AnalysisData[];
};

export function mergeAnalysis(
  sgfText: string,
  { analysis }: Analysis,
  mode: 'winrate' | 'score_lead',
): string {
  const sgfNode = parseSgf(sgfText);

  let node = sgfNode[0];
  let turn = 0;

  const size = parseInt(node.data.SZ![0].split(':')[0]);

  while (node !== undefined) {
    const data = analysis.filter((a) => a.turn_number === turn);
    node.data.LB = data.map((a) => {
      const p = translateCoord(a.move, size);

      let s: string;
      switch (mode) {
        case 'winrate': {
          const ss = Math.round(a.winrate * 100);
          s = a.turn_number % 2 == 0 ? `${ss}%` : `${100 - ss}%`;
          break;
        }
        case 'score_lead': {
          const ss = Math.round(a.score_lead);
          s = ss === 0 ? '0' : ss > 0 ? `B+${ss}` : `W+${-ss}`;
          break;
        }
      }

      return `${p}:${s}`;
    });
    node = node.children[0];
    turn += 1;
  }

  return stringifySgf(sgfNode);
}

function translateCoord(a1: string, size: number): string {
  const base = '`'.charCodeAt(0);
  const coord = a1.toLowerCase();

  const cc = coord.charCodeAt(0);
  const c = cc >= 'i'.charCodeAt(0) ? cc - 1 : cc;

  const rr = base + parseInt(coord.slice(1));
  const r = size + 1 - rr + 2 * base;

  return String.fromCharCode(c, r);
}
