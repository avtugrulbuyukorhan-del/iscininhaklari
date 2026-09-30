import { siteConfig } from "@/lib/site";
import { authors } from "@/lib/authors";
import {
  formatAuthorDisplayName,
  formatBarRegistrationLine,
  resolveAuthorEeat,
} from "@/lib/author-profile";

const BASE_URL = siteConfig.url.replace(/\/$/, "");
const FOUNDER_SLUG = "ismail-cavus";

function authorToPerson(author: (typeof authors)[number]) {
  const eeat = resolveAuthorEeat(author.slug, null, author);
  const displayName = formatAuthorDisplayName(author.name, eeat.title ?? author.title);
  const credential = formatBarRegistrationLine(eeat.barName, eeat.barRegistration);

  const person: Record<string, unknown> = {
    "@type": "Person",
    name: displayName,
    description: author.bio,
    url: `${BASE_URL}/yazar/${author.slug}`,
    ...(eeat.title && { jobTitle: eeat.title }),
    ...(eeat.sameAs.length > 0 && { sameAs: eeat.sameAs }),
    ...(eeat.knowsAbout.length > 0 && { knowsAbout: eeat.knowsAbout }),
    ...(eeat.alumniOf && {
      alumniOf: { "@type": "EducationalOrganization", name: eeat.alumniOf },
    }),
    ...(credential && {
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "professional certification",
        name: credential.replace(" - Sicil No: ", ", Sicil No: "),
      },
    }),
  };
  return person;
}

export function getAboutPageSchemaData() {
  const founder = authors.find((a) => a.slug === FOUNDER_SLUG);
  const employees = authors.filter((a) => a.slug !== FOUNDER_SLUG);

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: siteConfig.name,
    url: BASE_URL,
    ...(founder && { founder: authorToPerson(founder) }),
    ...(employees.length > 0 && {
      employee: employees.map((e) => authorToPerson(e)),
    }),
  };

  return {
    "@type": "AboutPage",
    "@id": `${BASE_URL}/hakkimizda#about`,
    name: "Hakkımızda",
    description: `${siteConfig.name} ekibi ve misyonu. İşçi haklarını sade ve anlaşılır kılmak için çalışıyoruz.`,
    url: `${BASE_URL}/hakkimizda`,
    mainEntity: organization,
  };
}
