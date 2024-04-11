import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import {
  AIMessage,
  HumanMessage,
  MessageContent,
  SystemMessage,
} from "@langchain/core/messages";
import { IMessage } from "../types.js";

dotenv.config();

const API_URL = "https://api.openai.com/v1/chat/completions";
const max_tokens = 1500;
const temperature = 0.8;
const model = "gpt-3.5-turbo";

export async function openAICompletion(
  messages: IMessage[]
): Promise<string | MessageContent> {
  try {
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      temperature: temperature,
      maxTokens: max_tokens,
      modelName: model,
      streaming: false,
    });

    const { content } = await chat.invoke(
      messages.map((message) => {
        switch (message.role) {
          case "user":
            return new HumanMessage(message.content);
          case "system":
            return new SystemMessage(message.content);
          case "assistant":
            return new AIMessage(message.content);
          default:
            return new AIMessage(message.content);
        }
      }),
      {
        callbacks: [
          {
            handleLLMNewToken(token: string) {
              console.log("New token:", token);
            },
          },
        ],
      }
    );

    return content;
  } catch (err: any) {
    throw new Error(err.message);
  }
}
