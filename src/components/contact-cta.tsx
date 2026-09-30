"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ContactCta() {
  return (
    <aside className="mt-0 mb-0 shrink-0">
      <div className="mt-0 mb-0 rounded-[6px] border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-slate-900">
          Konuyla ilgili yardıma mı ihtiyacınız var?
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Rehber yazıları genel bilgilendirme amaçlıdır. Özel durumunuz için bize yazabilirsiniz.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Button asChild size="default" className="w-full bg-slate-800">
            <Link href="/iletisim">İletişime Geç</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
