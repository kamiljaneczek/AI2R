import {
  authorize,
  getQuestion,
  sendQuestion,
  setAnswer,
} from "../lib/utils.js";
import prisma from "../lib/prisma.js";
import { generateEmbedding } from "@/lib/generate-embedding-prisma.js";
import { v4 as uuidv4 } from "uuid";
import { TDocument } from "@/types/index.js";
import { searchDocuments } from "@/lib/search-vector-db.js";

async function main() {
  const token = await authorize("search");

  const task = await getQuestion(token!);

  const question = task.question;

  await prisma.document.deleteMany({});

  const response = await fetch("https://unknow.news/archiwum_aidevs.json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  const promises = await data.map(async (p: TDocument) => {
    const id = uuidv4();
    const embedding = await generateEmbedding(p.info);

    const document = await prisma.document.create({
      data: {
        id,
        name: p.title,
        url: p.url,
        date: p.date,
      },
    });
    // Add the embedding
    await prisma.$executeRaw`
        UPDATE document
        SET embedding = ${embedding}::vector
        WHERE id = ${id}
    `;
  });

  await Promise.all(promises);

  const recordsCount = await prisma.document.count();
  console.log(`Added ${recordsCount} records to the database.`);

  const documents = await searchDocuments(question);
  const url = documents[0].url;

  console.log("answer is:", url);
  const reply = await setAnswer(token!, url);
  console.log("response :", reply);
}

main();
