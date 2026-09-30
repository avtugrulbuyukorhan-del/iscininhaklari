"use client";

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { buildIstifaLetter, type IstifaFormValues } from "@/lib/istifa-dilekcesi";

let fontsRegistered = false;

export async function registerIstifaFonts(): Promise<void> {
  if (fontsRegistered) return;
  const origin = window.location.origin;
  const regular = `${origin}/fonts/Roboto-Regular.ttf`;
  const bold = `${origin}/fonts/Roboto-Bold.ttf`;
  const [regularRes, boldRes] = await Promise.all([fetch(regular), fetch(bold)]);
  if (!regularRes.ok || !boldRes.ok) {
    throw new Error("Türkçe font dosyaları yüklenemedi.");
  }
  Font.register({
    family: "Roboto",
    fonts: [
      { src: regular, fontWeight: 400 },
      { src: bold, fontWeight: 700 },
    ],
  });
  fontsRegistered = true;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 11,
    lineHeight: 1.6,
    color: "#1e293b",
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 56,
  },
  date: {
    textAlign: "right",
    fontSize: 11,
  },
  title: {
    marginTop: 36,
    textAlign: "center",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 1.2,
  },
  muhatap: {
    marginTop: 36,
    fontSize: 11,
    fontWeight: 700,
  },
  adres: {
    marginTop: 4,
    fontSize: 11,
    color: "#334155",
  },
  body: {
    marginTop: 22,
    textAlign: "justify",
    fontSize: 11,
  },
  paragraph: {
    marginBottom: 14,
  },
  signature: {
    marginTop: 56,
    width: 200,
    alignSelf: "flex-end",
    alignItems: "center",
    fontSize: 11,
  },
  signatureLine: {
    marginTop: 4,
  },
  signatureSpace: {
    marginTop: 22,
  },
});

export function IstifaPdfDocument({ values }: { values: IstifaFormValues }) {
  const letter = buildIstifaLetter(values);

  return (
    <Document
      title="İstifa Dilekçesi"
      author={letter.adSoyad}
      language="tr"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.date}>{letter.tarih}</Text>
        <Text style={styles.title}>İSTİFA DİLEKÇESİ</Text>
        <Text style={styles.muhatap}>{letter.muhatapSatir}</Text>
        {letter.adres ? <Text style={styles.adres}>{letter.adres}</Text> : null}
        <View style={styles.body}>
          <Text style={styles.paragraph}>{letter.paragraf1}</Text>
          <Text style={styles.paragraph}>{letter.paragraf2}</Text>
        </View>
        <View style={styles.signature}>
          <Text>{letter.imzaTarih}</Text>
          <Text style={styles.signatureLine}>{letter.adSoyad}</Text>
          {letter.tcKimlikNo ? (
            <Text style={styles.signatureLine}>T.C. Kimlik No: {letter.tcKimlikNo}</Text>
          ) : null}
          <Text style={styles.signatureSpace}>İmza: ____________</Text>
        </View>
      </Page>
    </Document>
  );
}
