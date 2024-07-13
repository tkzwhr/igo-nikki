import GameData from "@/models/GameData";
import type { Record } from "@/models/Record";
import GET_RECORDS from "@/queries/getRecords";
import { useSuspenseQuery } from "@apollo/client";
import { AuthContext } from "@tkzwhr/react-hasura-auth0";
import { format } from "date-fns";
import {
  type Dispatch,
  type MutableRefObject,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

export type ExtendedRecord = Record & {
  gameName: string | null;
  date: string | null;
  won: boolean;
};

type Store = {
  // biome-ignore lint/suspicious/noExplicitAny: ignore
  goPlayerRef: MutableRefObject<any>;
  records: ExtendedRecord[];
  recordId: number | null;
  showsImportRecordModal: boolean;
  analysisDisplayMode: "winrate" | "score_lead";
};

type Action =
  | {
      type: "SET_RECORDS";
      data: Record[];
    }
  | {
      type: "SET_RECORD_ID";
      recordId: number | null;
    }
  | {
      type: "SET_SHOWS_IMPORT_RECORD_MODAL";
      flag: boolean;
    }
  | {
      type: "SET_ANALYSIS_DISPLAY_MODE";
      mode: "winrate" | "score_lead";
    };

const fn = (store: Store, action: Action): Store => {
  switch (action.type) {
    case "SET_RECORDS": {
      const records = action.data.map((record) => {
        const gameData = GameData.parse(record.sgf_text);
        const rawDate = gameData?.playedAt ?? new Date(0);
        const date =
          gameData?.playedAt !== undefined
            ? format(gameData?.playedAt, "yyyy年M月d日")
            : "(不明)";
        const gameName = gameData?.gameName ?? "(タイトルなし)";
        const won =
          (gameData?.result?.type !== "draw" &&
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
      records.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
      return { ...store, records };
    }
    case "SET_RECORD_ID":
      return { ...store, recordId: action.recordId };
    case "SET_SHOWS_IMPORT_RECORD_MODAL":
      return { ...store, showsImportRecordModal: action.flag };
    case "SET_ANALYSIS_DISPLAY_MODE":
      return { ...store, analysisDisplayMode: action.mode };
  }
};

export function useHomeReducer(): [Store, Dispatch<Action>] {
  const authState = useContext(AuthContext);
  const userId =
    authState.mode === "auth0" ? authState.auth0.user?.sub : undefined;
  const { data } = useSuspenseQuery(GET_RECORDS, {
    variables: { id: userId ?? "" },
  });
  // biome-ignore lint/suspicious/noExplicitAny: ignore
  const goPlayerRef = useRef<any>(null);

  const initial: Store = {
    goPlayerRef,
    records: [],
    recordId: null,
    showsImportRecordModal: false,
    analysisDisplayMode: "winrate",
  };
  const [store, dispatch] = useReducer(fn, initial);

  useEffect(() => {
    const records: Record[] = data.records.map((r) => ({
      id: r.id,
      sgf_text: r.sgf_text,
      player_color: r.player_color,
      analysis_job: r.analysis_job
        ? {
            started_at: r.analysis_job.started_at ?? null,
            finished_at: r.analysis_job.finished_at ?? null,
            error_message: r.analysis_job.error_message ?? null,
          }
        : null,
    }));
    dispatch({ type: "SET_RECORDS", data: records });
  }, [data]);

  return [store, dispatch];
}

export const HomeContext = createContext(
  {} as ReturnType<typeof useHomeReducer>,
);
