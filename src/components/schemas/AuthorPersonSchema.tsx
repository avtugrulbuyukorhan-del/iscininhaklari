import { escapeJsonLd } from "@/lib/jsonLd";

type AuthorPersonSchemaProps = {
  name: string;
  url: string;
  jobTitle?: string | null;
  sameAs?: string[];
  hasCredential?: string | null;
  knowsAbout?: string[];
  alumniOf?: string | null;
};

export function AuthorPersonSchema({
  name,
  url,
  jobTitle,
  sameAs,
  hasCredential,
  knowsAbout,
  alumniOf,
}: AuthorPersonSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    ...(jobTitle?.trim() && { jobTitle: jobTitle.trim() }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
    ...(hasCredential?.trim() && {
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "professional certification",
        name: hasCredential.trim(),
      },
    }),
    ...(knowsAbout && knowsAbout.length > 0 && { knowsAbout }),
    ...(alumniOf?.trim() && {
      alumniOf: { "@type": "EducationalOrganization", name: alumniOf.trim() },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(schema) }}
    />
  );
}
