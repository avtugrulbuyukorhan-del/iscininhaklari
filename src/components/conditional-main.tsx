"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { KNOWN_CATEGORY_SLUGS } from "@/lib/content";
import { STATIC_PATH_SLUGS } from "@/lib/paths";

export function ConditionalMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isHome = pathname === "/";
  const isAbout = pathname === "/hakkimizda";

  if (isAdmin) {
    return <main className="min-h-screen w-full overflow-x-hidden bg-white">{children}</main>;
  }

  if (isHome || isAbout) {
    return <main id="icerik" className="w-full overflow-x-clip bg-white">{children}</main>;
  }

  const segment = (pathname ?? "").split("/").filter(Boolean)[0] ?? "";
  const isSingleSegment = (pathname ?? "").split("/").filter(Boolean).length === 1;
  const isCategoryHub = KNOWN_CATEGORY_SLUGS.includes(segment);
  const isStatic = (STATIC_PATH_SLUGS as readonly string[]).includes(segment);
  const isBlogDetail = isSingleSegment && !isCategoryHub && !isStatic;

  return (
    <main
      id="icerik"
      className={
        isBlogDetail
          ? "min-h-screen w-full overflow-x-hidden bg-white pt-24 pb-8 lg:pt-28"
          : "mx-auto w-full max-w-6xl overflow-x-hidden px-4 pt-24 pb-8 lg:pt-28"
      }
    >
      {children}
    </main>
  );
}
