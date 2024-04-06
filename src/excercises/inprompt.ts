import { authorize, getQuestion, sendQuestion, setAnswer } from "../lib/utils";
import { moderationOpenAI } from "../lib/moderation-openAI";
import { chatInvoke } from "../lib/completion";
import { TQuestionData } from "../types";

async function main() {
  const token = await authorize("inprompt");

  const task = (await getQuestion(token!)) as TQuestionData;

  const prompt = `Zapamiętaj informacje o każdej osobie z tego tekstu: " ${task.input}"i odpowiedz na pytanie: " ${task.question}"`;
  const answer = await chatInvoke(prompt);

  console.log("answer :", answer);
  const response = await setAnswer(token!, answer);
  console.log("response :", response);
}

main();