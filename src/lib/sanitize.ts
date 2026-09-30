import sanitize from "sanitize-html";
import { isExternalHref, mergeExternalRel, EXTERNAL_LINK_REL } from "@/lib/external-link";

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "a", "strong", "em", "b", "i", "u", "s", "del", "ins",
  "blockquote", "cite", "pre", "code",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "colgroup", "col",
  "img", "figure", "figcaption",
  "span", "div", "section",
  "details", "summary",
  "sub", "sup", "mark",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height", "loading"],
  table: ["class", "style"],
  th: ["colspan", "rowspan", "colwidth", "style", "class"],
  td: ["colspan", "rowspan", "colwidth", "style", "class"],
  col: ["span", "width", "style"],
  div: ["id", "class", "style", "data-type", "data-cta-type", "data-title", "data-button-text", "data-href", "data-content", "data-file-info", "data-davaci", "data-davali", "data-vekili", "data-konu", "data-aciklamalar", "data-dilekce-metni", "data-sonuc-talep", "data-tarih", "data-sifat", "data-imza"],
  blockquote: ["data-type", "data-title", "data-content", "class"],
  cite: ["class"],
  p: ["class"],
  "*": ["id", "class", "style", "data-nosnippet", "open", "aria-hidden", "data-type", "data-footnote-id", "data-n"],
};

const FILE_HREF_RE = /(?:drive|docs)\.google\.com/i;

function applyExternalAttrs(attribs: Record<string, string>): Record<string, string> {
  return {
    ...attribs,
    rel: mergeExternalRel(attribs.rel),
    target: "_blank",
  };
}

function mergeExternalIntoAttrs(attrs: string): string {
  let next = attrs;
  if (/\brel\s*=/i.test(next)) {
    next = next.replace(/\brel\s*=\s*(["'])(.*?)\1/i, (_m, q: string, val: string) => {
      return `rel=${q}${mergeExternalRel(val)}${q}`;
    });
  } else {
    next = `${next} rel="${EXTERNAL_LINK_REL}"`;
  }
  if (/\btarget\s*=/i.test(next)) {
    next = next.replace(/\btarget\s*=\s*(["']).*?\1/i, `target="_blank"`);
  } else {
    next = `${next} target="_blank"`;
  }
  return next;
}

/** Dış linklere (sosyal, harita, Drive vb.) nofollow + yeni sekme ekler. */
export function ensureNofollowOnFileLinks(html: string): string {
  let out = html.replace(
    /(<div\b[^>]*\bdata-type=["']download-button["'][^>]*>)([\s\S]*?)(<\/div>)/gi,
    (_m, open: string, inner: string, close: string) => {
      const patched = inner.replace(/<a\b([^>]*?)>/gi, (_a, attrs: string) => `<a${mergeExternalIntoAttrs(attrs)}>`);
      return `${open}${patched}${close}`;
    }
  );

  out = out.replace(/<a\b([^>]*?)>/gi, (full, attrs: string) => {
    const href = attrs.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
    if (!isExternalHref(href) && !FILE_HREF_RE.test(href)) return full;
    return `<a${mergeExternalIntoAttrs(attrs)}>`;
  });

  return out;
}

export function isGoogleDriveHref(href: string): boolean {
  return FILE_HREF_RE.test(href);
}

export function sanitizeHtml(dirty: string): string {
  const clean = sanitize(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        if (isExternalHref(href) || FILE_HREF_RE.test(href)) {
          return { tagName, attribs: applyExternalAttrs(attribs) };
        }
        return { tagName, attribs };
      },
    },
  });
  return ensureNofollowOnFileLinks(clean);
}
