import { authorize, getQuestion, setAnswer } from "../lib/utils.js";
import { moderationOpenAI } from "../lib/moderation-openAI.js";
import { chatInvoke } from "../lib/completion.js";
import { TQuestionData } from "../types/index.js";

async function main() {
  const token = await authorize("blogger");

  const question = (await getQuestion(token!)) as TQuestionData;

  const chapters: string[] = question!.blog!;

  const responses: any[] = await Promise.all(
    chapters.map(async (chapter) => {
      const propmt = `Napisz wpis na bloga (w języku polskim) na temat przyrządzania pizzy Margherity. Napisz jeden rodział wpisu o nazwie: ${chapter}`;
      const result = await chatInvoke(propmt);
      return result;
    })
  );

  console.log("responses :", responses);
  const response = await setAnswer(token!, responses);
  console.log("response :", response);
}

main();
