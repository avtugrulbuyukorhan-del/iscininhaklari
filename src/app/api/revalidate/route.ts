import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });
  }

  let body: { paths?: string[]; type?: "rehber" | "blog" | "kategori" | "all" } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Geçersiz JSON." }, { status: 400 });
  }

  const revalidated: string[] = [];

  if (body.paths?.length) {
    for (const p of body.paths) {
      revalidatePath(p);
      revalidated.push(p);
    }
  }

  if (body.type === "rehber" || body.type === "blog" || body.type === "all") {
    revalidatePath("/makaleler");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/[category]", "page");
    revalidatePath("/[category]/blog", "page");
    revalidatePath("/[category]/rehber/[slug]", "page");
    revalidated.push(
      "/makaleler",
      "/blog/[slug]",
      "/[category]",
      "/[category]/blog",
      "/[category]/rehber/[slug]"
    );
  }

  if (body.type === "kategori" || body.type === "all") {
    revalidatePath("/[category]", "page");
    revalidated.push("/[category]");
  }

  if (!revalidated.length) {
    return NextResponse.json({ message: "Geçerli bir path veya type belirtin.", revalidated: [] }, { status: 400 });
  }

  return NextResponse.json({ revalidated, ok: true });
}
