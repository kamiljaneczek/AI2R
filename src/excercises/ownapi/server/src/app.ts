import Fastify, { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyReply, FastifyRequest } from "fastify";

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "langchain/chat_models/openai";

interface IQueryString {
  name: string;
}

interface IParams {
  name: string;
}

export default async function (
  instance: FastifyInstance,
  opts: FastifyServerOptions,
  done: () => void
) {
  type content = {
    question: string;
  };

  instance.register(
    async (instance: FastifyInstance, opts: FastifyServerOptions, done) => {
      instance.post(
        "/aidevs",
        async (
          req: FastifyRequest<{
            Body: content;
          }>,
          res: FastifyReply
        ) => {
          const pBody = req.body;
          const question = pBody.question;

          const systemPrompt =
            "Odpowiedz na pytanie użytkownika. Udziel zwięzłej odpowiedzi.";

          const chat = new ChatOpenAI({
            temperature: 0.8,
            modelName: "gpt-4-turbo-preview",
          });

          const content = await chat.invoke([
            new SystemMessage(systemPrompt),

            new HumanMessage(question),
          ]);
          console.log("content: ", content);
          console.log("question: ", question);
          const response = {
            reply: content.content.toString(),
          };
          console.log("response: ", response);

          res.status(200).send(response);
        }
      );
      done();
    },
    {
      prefix: "/hello",
    }
  );

  done();
}
