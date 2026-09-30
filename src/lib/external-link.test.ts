import { describe, expect, it } from "vitest";
import { isExternalHref, mergeExternalRel, EXTERNAL_LINK_REL } from "./external-link";
import { ensureNofollowOnFileLinks } from "./sanitize";

describe("isExternalHref", () => {
  it("iç path ve mailto/tel dış sayılmaz", () => {
    expect(isExternalHref("/iletisim")).toBe(false);
    expect(isExternalHref("#fn-1")).toBe(false);
    expect(isExternalHref("mailto:bilgi@iscininhaklari.com")).toBe(false);
    expect(isExternalHref("tel:+905320000000")).toBe(false);
  });

  it("aynı site dış sayılmaz", () => {
    expect(isExternalHref("https://iscininhaklari.com/hakkimizda")).toBe(false);
    expect(isExternalHref("https://www.iscininhaklari.com")).toBe(false);
  });

  it("sosyal, harita ve diğer domainler dıştır", () => {
    expect(isExternalHref("https://instagram.com/iscininhaklari")).toBe(true);
    expect(isExternalHref("https://maps.google.com/?q=Ankara")).toBe(true);
    expect(isExternalHref("https://maps.app.goo.gl/abc")).toBe(true);
    expect(isExternalHref("https://www.mevzuat.gov.tr/")).toBe(true);
  });
});

describe("ensureNofollowOnFileLinks", () => {
  it("dış linke nofollow ve target=_blank ekler", () => {
    const html = ensureNofollowOnFileLinks(
      `<p><a href="https://instagram.com/x">ig</a></p>`
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain("nofollow");
    expect(html).toContain("noopener");
  });

  it("iç linki değiştirmez", () => {
    const html = ensureNofollowOnFileLinks(`<p><a href="/iletisim">iletişim</a></p>`);
    expect(html).not.toContain("nofollow");
    expect(html).not.toContain('target="_blank"');
  });
});

describe("mergeExternalRel", () => {
  it("mevcut rel ile birleştirir", () => {
    expect(mergeExternalRel("ugc")).toContain("nofollow");
    expect(mergeExternalRel(undefined)).toBe(EXTERNAL_LINK_REL);
  });
});
