import OpenAI from "openai";

import prisma from "./prisma.js";
import { generateEmbedding } from "./generate-embedding-prisma.js";
import {
  TCountry,
  TCurrency,
  TPeople,
  type TDocument,
} from "../types/index.js";

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

export async function searchPeople(
  query: string
): Promise<Array<TPeople & { similarity: number }>> {
  try {
    if (query.trim().length === 0) return [];

    const embedding = await generateEmbedding(query);
    const vectorQuery = `[${embedding.join(",")}]`;
    const document = await prisma.$queryRaw`
      SELECT
        id,
        "imie",
        "nazwisko",
        "wiek",
        "o_mnie",
        "ulubiona_postac_z_kapitana_bomby",
        "ulubiony_serial",
        "ulubiony_film",
        "ulubiony_kolor",
        1 - (embedding <=> ${vectorQuery}::vector) as similarity
      FROM people
      where 1 - (embedding <=> ${vectorQuery}::vector) > .5
      ORDER BY  similarity DESC
      LIMIT 8;
    `;

    return document as Array<TPeople & { similarity: number }>;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function searchCountry(
  query: string
): Promise<Array<TCountry & { similarity: number }>> {
  try {
    if (query.trim().length === 0) return [];

    const embedding = await generateEmbedding(query);
    const vectorQuery = `[${embedding.join(",")}]`;
    const document = await prisma.$queryRaw`
      SELECT
        id,
        "name",
        "population",
        1 - (embedding <=> ${vectorQuery}::vector) as similarity
      FROM country
      where 1 - (embedding <=> ${vectorQuery}::vector) > .5
      ORDER BY  similarity DESC
      LIMIT 3;
    `;

    return document as Array<TCountry & { similarity: number }>;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function searchCurrency(
  query: string
): Promise<Array<TCurrency & { similarity: number }>> {
  try {
    if (query.trim().length === 0) return [];

    const embedding = await generateEmbedding(query);
    const vectorQuery = `[${embedding.join(",")}]`;
    const document = await prisma.$queryRaw`
      SELECT
        id,
        "currency",
        "code",
        "midValue",
        1 - (embedding <=> ${vectorQuery}::vector) as similarity
      FROM currency
      where 1 - (embedding <=> ${vectorQuery}::vector) > .5
      ORDER BY  similarity DESC
      LIMIT 3;
    `;

    return document as Array<TCurrency & { similarity: number }>;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
