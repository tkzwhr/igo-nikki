import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { useCallback } from 'react';

const GET_RECORDS = gql`
  query GetRecords {
    records {
      id
      sgf_text
      player_color
    }
  }
`;

const INSERT_RECORD = gql`
  mutation InsertRecord($sgf: String!, $playerColor: String!) {
    insert_records_one(object: { sgf_text: $sgf, player_color: $playerColor }) {
      id
    }
  }
`;

const DELETE_RECORD = gql`
  mutation DeleteRecord($pk: Int!) {
    delete_records_by_pk(id: $pk) {
      id
    }
  }
`;

export default function useRecord(): [
  {
    data: { id: number; sgf_text: string; player_color: string }[];
    loading: boolean;
  },
  {
    fetchRecords: () => Promise<void>;
    insertRecord: (sgf: string, playerColor: string) => Promise<void>;
    deleteRecord: (pk: number) => Promise<void>;
  },
] {
  const [fetchRecordsFn, { loading, data }] = useLazyQuery(GET_RECORDS);
  const [insertRecordFn] = useMutation(INSERT_RECORD, {
    refetchQueries: [GET_RECORDS],
  });
  const [deleteRecordFn] = useMutation(DELETE_RECORD, {
    refetchQueries: [GET_RECORDS],
  });

  const fetchRecords = useCallback(async () => {
    await fetchRecordsFn();
  }, []);

  const insertRecord = useCallback(async (sgf: string, playerColor: string) => {
    await insertRecordFn({ variables: { sgf, playerColor } });
  }, []);

  const deleteRecord = useCallback(async (pk: number) => {
    await deleteRecordFn({ variables: { pk } });
  }, []);

  return [
    {
      loading,
      data: data && data['records'] ? data['records'] : [],
    },
    {
      fetchRecords,
      insertRecord,
      deleteRecord,
    },
  ];
}
