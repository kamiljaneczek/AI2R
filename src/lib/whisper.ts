import { OpenAIWhisperAudio } from "langchain/document_loaders/fs/openai_whisper_audio";

export async function callWhisper() {
  const filePath = "mateusz.mp3";

  const loader = new OpenAIWhisperAudio(filePath);

  return await loader.load();
}
