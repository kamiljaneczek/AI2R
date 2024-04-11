import { ChatOpenAI } from "@langchain/openai";
import { authorize, getQuestion, setAnswer } from "../../lib/utils.js";
import { HumanMessage } from "@langchain/core/messages";

async function main() {
  const token = await authorize("ownapi");

  const task = await getQuestion(token!);
  const url = task.url;

  const answer =
    "https://team-y-kamiljaneczeks-projects.vercel.app/hello/aidevs";

  console.log("answer is:", answer);
  const reply = await setAnswer(token!, answer);
  console.log("response :", reply);
}

main();
