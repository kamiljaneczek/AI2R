import { ChatOpenAI } from "@langchain/openai";
import { authorize, getQuestion, setAnswer } from "../lib/utils.js";
import { HumanMessage } from "@langchain/core/messages";

async function main() {
  const token = await authorize("gnome");

  const task = await getQuestion(token!);
  const url = task.url;

  const chat = new ChatOpenAI({
    modelName: "gpt-4-vision-preview",
    maxTokens: 1024,
  });

  const message = new HumanMessage({
    content: [
      {
        type: "text",
        text: "Jeśli na obrazku widzisz gnoma, napisz jaki kolor czapki ma ten gnom. Zwróć tylko i wyłącznie kolor czapki. Jeśli na obrazku nie ma gnoma, napisz ERORR.",
      },
      {
        type: "image_url",
        image_url: {
          url: url,
        },
      },
    ],
  });

  const res = await chat.invoke([message]);
  
  const answer = res.content.toString();
 

  console.log("answer is:", answer);
  const reply = await setAnswer(token!, answer);
  console.log("response :", reply);
}

main();
