import { VoyageAIClient } from "voyageai";

const client = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY!,
});

// Превращает текст объявления в embedding (вектор чисел)
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await client.embed({
    input: [text],
    model: "voyage-3-lite", // компактная и дешёвая модель, хорошо подходит для поиска
    inputType: "document",
  });

  return response.data![0].embedding!;
}

// То же самое, но для поискового запроса пользователя
export async function generateQueryEmbedding(text: string): Promise<number[]> {
  const response = await client.embed({
    input: [text],
    model: "voyage-3-lite",
    inputType: "query",
  });

  return response.data![0].embedding!;
}


// Ищет объявления, близкие по смыслу к поисковому запросу
export async function searchListings(query: string) {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const { results } = await response.json();
    return results;
  } catch (error) {
    console.error("Ошибка поиска:", error);
    return [];
  }
}