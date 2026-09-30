"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isIstifaFormValid,
  pdfFileName,
  type IstifaFormValues,
} from "@/lib/istifa-dilekcesi";
import { IstifaPdfDocument, registerIstifaFonts } from "./IstifaPdfDocument";

export default function IstifaPdfDownload({ values }: { values: IstifaFormValues }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valid = isIstifaFormValid(values);

  const handleDownload = async () => {
    if (!valid) return;
    setError(null);
    setLoading(true);
    try {
      await registerIstifaFonts();
      const blob = await pdf(<IstifaPdfDocument values={values} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = pdfFileName(values.adSoyad);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("PDF oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="copper"
        className="w-full"
        disabled={!valid || loading}
        onClick={handleDownload}
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        PDF olarak indir
      </Button>
      {!valid ? (
        <p className="text-[12px] leading-5 text-ink/45">
          PDF için şirket ünvanı, ad soyad, görev ve son çalışma günü gerekir.
        </p>
      ) : null}
      {error ? <p className="text-[12px] leading-5 text-copper">{error}</p> : null}
    </div>
  );
}
