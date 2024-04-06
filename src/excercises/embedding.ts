import { authorize, getQuestion, sendQuestion, setAnswer } from "../lib/utils";
import { moderationOpenAI } from "../lib/moderation-openAI";
import { chatInvoke } from "../lib/completion";
import { TQuestionData } from "../types";
import { create } from "domain";
import { createEmbedding } from "../lib/create-embedding";
import { getEmbedding } from "../samples/chat/memory";

async function main() {
  const token = await authorize("embedding ");

  const task = (await getQuestion(token!)) as TQuestionData;

  const embedding = await createEmbedding("Hawaiian pizza");

  console.log("embedding :", embedding.data[0].embedding);

  //const prompt = `Zapamiętaj informacje o każdej osobie z tego tekstu: " ${task.input}"i odpowiedz na pytanie: " ${task.question}"`;
  //const answer = await chatInvoke(prompt);

  //console.log("answer :", answer);
  const response = await setAnswer(token!, embedding.data[0].embedding);
  console.log("response :", response);
}

main();
