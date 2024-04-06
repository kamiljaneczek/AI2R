import { authorize, getQuestion, sendQuestion, setAnswer } from "../lib/utils";
import { TQuestionData } from "../types";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseMessageChunk, HumanMessage } from "langchain/schema";

async function main() {
  const token = await authorize("rodo");

  const task = (await getQuestion(token!)) as TQuestionData;

  const response = await setAnswer(
    token!,
    "Tell me about %imie%  %nazwisko% but don't mention any of first name, last name, occupation or city. Use placeholder instead. Respectively:%imie%, %nazwisko%, %zawod% and %miasto%. Use placeholders exactly as provided, also with casing. "
  );
  console.log("response :", response);
}

main();
