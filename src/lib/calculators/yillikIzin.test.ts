import { describe, expect, it } from "vitest";
import { calculateYillikIzin } from "@/lib/calculators/yillikIzin";
import { parseIsoDate } from "@/lib/calculators/dates";

function d(iso: string): Date {
  const parsed = parseIsoDate(iso);
  if (!parsed) throw new Error(iso);
  return parsed;
}

describe("yıllık izin ücreti", () => {
  it("6 tam yılda 90 gün hak, 30 kullanılan → 60.000 TL brüt", () => {
    const result = calculateYillikIzin({
      iseGiris: d("2018-01-01"),
      istenCikis: d("2024-01-01"),
      dogumTarihi: d("1994-01-01"),
      aylikBrut: 30000,
      kullanilanGun: 30,
      yerAlti: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.tamamlananYil).toBe(6);
    expect(result.toplamHak).toBe(90);
    expect(result.kullanilmayanGun).toBe(60);
    expect(result.brut).toBe(60000);
    expect(result.satirlar.map((s) => s.hakGun)).toEqual([14, 14, 14, 14, 14, 20]);
  });

  it("bir yılı doldurmamış kısım için izin hakkı vermez", () => {
    const result = calculateYillikIzin({
      iseGiris: d("2025-01-01"),
      istenCikis: d("2025-08-01"),
      dogumTarihi: d("1990-01-01"),
      aylikBrut: 30000,
      kullanilanGun: 0,
      yerAlti: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.tamamlananYil).toBe(0);
    expect(result.toplamHak).toBe(0);
    expect(result.brut).toBe(0);
  });
});
