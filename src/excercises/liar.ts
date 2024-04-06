import { authorize, getQuestion, sendQuestion, setAnswer } from "../lib/utils";
import { moderationOpenAI } from "../lib/moderation-openAI";
import { chatInvoke } from "../lib/completion";
import { TQuestionData } from "../types";

async function main() {
  const token = await authorize("liar");
  const question = "What is the meaning of life?";

  const questionAnser = (await sendQuestion(token!, question)) as TQuestionData;

  const prompt = `Given the following question:" ${question}", please check if following text: " ${questionAnser} " is meaninful and relevant for this question. If yes reply 'yes' otherwise reply 'no'.`;
  const verdict = await chatInvoke(prompt);

  console.log("verdict :", verdict);
  const response = await setAnswer(token!, verdict);
  console.log("response :", response);
}

main();
