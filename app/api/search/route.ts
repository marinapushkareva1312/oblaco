import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateQueryEmbedding } from "@/lib/embeddings"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || !query.trim()) {
      return NextResponse.json({ results: [] })
    }

    const queryEmbedding = await generateQueryEmbedding(query)

    const { data, error } = await supabase.rpc("match_listings", {
      query_embedding: queryEmbedding,
      match_threshold: 0.3,
      match_count: 10,
    })

    if (error) {
      console.error("Ошибка поиска:", error)
      return NextResponse.json({ results: [] })
    }

const results = (data ?? []).map((item: any) => ({
  id: item.id,
  title: item.title,
  price: item.price,
  location: item.location,
  category: item.category,
  image: item.image || '/listings/sofa.png',
  postedAt: '',
  featured: false,
}))

return NextResponse.json({ results })
  } catch (error) {
    console.error("Ошибка API поиска:", error)
    return NextResponse.json({ results: [] })
  }
}