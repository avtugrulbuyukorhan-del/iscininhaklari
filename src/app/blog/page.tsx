import { permanentRedirect } from "next/navigation";
import { ARTICLES_PATH } from "@/lib/paths";

type PageProps = {
  searchParams?: Promise<{ page?: string; q?: string }>;
};

export default async function BlogIndexRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  const q = params?.q?.trim();
  const page = params?.page?.trim();
  if (q) qs.set("q", q);
  if (page && page !== "1") qs.set("page", page);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  permanentRedirect(`${ARTICLES_PATH}${suffix}`);
}
