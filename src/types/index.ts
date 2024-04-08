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

export type TPeople = {
  id: string;
  imie: string;
  nazwisko: string;
  wiek: number;
  o_mnie: string;
  ulubiona_postac_z_kapitana_bomby: string;
  ulubiony_serial: string;
  ulubiony_film: string;
  ulubiony_kolor: string;
};

export type TCountry = {
  id: string;
  name: {
    common: string;
    official: string;
  };
  population: number;
};

export type TCurrency = {
  id: string;
  currency: string;
  code: string;
  midValue?: string;
  mid?: string;
};
