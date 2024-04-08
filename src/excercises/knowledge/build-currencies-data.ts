import { authorize, getQuestion, setAnswer } from "../../lib/utils.js";
import prisma from "../../lib/prisma.js";
import { generateEmbedding } from "@/lib/generate-embedding-prisma.js";
import { v4 as uuidv4 } from "uuid";
import { TCurrency, TDocument, TPeople } from "@/types/index.js";
import { searchDocuments, searchPeople } from "@/lib/search-vector-db.js";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const CURRENCY_URL =
  "https://api.nbp.pl/api/exchangerates/tables/A?format=Json";

const response = await fetch(CURRENCY_URL, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});
const data = await response.json();
const rates = data[0].rates;

const countCurrrency = rates.length;
console.log(`Found ${countCurrrency} curriencies.`);

for (const [i, c] of rates.entries() as [number, TCurrency][]) {
  const id = uuidv4();
  const nameString = JSON.stringify(c.currency);
  const embedData = JSON.stringify({
    id,
    name: c.currency,
    code: c.code,
    midValueValue: c.midValue,
  });

  await (async () => {
    const embedding = await generateEmbedding(embedData);
    console.log(
      "embedding generated: ",
      i,
      "of",
      countCurrrency,
      "curriencies."
    );

    const document = await prisma.currency.create({
      data: {
        id,
        currency: c.currency,
        code: c.code,
        midValue: c.mid!.toString(),
      },
    });
    console.log("record generated: ", i, "of", countCurrrency, "curriencies.");
    // Add the embedding
    await prisma.$executeRaw`
        UPDATE currency
        SET embedding = ${embedding}::vector
        WHERE id = ${id}
    `;
    console.log(
      "embedding inserted: ",
      i,
      "of",
      countCurrrency,
      "curriencies."
    );
    return "ok done.";
  })();
}

const recordsCount = await prisma.currency.count();
console.log(`Added ${recordsCount} records to the database.`);
