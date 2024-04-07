import { authorize, getQuestion, setAnswer } from "../lib/utils.js";

async function main() {
  const token = await authorize("helloapi");

  const question = await getQuestion(token!);

  await setAnswer(token!, question!.cookie);
}

main();
