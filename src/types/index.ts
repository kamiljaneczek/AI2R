export type TQuestionData = {
  code: number;
  msg: string;
  cookie?: string;
  input?: string[];
  blog?: string[];
  question?: string;
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

export type TDocument = {
  id: string;
  title: string;
  name: string;
  info: string;
  url: string;
  date: string;
};
