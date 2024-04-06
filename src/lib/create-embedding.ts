import OpenAI from "openai";

const chat = new OpenAI();

export async function createEmbedding(text: string) {
  const embedding = await chat.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
    encoding_format: "float",
  });

  console.log(embedding);
  return embedding;
}

// Inicjalizacja domyślnego modelu, czyli gpt-3.5-turbo

// Wywołanie modelu poprzez przesłanie tablicy wiadomości.
// W tym przypadku to proste przywitanie
