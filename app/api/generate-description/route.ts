import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { title, category, location } = await request.json()

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const details = [
      category && `Category: ${category}`,
      location && `Location: ${location}`,
    ]
      .filter(Boolean)
      .join("\n")

    const message = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 300,
      thinking: { type: "disabled" },
      output_config: { effort: "medium" },
      system:
        "You write short, appealing listing descriptions for a peer-to-peer marketplace app called OBLACO. " +
        "Write 2-4 sentences that would make a buyer want to check out the item. " +
        "Mention condition and pickup/location naturally if given. Do not use markdown, headings, or emoji. " +
        "Respond with only the description text, nothing else.",
      messages: [
        {
          role: "user",
          content: `Write a listing description for:\nTitle: ${title}\n${details}`,
        },
      ],
    })

    const textBlock = message.content.find((block) => block.type === "text")

    if (!textBlock || message.stop_reason === "refusal") {
      return NextResponse.json({ error: "Could not generate a description" }, { status: 502 })
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
    console.error("Ошибка генерации описания:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
