import { describe, expect, it } from "vitest";
import {
  calculateFazlaMesai,
  summarizeWeek,
  type HaftaGunu,
} from "@/lib/calculators/fazlaMesai";
import { parseIsoDate } from "@/lib/calculators/dates";
import { CONFIG } from "@/lib/calculators/config";

function d(iso: string): Date {
  const parsed = parseIsoDate(iso);
  if (!parsed) throw new Error(iso);
  return parsed;
}

function gun(calisir: boolean, baslangic = "08:00", bitis = "19:00"): HaftaGunu {
  return { calisir, baslangic, bitis };
}

describe("fazla mesai ücreti", () => {
  const pztCmt = [
    gun(true),
    gun(true),
    gun(true),
    gun(true),
    gun(true),
    gun(true),
    gun(false),
  ];

  it("Pzt–Cmt 08:00–19:00 için haftalık 15 saat FM ve 3.000 TL brüt ücret hesaplar", () => {
    const week = summarizeWeek(pztCmt);
    expect("error" in week).toBe(false);
    if ("error" in week) return;
    expect(week.netSaat).toBe(60);
    expect(week.fazlaMesaiSaat).toBe(15);

    const result = calculateFazlaMesai({
      donemBaslangic: d("2026-01-05"),
      donemBitis: d("2026-01-11"),
      hafta: pztCmt,
      aylikBrut: 30000,
      calisilmayanGun: 0,
      hakkaniyetUygula: false,
      hakkaniyetOrani: CONFIG.hakkaniyetIndirimiVarsayilan,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.calisanHafta).toBe(1);
    expect(result.toplamFmSaat).toBe(15);
    expect(result.brut).toBe(3000);
    expect(result.kesintiler.sgk).toBeGreaterThan(0);
  });
});
