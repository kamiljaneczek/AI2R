import { authorize, getQuestion, sendQuestion, setAnswer } from "../lib/utils";
import { moderationOpenAI } from "../lib/moderation-openAI";
import { chatInvoke } from "../lib/completion";
import { TQuestionData } from "../types";
import { create } from "domain";
import { createEmbedding } from "../lib/create-embedding";
import { getEmbedding } from "../samples/chat/memory";
import { callWhisper } from "../lib/whisper";
import { Document } from "langchain/document";

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
