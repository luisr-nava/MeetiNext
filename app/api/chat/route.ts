import { convertToModelMessages, streamText, UIMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { NextRequest } from "next/server";
import { tools } from "@/src/features/ai/tools";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // model: openrouter.chat("nvidia/nemotron-3-ultra-550b-a55b:free"),
    model: openrouter.chat("openrouter/owl-alpha"),
    system:
      "Eres un asistente de Meeti AI que ayuda a encontrar comunidades y meetis.",
    messages: await convertToModelMessages(messages),
    tools,
  });

  return result.toUIMessageStreamResponse();
}

