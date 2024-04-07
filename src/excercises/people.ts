import { authorize, getQuestion, setAnswer } from "../lib/utils.js";
import prisma from "../lib/prisma.js";
import { generateEmbedding } from "@/lib/generate-embedding-prisma.js";
import { v4 as uuidv4 } from "uuid";
import { TDocument, TPeople } from "@/types/index.js";
import { searchDocuments, searchPeople } from "@/lib/search-vector-db.js";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

async function main() {
  const token = await authorize("people");

  const task = await getQuestion(token!);

  const question = task.question;

  /*   await prisma.people.deleteMany({});

  const response = await fetch("https://tasks.aidevs.pl/data/people.json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const countPeople = data.length;
  console.log(`Found ${countPeople} people.`);

  for (const [i, p] of data.entries() as [number, TPeople][]) {
    const id = uuidv4();
    const embedData = JSON.stringify(p);

    await (async () => {
      const embedding = await generateEmbedding(embedData);
      console.log("embedding generated: ", i, "of", countPeople, "people.");

      const document = await prisma.people.create({
        data: {
          id,
          imie: p.imie,
          nazwisko: p.nazwisko,
          wiek: p.wiek,
          o_mnie: p.o_mnie,
          ulubiona_postac_z_kapitana_bomby: p.ulubiona_postac_z_kapitana_bomby,
          ulubiony_serial: p.ulubiony_serial,
          ulubiony_film: p.ulubiony_film,
          ulubiony_kolor: p.ulubiony_kolor,
        },
      });
      console.log("record generated: ", i, "of", countPeople, "people.");
      // Add the embedding
      await prisma.$executeRaw`
        UPDATE people
        SET embedding = ${embedding}::vector
        WHERE id = ${id}
    `;
      console.log("embedding inserted: ", i, "of", countPeople, "people.");
      return "ok done.";
    })();
  }

  const recordsCount = await prisma.people.count();
  console.log(`Added ${recordsCount} records to the database.`);
 */
  const people = await searchPeople(question);

  const context = people
    .map(
      (p: TPeople) =>
        `${p.imie} ~ ${p.nazwisko} ~ ${p.o_mnie} ~ ${p.ulubiona_postac_z_kapitana_bomby} ~ ${p.ulubiony_serial} ~ ${p.ulubiony_film} ~ ${p.ulubiony_kolor}`
    )
    .join(`\n~~~~\n`);

  console.log("context is:", context);

  const chat = new ChatOpenAI();
  const { content: answer } = await chat.invoke([
    new SystemMessage(`
        Answer questions as truthfully using the context below and nothing more. If you don't know the answer, say "don't know".
        context###${context}###
    `),
    new HumanMessage(question),
  ]);

  console.log("answer is:", answer);
  const reply = await setAnswer(token!, answer);
  console.log("response :", reply);
}

main();
