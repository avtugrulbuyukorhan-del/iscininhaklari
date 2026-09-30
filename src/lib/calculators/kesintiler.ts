import { CONFIG } from "@/lib/calculators/config";
import { round2 } from "@/lib/calculators/money";

export type KesintiInput = {
  sgkKesilsin: boolean;
  kumulatifMatrah?: number;
};

export type KesintiDokumu = {
  brut: number;
  sgk: number;
  gvMatrahi: number;
  gelirVergisi: number;
  damga: number;
  net: number;
  kumulatifMatrah: number;
};

export function gelirVergisiHesapla(
  matrah: number,
  dilimler = CONFIG.gelirVergisiDilimleri
): number {
  if (matrah <= 0 || dilimler.length === 0) return 0;
  let vergi = 0;
  let oncekiLimit = 0;
  let kalan = matrah;
  for (const dilim of dilimler) {
    const genislik = dilim.limit - oncekiLimit;
    if (genislik <= 0) {
      oncekiLimit = dilim.limit;
      continue;
    }
    const tutar = Math.min(kalan, genislik);
    if (tutar > 0) {
      vergi += tutar * dilim.oran;
      kalan -= tutar;
    }
    oncekiLimit = dilim.limit;
    if (kalan <= 0) break;
  }
  return round2(vergi);
}

export function brutToNet(brut: number, opts: KesintiInput): KesintiDokumu {
  const kumulatifMatrah = opts.kumulatifMatrah ?? 0;
  const sgkOran = CONFIG.sgkIsciOrani + CONFIG.issizlikIsciOrani;
  const sgk = opts.sgkKesilsin ? round2(brut * sgkOran) : 0;
  const gvMatrahi = round2(Math.max(0, brut - sgk));
  const gelirVergisi = round2(
    gelirVergisiHesapla(kumulatifMatrah + gvMatrahi) - gelirVergisiHesapla(kumulatifMatrah)
  );
  const damga = round2(brut * CONFIG.damgaVergisiOrani);
  const net = round2(brut - sgk - gelirVergisi - damga);
  return { brut, sgk, gvMatrahi, gelirVergisi, damga, net, kumulatifMatrah };
}
