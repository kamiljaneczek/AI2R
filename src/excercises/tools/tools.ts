import { authorize, getQuestion, setAnswer } from "../../lib/utils.js";
import prisma from "../../lib/prisma.js";
import { generateEmbedding } from "@/lib/generate-embedding-prisma.js";
import { v4 as uuidv4 } from "uuid";
import { TCountry, TCurrency, TDocument, TPeople } from "@/types/index.js";
import {
  searchCurrency,
  searchDocuments,
  searchPeople,
  searchCountry,
} from "@/lib/search-vector-db.js";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { parseFunctionCall } from "./helper.js";
import { eventSchema, taskSchema } from "./schema.js";

async function main() {
  const token = await authorize("tools");

  const task = await getQuestion(token!);
  const question = task.question;

  const systemMesaage = new SystemMessage(
    `Basing on user prompt categorize user request it into two categories and respective functions to use:
    - createTask - user has to do someting, not related to specific date. 
    - createEvent - is related to specific date and represent some event in calendar.
    
    createTask is the default option. If you are not sure, choose createTask. Only use the functions you have been provided with.
    Today is ${new Date().toDateString()}`
  );

  const model = new ChatOpenAI({
    modelName: "gpt-4-0613",
  }).bind({ functions: [eventSchema, taskSchema] });

  const result = await model.invoke([
    systemMesaage,
    new HumanMessage(question),
  ]);

  const action = parseFunctionCall(result);
  console.log("action is:", action);
  const answer = action?.args;
  console.log("answer is:", answer);
  const reply = await setAnswer(token!, answer);
  console.log("response :", reply);
}

main();
