import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "./lib/embeddings";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  // Берём все объявления, у которых ещё нет embedding
  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, title, description")
    .is("embedding", null);

  if (error) {
    console.error("Ошибка при получении объявлений:", error);
    return;
  }

  console.log(`Найдено объявлений без embedding: ${listings?.length}`);

  for (const listing of listings ?? []) {
    const text = `${listing.title}. ${listing.description ?? ""}`;
    const embedding = await generateEmbedding(text);

    const { error: updateError } = await supabase
      .from("listings")
      .update({ embedding })
      .eq("id", listing.id);

    if (updateError) {
      console.error(`Ошибка при сохранении embedding для id=${listing.id}:`, updateError);
    } else {
      console.log(`✅ Embedding сохранён для: ${listing.title}`);
    }
  }

  console.log("Готово!");
}

run();