export type TQuestionData = {
  code: number;
  msg: string;
  cookie?: string;
  input?: string[];
  blog?: string[];
};

export type TTokenData = {
  code: number;
  msg: string;
  token: string;
};

export type TTAnswerData = {
  code: number;
  msg: string;
  note: string;
};
