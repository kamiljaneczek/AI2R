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

async function main() {
  const token = await authorize("knowledge");

  const task = await getQuestion(token!);
  const question = task.question;
  const userMessage = new HumanMessage(question);

  const systemMessage =
    new SystemMessage(`Basing on question from user (in Poslih), choose one of three categories to which questions belongs:
  - currency - ONLY when asked about exchange rates
  - countries - ONLY when asked about countries and their population
  - other
  Answer with category, nothing else.
  
  Examples:
  Jakie są kursy walut? -> currency
  Jaka jest populacja Polski? -> countries
  Kto był prezydentem Polski w 2020 roku? -> other
  Jaka jest stolica Polski? -> other
  
  `);

  const chat = new ChatOpenAI();
  const response = await chat.invoke([systemMessage, userMessage]);

  console.log("Route :", response.content);

  let answer,
    context = "";
  let content;

  switch (response.content) {
    case "currency":
      const currency = await searchCurrency(question);

      context = currency
        .map((p: TCurrency) => `${p.currency} ~ ${p.code} ~ ${p.midValue}`)
        .join(`\n~~~~\n`);
      const currencyContent = await chat.invoke([
        new SystemMessage(`
        Answer questions as truthfully using the context below and nothing more. 
        Questin will be in Polish.
        Context includes list of current exchange rates.
        Match currency that user is asking with field curreency. Reply with the rate on midValues field.
        Reply ONLY with the currency rate.
        If you don't know the answer, say "don't know".
        context###${context}###
    `),
        new HumanMessage(question),
      ]);
      answer = currencyContent.content.toString();

      break;
    case "countries":
      const country = await searchCountry(question);

      context = country
        .map((p: TCountry) => `${p.id} ~ ${p.name} ~ ${p.population}`)
        .join(`\n~~~~\n`);
      const countryContent = await chat.invoke([
        new SystemMessage(`
        Answer questions (in Polish) as truthfully using the context below and nothing more. 
        Context includes list of countries with their population (in English).
        If you don't know the answer, say "don't know".
        Reply ONLY with the population - just number, no spaces or commas.
        context###${context}###
    `),
        new HumanMessage(question),
      ]);
      answer = countryContent.content.toString();
      break;
    case "other":
      const response = await chat.invoke([
        "Answer user question in Polish. Be extra brief and conicise.",
        userMessage,
      ]);
      answer = response.content.toString();
      console.log("response :", response.content);

      break;
    default:
      console.log("default");
  }

  console.log("answer is:", answer);
  const reply = await setAnswer(token!, answer);
  console.log("response :", reply);
}

main();
