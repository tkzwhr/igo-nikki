import { useMutation } from "@apollo/client";
import { useCallback } from "react";

import type GameData from "@/models/GameData";
import DELETE_RECORD from "@/queries/deleteRecord";
import GET_RECORDS from "@/queries/getRecords";
import INSERT_ANALYSIS_JOB from "@/queries/insertAnalysisJob";
import INSERT_RECORD from "@/queries/insertRecord";

export function useStorage() {
  const [insertRecordFn] = useMutation(INSERT_RECORD, {
    refetchQueries: [GET_RECORDS],
  });

  const [deleteRecordFn] = useMutation(DELETE_RECORD, {
    refetchQueries: [GET_RECORDS],
  });

  const [insertAnalysisJobFn] = useMutation(INSERT_ANALYSIS_JOB);

  const deleteRecord = useCallback(
    async (id: number) => {
      await deleteRecordFn({ variables: { pk: id } });
    },
    [deleteRecordFn],
  );

  const insertRecord = useCallback(
    async (gameData: GameData) => {
      await insertRecordFn({
        variables: {
          sgf: gameData.stringify(),
          playerColor: gameData.playerColor ?? "BLACK",
        },
      });
    },
    [insertRecordFn],
  );

  const insertAnalysisJob = useCallback(
    async (id: number) => {
      await insertAnalysisJobFn({
        variables: { recordId: id },
        refetchQueries: [GET_RECORDS],
      });
    },
    [insertAnalysisJobFn],
  );

  return {
    deleteRecord,
    insertRecord,
    insertAnalysisJob,
  };
}
