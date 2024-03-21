import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

const chat = new ChatOpenAI();

export async function chatInvoke(text: string) {
  const { content } = await chat.invoke([new HumanMessage(text)]);
  console.log(content);
  return content;
}

// Inicjalizacja domyślnego modelu, czyli gpt-3.5-turbo

// Wywołanie modelu poprzez przesłanie tablicy wiadomości.
// W tym przypadku to proste przywitanie
