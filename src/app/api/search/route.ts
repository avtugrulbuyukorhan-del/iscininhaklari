import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { articlePath } from "@/lib/paths";
import { getKnownCategoryName } from "@/lib/content";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i");
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("articles")
      .select("title, slug, category, meta_title, meta_description")
      .eq("status", "published")
      .not("category", "is", null)
      .order("updated_at", { ascending: false })
      .limit(80);

    if (error || !data) {
      return NextResponse.json({ results: [] });
    }

    const term = normalize(q);
    const results = data
      .map((row) => {
        const title = (row.meta_title?.trim() || row.title || "").trim();
        const description = (row.meta_description ?? "").trim();
        const category = getKnownCategoryName(row.category) ?? row.category ?? "";
        const haystack = normalize(
          [title, row.title ?? "", description, row.slug ?? "", category].join(" ")
        );
        return {
          title,
          description,
          href: articlePath(row.slug),
          category,
          match: haystack.includes(term),
        };
      })
      .filter((row) => row.match)
      .slice(0, 8)
      .map(({ title, description, href, category }) => ({
        title,
        description: description.length > 140 ? `${description.slice(0, 137)}...` : description,
        href,
        category,
      }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
