import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function CategoryRehberRedirect({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { page } = await searchParams;
  const suffix = page && page !== "1" ? `?page=${encodeURIComponent(page)}` : "";
  permanentRedirect(`/${category}/blog${suffix}`);
}
