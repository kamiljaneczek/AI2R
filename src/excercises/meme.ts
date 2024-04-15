import { ChatOpenAI } from "@langchain/openai";
import { authorize, getQuestion, setAnswer } from "../lib/utils.js";
import { HumanMessage } from "@langchain/core/messages";
import { data } from "node_modules/cheerio/lib/esm/api/attributes.js";

async function main() {
  const token = await authorize("meme");

  const task = await getQuestion(token!);
  const image = task.image;
  const text = task.text;

  const response = await fetch("https://get.renderform.io/api/v2/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "key-Hgj1rXKEHvUQxU3i6sIYS1PS5L2fYU0i9I",
    },
    body: JSON.stringify({
      template: "short-ants-cry-calmly-1443",
      data: {
        "text.text": text,
        "image.src": image,
      },
    }),
  });

  const data = await response.json();
  console.log(data);
  const answer = data.href;

  console.log("answer is:", answer);

  const reply = await setAnswer(token!, answer);
  console.log("response :", reply);
}

main();
