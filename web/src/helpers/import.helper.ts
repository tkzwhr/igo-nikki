import { PlayerColor } from '@/helpers/sgf.helper';

export type ImportData = {
  sgf: string;
  playerColor: PlayerColor;
};

export async function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const sgf = reader.result;
      if (typeof sgf !== 'string') {
        return;
      }
      resolve(sgf);
    };

    reader.readAsText(file);
  });
}

export function isValidCosumiUrl(url: string): boolean {
  return url.match(/^https:\/\/www.cosumi.net\/replay\//) !== null;
}

export function parseCosumiUrl(url: string): string {
  const parsed = new URL(url);
  const SZ = parsed.searchParams.get('bs')!;
  const PB = parsed.searchParams.get('b')!;
  const PW = parsed.searchParams.get('w')!;
  const KM = parsed.searchParams.get('k')!;
  const RE = parsed.searchParams
    .get('r')!
    .replace('b', 'b+')
    .replace('w', 'w+')
    .toUpperCase();
  const pointsStr = parsed.searchParams
    .get('gr')!
    .match(/.{2}/g)!
    .map((coord, index) => {
      const c = index % 2 === 0 ? 'B' : 'W';
      const p = coord !== 'tt' ? coord : '';
      return `;${c}[${p}]`;
    })
    .join('');

  return `(;GM[1]FF[4]GN[COSUMIでの対局]PB[${PB}]PW[${PW}]SZ[${SZ}]KM[${KM}]RE[${RE}]${pointsStr})`;
}
