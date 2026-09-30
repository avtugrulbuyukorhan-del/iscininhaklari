import { siteConfig } from "@/lib/site";

export const EXTERNAL_LINK_REL = "nofollow noopener noreferrer";

export const externalAnchorProps = {
  target: "_blank",
  rel: EXTERNAL_LINK_REL,
} as const;

function siteHost(): string {
  try {
    return new URL(siteConfig.url).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "iscininhaklari.com";
  }
}

/** http(s) dış domain; mailto/tel/iç path/aynı site hariç. */
export function isExternalHref(href: string | null | undefined): boolean {
  if (!href) return false;
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("#") || trimmed.startsWith("/")) return false;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:") ||
    lower.startsWith("sms:") ||
    lower.startsWith("javascript:")
  ) {
    return false;
  }

  let url: URL;
  try {
    url = trimmed.startsWith("//") ? new URL(`https:${trimmed}`) : new URL(trimmed);
  } catch {
    return false;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.replace(/^www\./i, "").toLowerCase();
  return host !== siteHost();
}

export function mergeExternalRel(existing: string | null | undefined): string {
  const parts = new Set(`${existing ?? ""} ${EXTERNAL_LINK_REL}`.split(/\s+/).filter(Boolean));
  return [...parts].join(" ");
}
