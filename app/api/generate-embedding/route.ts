import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateEmbedding } from "@/lib/embeddings"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { id, title, description } = await request.json()

    const text = `${title}. ${description ?? ""}`
    const embedding = await generateEmbedding(text)

    const { error } = await supabase
      .from("listings")
      .update({ embedding })
      .eq("id", id)

    if (error) {
      console.error("Ошибка сохранения embedding:", error)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка API embedding:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}