import {
  authorize,
  getQuestion,
  sendQuestion,
  setAnswer,
} from "../lib/utils.js";
import { moderationOpenAI } from "../lib/moderation-openAI.js";
import { chatInvoke } from "../lib/completion.js";
import { TQuestionData } from "../types/index.js";
import { create } from "domain";
import { createEmbedding } from "../lib/create-embedding.js";
import { getEmbedding } from "../samples/chat/memory.js";

async function main() {
  const token = await authorize("embedding ");

  const task = (await getQuestion(token!)) as TQuestionData;

  const embedding = await createEmbedding("Hawaiian pizza");

  console.log("embedding :", embedding.data[0].embedding);

  const prompt = `Zapamiętaj informacje o każdej osobie z tego tekstu: " ${task.input}"i odpowiedz na pytanie: " ${task.question}"`;
  const answer = await chatInvoke(prompt);

  //console.log("answer :", answer);
  const response = await setAnswer(token!, embedding.data[0].embedding);
  console.log("response :", response);
}

main();
