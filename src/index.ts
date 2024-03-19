import { authorize, getQuestion, setAnswer } from "./lib/utils";

async function main() {
  const token = await authorize("helloapi");

  const question = await getQuestion(token!);

  await setAnswer(token!, question.cookie);
}

main();
