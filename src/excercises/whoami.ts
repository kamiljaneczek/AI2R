import {
  authorize,
  getQuestion,
  sendQuestion,
  setAnswer,
} from "../lib/utils.js";
import { TQuestionData } from "../types/index.js";

import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  BaseMessageChunk,
  HumanMessage,
  SystemMessage,
} from "langchain/schema";

async function main() {
  const token = await authorize("whoami");

  const systemPrompt = `Basing on hints provided by user guess the character being described. 
  Answer with character name only when you are fully and absolutely certain of your answer.
  Before that as for one more hint by typing HINT, to double chekc your are rigth.
   Otherwise just answer HINT to get another hint.`;

  const systemMessage = new SystemMessage(systemPrompt);
  const messages = [systemMessage];
  let answer: TAnswer = {
    lc_kwargs: {
      content: "",
    },
  };

  type TAnswer = {
    lc_kwargs?: {
      content: string;
    };
  };
  const chat = new ChatOpenAI({ modelName: "gpt-4-turbo-preview" });
  let person = "";
  let bContinue = true;
  while (bContinue) {
    const task = await getQuestion(token!);
    const hint = task.hint! as string;

    const hintMessage = new HumanMessage(hint);
    messages.push(hintMessage);
    const answer = await chat.invoke(messages);
    console.log("answer :", answer.lc_kwargs.content);

    if (answer.lc_kwargs.content !== "HINT") {
      bContinue = false;
      person = answer.lc_kwargs!.content;
    }
  }

  console.log("answer this person is:", person);
  const response = await setAnswer(token!, person);
  console.log("response :", response);
}

main();
