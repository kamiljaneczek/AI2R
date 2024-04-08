import { authorize, getQuestion, setAnswer } from "../../lib/utils.js";
import prisma from "../../lib/prisma.js";
import { generateEmbedding } from "@/lib/generate-embedding-prisma.js";
import { v4 as uuidv4 } from "uuid";
import { TCountry, TDocument, TPeople } from "@/types/index.js";
import { searchDocuments, searchPeople } from "@/lib/search-vector-db.js";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const COUNTRIES_URL = "https://restcountries.com/v3.1/all";

async function main() {
  const response = await fetch(COUNTRIES_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const countCountries = data.length;
  console.log(`Found ${countCountries} countires.`);

  for (const [i, c] of data.entries() as [number, TCountry][]) {
    const id = uuidv4();
    const nameString = JSON.stringify(c.name);
    const embedData = JSON.stringify({
      id,
      name: nameString,
      population: c.population,
    });

    await (async () => {
      const embedding = await generateEmbedding(embedData);
      console.log(
        "embedding generated: ",
        i,
        "of",
        countCountries,
        "countries."
      );

      const document = await prisma.country.create({
        data: {
          id,
          name: c.name.common,
          population: c.population,
        },
      });
      console.log("record generated: ", i, "of", countCountries, "Countries.");
      // Add the embedding
      await prisma.$executeRaw`
        UPDATE country
        SET embedding = ${embedding}::vector
        WHERE id = ${id}
    `;
      console.log("embedding inserted: ", i, "of", countCountries, "people.");
      return "ok done.";
    })();
  }

  const recordsCount = await prisma.country.count();
  console.log(`Added ${recordsCount} records to the database.`);
}
main();
