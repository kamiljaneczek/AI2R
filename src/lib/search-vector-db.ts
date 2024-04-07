import OpenAI from "openai";

import prisma from "./prisma.js";
import { generateEmbedding } from "./generate-embedding-prisma.js";
import { type TDocument } from "../types/index.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function searchDocuments(
  query: string
): Promise<Array<TDocument & { similarity: number }>> {
  try {
    if (query.trim().length === 0) return [];

    const embedding = await generateEmbedding(query);
    const vectorQuery = `[${embedding.join(",")}]`;
    const document = await prisma.$queryRaw`
      SELECT
        id,
        "name",
        "url",
        1 - (embedding <=> ${vectorQuery}::vector) as similarity
      FROM document
      where 1 - (embedding <=> ${vectorQuery}::vector) > .5
      ORDER BY  similarity DESC
      LIMIT 8;
    `;

    return document as Array<TDocument & { similarity: number }>;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
