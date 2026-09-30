import { siteConfig } from "@/lib/site";
import { escapeJsonLd } from "@/lib/jsonLd";

const BASE_URL = siteConfig.url.replace(/\/$/, "");

type CategoryHubSchemasProps = {
  categoryName: string;
  categoryUrl: string;
  description?: string | null;
  breadcrumbItems?: { name: string; url?: string }[];
};

export function CategoryHubSchemas({
  categoryName,
  categoryUrl,
  description,
  breadcrumbItems,
}: CategoryHubSchemasProps) {
  const breadcrumbId = `${categoryUrl}#breadcrumb`;
  const crumbs = breadcrumbItems?.length
    ? breadcrumbItems
    : [
        { name: "Anasayfa", url: BASE_URL },
        { name: categoryName, url: categoryUrl },
      ];
  const graph = [
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: crumbs.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        ...(item.url && { item: item.url }),
      })),
    },
    {
      "@type": "CollectionPage",
      name: `${categoryName} | ${siteConfig.name}`,
      description: description ?? undefined,
      url: categoryUrl,
      isPartOf: { "@id": `${BASE_URL}/#website` },
      breadcrumb: { "@id": breadcrumbId },
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(schema) }}
    />
  );
}
