import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { notifyGoogleIndexing } from "@/lib/googleIndexing";
import { siteConfig } from "@/lib/site";
import { articleUrl } from "@/lib/paths";

const DELAY_MS = 500;
const baseUrl = siteConfig.url.replace(/\/$/, "");

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const supabase = createSupabaseAdminClient();

  const articlesRes = await supabase
    .from("articles")
    .select("slug, category")
    .eq("status", "published")
    .not("category", "is", null);

  const urls: string[] = [];

  (articlesRes.data ?? []).forEach((a) => {
    const slug = (a as { slug: string }).slug;
    const category = (a as { category: string }).category;
    if (slug) urls.push(articleUrl(slug, baseUrl));
  });

  let sent = 0;
  for (const url of urls) {
    await notifyGoogleIndexing(url);
    sent++;
    if (sent < urls.length) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  return NextResponse.json({ ok: true, sent, total: urls.length });
}
