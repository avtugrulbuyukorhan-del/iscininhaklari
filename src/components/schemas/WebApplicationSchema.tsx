import { escapeJsonLd } from "@/lib/jsonLd";

type WebApplicationSchemaProps = {
  name: string;
  url: string;
  description: string;
};

export function WebApplicationSchema({ name, url, description }: WebApplicationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url,
    description,
    applicationCategory: "FinanceApplication",
    inLanguage: "tr-TR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(schema) }}
    />
  );
}
