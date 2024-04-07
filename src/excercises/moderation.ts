import { authorize, getQuestion, setAnswer } from "../lib/utils.js";
import { moderationOpenAI } from "../lib/moderation-openAI.js";

async function main() {
  const token = await authorize("moderation");

  const question = await getQuestion(token!);

  const inputs: string[] = question!.input;

  const responses: number[] = await Promise.all(
    inputs.map(async (input) => {
      const result = await moderationOpenAI(input);
      const response = result.results[0].flagged ? 1 : 0;
      return response;
    })
  );

  console.log("responses :", responses);
  const response = await setAnswer(token!, responses);
  console.log("response :", response);
}

main();
