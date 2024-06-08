import { useSuspenseQuery } from '@apollo/client';
import { format } from 'date-fns';
import {
  createContext,
  Dispatch,
  MutableRefObject,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import { AppContext } from '@/App';
import GetRecords from '@/graphql/get_records.graphql';
import GameData from '@/models/GameData';
import { Record } from '@/models/Record';

export type ExtendedRecord = Record & {
  gameName: string | null;
  date: string | null;
  won: boolean;
};

type Store = {
  goPlayerRef: MutableRefObject<any>;
  records: ExtendedRecord[];
  recordId: number | null;
  showsImportRecordModal: boolean;
  analysisDisplayMode: 'winrate' | 'score_lead';
};

type Action =
  | {
      type: 'SET_RECORDS';
      data: Record[];
    }
  | {
      type: 'SET_RECORD_ID';
      recordId: number | null;
    }
  | {
      type: 'SET_SHOWS_IMPORT_RECORD_MODAL';
      flag: boolean;
    }
  | {
      type: 'SET_ANALYSIS_DISPLAY_MODE';
      mode: 'winrate' | 'score_lead';
    };

const fn = (store: Store, action: Action): Store => {
  switch (action.type) {
    case 'SET_RECORDS': {
      const records = action.data.map((record) => {
        const gameData = GameData.parse(record.sgf_text);
        const rawDate = gameData?.playedAt ?? new Date(0);
        const date =
          gameData?.playedAt !== undefined
            ? format(gameData?.playedAt, 'yyyy年M月d日')
            : '(不明)';
        const gameName = gameData?.gameName ?? '(タイトルなし)';
        const won =
          (gameData?.result?.type !== 'draw' &&
            gameData?.result?.color?.startsWith(
              record.player_color.charAt(0),
            )) ??
          false;

        return {
          ...record,
          gameName,
          rawDate,
          date,
          won,
        };
      });
      records.sort((a, b) => b.rawDate - a.rawDate);
      return { ...store, records };
    }
    case 'SET_RECORD_ID':
      return { ...store, recordId: action.recordId };
    case 'SET_SHOWS_IMPORT_RECORD_MODAL':
      return { ...store, showsImportRecordModal: action.flag };
    case 'SET_ANALYSIS_DISPLAY_MODE':
      return { ...store, analysisDisplayMode: action.mode };
  }
};

export function useHomeReducer(): [Store, Dispatch<Action>] {
  const appContext = useContext(AppContext);
  const { data } = useSuspenseQuery<any>(GetRecords, {
    variables: { id: appContext?.userId ?? '' },
  });
  const goPlayerRef = useRef<any>(null);

  const initial: Store = {
    goPlayerRef,
    records: [],
    recordId: null,
    showsImportRecordModal: false,
    analysisDisplayMode: 'winrate',
  };
  const [store, dispatch] = useReducer(fn, initial);

  useEffect(() => {
    dispatch({ type: 'SET_RECORDS', data: data['records'] ?? [] });
  }, [data]);

  return [store, dispatch];
}

export const HomeContext = createContext(
  {} as ReturnType<typeof useHomeReducer>,
);
