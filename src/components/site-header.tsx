"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { homeContent } from "@/data/home";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HeaderSearch } from "@/components/header-search";

const navLinkClass =
  "inline-flex items-center border-b border-transparent pb-0.5 text-[15px] font-normal not-italic normal-case no-underline text-start indent-0 [font-variant:normal] text-ink/70 transition-colors duration-200 hover:border-copper hover:text-ink hover:no-underline";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const overlay = (isHome || pathname === "/hakkimizda") && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-ink/8 transition-colors duration-300",
        overlay ? "bg-transparent" : "bg-white/95 backdrop-blur-md"
      )}
    >
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[8px] focus:bg-copper focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-cream"
      >
        İçeriğe geç
      </a>
      <div className="mx-auto grid h-[72px] max-w-6xl grid-cols-[1fr_auto] items-center px-4 sm:h-20 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link
          href="/"
          className="justify-self-start font-serif text-[20px] tracking-tight text-ink sm:text-[22px]"
        >
          {homeContent.lawyer.shortName}
        </Link>
        <nav className="hidden items-center gap-5 justify-self-center lg:flex" aria-label="Ana menü">
          {homeContent.nav.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 justify-self-end">
          <HeaderSearch />
          <Button asChild className="bg-primary text-white hover:bg-primary/90">
            <Link href="/dilekce-yaz">Dilekçe Yaz</Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-ink lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menüyü aç veya kapat"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-ink/10 bg-white px-4 py-5 lg:hidden">
          <nav className="flex flex-col gap-0.5" aria-label="Mobil menü">
            {homeContent.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[8px] px-2 py-2.5 text-base font-normal not-italic normal-case no-underline text-start indent-0 [font-variant:normal] text-ink hover:bg-ink/4 hover:no-underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
