import OpenAI from "openai";

const openai = new OpenAI({});

export async function moderationOpenAI(text: string) {
  const result = await openai.moderations.create({
    model: "text-moderation-latest",
    input: text,
  });
  return result;
}
