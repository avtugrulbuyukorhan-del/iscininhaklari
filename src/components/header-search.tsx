"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ARTICLES_PATH } from "@/lib/paths";

type SearchHit = {
  title: string;
  description: string;
  href: string;
  category: string;
};

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as { results?: SearchHit[] };
        setResults(data.results ?? []);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="text-ink" aria-label="Ara">
          <Search className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-navy/10"
        className="top-1/2 left-1/2 w-[min(100%-2rem,34rem)] max-w-none -translate-x-1/2 -translate-y-1/2 gap-2 border-0 bg-transparent p-0 shadow-none ring-0"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Makale ara</DialogTitle>
          <DialogDescription>Yayınlanan yazılarda ara</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/35" aria-hidden />
          <Input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Kıdem, ihbar, fazla mesai..."
            className="h-12 rounded-[8px] border-ink/15 bg-white pl-9 text-sm shadow-[0_10px_30px_rgba(30,58,95,0.1)]"
          />
        </div>
        {query.trim().length >= 2 ? (
          <div className="max-h-[min(50vh,22rem)] overflow-y-auto">
            {loading ? (
              <p className="px-1 py-3 text-sm text-ink/45">Aranıyor...</p>
            ) : results.length === 0 ? (
              <p className="px-1 py-3 text-sm text-ink/45">Eşleşen yazı bulunamadı.</p>
            ) : (
              <ul>
                {results.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-[6px] px-1 py-2.5 transition-colors hover:bg-white/80"
                    >
                      {item.category ? (
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-copper">
                          {item.category}
                        </p>
                      ) : null}
                      <p className="mt-0.5 text-sm font-medium text-ink">{item.title}</p>
                      {item.description ? (
                        <p className="mt-1 text-[13px] leading-5 text-ink/55">{item.description}</p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`${ARTICLES_PATH}?q=${encodeURIComponent(query.trim())}`}
              onClick={() => setOpen(false)}
              className="mt-1 inline-block px-1 py-2 text-sm font-medium text-copper hover:text-ink"
            >
              Tüm sonuçları gör
            </Link>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
