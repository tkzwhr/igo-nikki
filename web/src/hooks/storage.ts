import { useMutation } from "@apollo/client";
import { useCallback } from "react";

import DeleteRecord from "@/graphql/delete_record.graphql";
import GetRecords from "@/graphql/get_records.graphql";
import InsertAnalysisJob from "@/graphql/insert_analysis_job.graphql";
import InsertRecord from "@/graphql/insert_record.graphql";
import type GameData from "@/models/GameData";

export function useStorage() {
  const [insertRecordFn] = useMutation(InsertRecord, {
    refetchQueries: [GetRecords],
  });

  const [deleteRecordFn] = useMutation(DeleteRecord, {
    refetchQueries: [GetRecords],
  });

  const [insertAnalysisJobFn] = useMutation(InsertAnalysisJob);

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
        refetchQueries: [GetRecords],
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
