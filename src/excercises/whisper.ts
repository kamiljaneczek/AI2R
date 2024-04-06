import {
  authorize,
  getQuestion,
  sendQuestion,
  setAnswer,
} from "../lib/utils.js";

import { TQuestionData } from "../types/index.js";

import { callWhisper } from "../lib/whisper.js";

async function main() {
  const token = await authorize("whisper");

  const task = (await getQuestion(token!)) as TQuestionData;

  const docs = await callWhisper();

  //const prompt = `Zapamiętaj informacje o każdej osobie z tego tekstu: " ${task.input}"i odpowiedz na pytanie: " ${task.question}"`;
  const answer = docs[0].pageContent;
  console.log(docs);

  console.log("answer :", answer);
  const response = await setAnswer(token!, answer);
  console.log("response :", response);
}

main();
