import {
  authorize,
  getQuestion,
  sendQuestion,
  setAnswer,
} from "../lib/utils.js";

import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  BaseMessageChunk,
  HumanMessage,
  SystemMessage,
} from "langchain/schema";
import { context } from "../samples/02_langchain_format/02_context.js";

async function main() {
  const token = await authorize("scraper");

  const task = await getQuestion(token!);
  const url = task.input! as string;
  const question = task.question! as string;

  const result = await fetch(url, { method: "GET" });
  const context = await result.text();
  const chat = new ChatOpenAI();
  const message = new HumanMessage(question);
  const systemPrompt = `Basing on information in Context answer user question. Limit your answer to 130 characters.
  ~~~~~~~~~~
  Context:
  ${context}`;

  const systemMessage = new SystemMessage(systemPrompt);
  const answer = await chat.invoke([systemMessage, message]);
  console.log("answer :", answer.lc_kwargs.content);
  const response = await setAnswer(token!, answer.lc_kwargs.content);
  console.log("response :", response);
}

main();
