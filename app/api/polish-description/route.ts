import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { rawText } = await request.json()

    if (!rawText || !rawText.trim()) {
      return NextResponse.json({ error: "rawText is required" }, { status: 400 })
    }

    const message = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 300,
      thinking: { type: "disabled" },
      output_config: { effort: "medium" },
      system:
        "You clean up a voice-transcribed marketplace listing description for a peer-to-peer marketplace app called OBLACO. " +
        "The input is raw speech-to-text and may contain filler words, false starts, repetition, or missing punctuation. " +
        "Rewrite it as a clear, appealing 2-4 sentence listing description, preserving the original meaning and details. " +
        "Always respond in the SAME language the input was spoken in — never translate it. " +
        "Do not use markdown, headings, or emoji. Respond with only the description text, nothing else.",
      messages: [
        {
          role: "user",
          content: `Clean up this voice-transcribed listing description:\n${rawText}`,
        },
      ],
    })

    const textBlock = message.content.find((block) => block.type === "text")

    if (!textBlock || message.stop_reason === "refusal") {
      return NextResponse.json({ error: "Could not polish the description" }, { status: 502 })
    }

    return NextResponse.json({ description: textBlock.text.trim() })
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
      console.error("Ошибка авторизации Anthropic API:", error)
      return NextResponse.json({ error: "AI service is not configured correctly" }, { status: 500 })
    }
    if (error instanceof Anthropic.RateLimitError) {
      console.error("Превышен лимит запросов Anthropic API:", error)
      return NextResponse.json({ error: "AI service is busy, please try again shortly" }, { status: 429 })
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Ошибка Anthropic API:", error)
      return NextResponse.json({ error: "AI service is temporarily unavailable" }, { status: 502 })
    }
    console.error("Ошибка обработки голосового описания:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
