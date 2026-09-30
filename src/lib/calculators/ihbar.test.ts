import { describe, expect, it } from "vitest";
import { calculateIhbar, ihbarGunSayisi } from "@/lib/calculators/ihbar";
import { parseIsoDate } from "@/lib/calculators/dates";

function d(iso: string): Date {
  const parsed = parseIsoDate(iso);
  if (!parsed) throw new Error(iso);
  return parsed;
}

describe("ihbar tazminatı", () => {
  it("4 yıllık hizmette 56 gün × günlük giydirilmiş = 84.000 TL brüt", () => {
    const start = d("2022-01-01");
    const end = d("2026-01-01");
    expect(ihbarGunSayisi(start, end)).toBe(56);

    const result = calculateIhbar({
      iseGiris: start,
      istenCikis: end,
      aylikBrut: 40000,
      yanOdemeler: [5000],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.hizmet.yil).toBe(4);
    expect(result.ihbarGun).toBe(56);
    expect(result.giydirilmisAylik).toBe(45000);
    expect(result.gunlukGiydirilmis).toBe(1500);
    expect(result.brut).toBe(84000);
    expect(result.kesintiler.sgk).toBe(0);
  });

  it("6 aydan kısa hizmette 14 gün ihbar süresi uygular", () => {
    expect(ihbarGunSayisi(d("2026-01-01"), d("2026-03-01"))).toBe(14);
  });
});
