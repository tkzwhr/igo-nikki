import {
  parse as parseSgf,
  Property,
  stringify as stringifySgf,
} from '@sabaki/sgf';
import { parse as parseDate, format } from 'date-fns';

export type PlayerColor = 'BLACK' | 'WHITE';

export type GameData = {
  gameName?: string;
  gameComment?: string;
  playerColor?: PlayerColor;
  blackPlayer?: string;
  whitePlayer?: string;
  playedAt?: Date;
  handicap?: string;
  komi?: string;
  result?: string;
};

export function parse(sgf: string, playerColor?: PlayerColor): GameData | null {
  const parsed = parseSgf(sgf);
  if (parsed.length !== 1) {
    return null;
  }

  return {
    gameName: parsed[0].data['GN']?.[0],
    gameComment: parsed[0].data['GC']?.[0],
    playerColor: playerColor ?? 'BLACK',
    blackPlayer: parsed[0].data['PB']?.[0],
    whitePlayer: parsed[0].data['PW']?.[0],
    playedAt: toDate(parsed[0].data['DT']?.[0]),
    handicap: parsed[0].data['HA']?.[0],
    komi: parsed[0].data['KM']?.[0],
    result: parsed[0].data['RE']?.[0],
  };
}

export function update(sgf: string, gameData: GameData): string | null {
  const parsed = parseSgf(sgf);
  if (parsed.length !== 1) {
    return null;
  }

  const node = parsed[0];
  const updateProp = (value: string | undefined, propName: Property) => {
    if (value) {
      node.data[propName] = [value];
    } else {
      delete node.data[propName];
    }
  };

  updateProp(gameData.gameName, 'GN');
  updateProp(gameData.gameComment, 'GC');
  updateProp(gameData.blackPlayer, 'PB');
  updateProp(gameData.whitePlayer, 'PW');
  updateProp(
    gameData.playedAt ? format(gameData.playedAt, 'yyyy-MM-dd') : undefined,
    'DT',
  );
  updateProp(
    gameData.handicap?.startsWith('no') ? undefined : gameData.handicap,
    'HA',
  );
  updateProp(gameData.komi, 'KM');
  updateProp(gameData.result, 'RE');

  return trim(stringifySgf(parsed));
}

function toDate(text: string | undefined): Date | undefined {
  if (text === undefined) {
    return undefined;
  }

  return parseDate(text, 'yyyy-MM-dd', new Date());
}

function trim(text: string): string {
  return text
    .split(/\n/)
    .map((v) => v.trim())
    .join('');
}
