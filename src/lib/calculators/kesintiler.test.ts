import { describe, expect, it } from "vitest";
import { brutToNet, gelirVergisiHesapla } from "@/lib/calculators/kesintiler";
import { CONFIG } from "@/lib/calculators/config";
import { round2 } from "@/lib/calculators/money";

describe("kesintiler", () => {
  it("SGK kesilmezken yalnızca damga (ve varsa GV) düşer", () => {
    const d = brutToNet(84000, { sgkKesilsin: false, kumulatifMatrah: 0 });
    expect(d.sgk).toBe(0);
    expect(d.damga).toBe(round2(84000 * CONFIG.damgaVergisiOrani));
    expect(d.net).toBe(round2(84000 - d.damga - d.gelirVergisi));
  });

  it("SGK kesildiğinde işçi SGK + işsizlik oranını uygular", () => {
    const d = brutToNet(10000, { sgkKesilsin: true, kumulatifMatrah: 0 });
    expect(d.sgk).toBe(round2(10000 * (CONFIG.sgkIsciOrani + CONFIG.issizlikIsciOrani)));
    expect(d.gvMatrahi).toBe(round2(10000 - d.sgk));
  });

  it("placeholder dilimde gelir vergisi 0 döner", () => {
    expect(gelirVergisiHesapla(50000)).toBe(0);
  });
});
