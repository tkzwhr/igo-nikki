export type Record = {
  id: number;
  sgf_text: string;
  player_color: string;
  analysis_job: {
    started_at: string | null;
    finished_at: string | null;
    error_message: string | null;
  } | null;
};
