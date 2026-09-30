"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Mail,
  FileText,
  FolderTree,
  Users,
  Loader2,
  ArrowRight,
} from "lucide-react";

type Stats = {
  articles: number;
  authors: number;
  categories: number;
  messages: number;
};

function getAccessToken(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectRef = new URL(url).hostname.split(".")[0];
    const raw = localStorage.getItem(`sb-${projectRef}-auth-token`);
    if (!raw) return null;
    return JSON.parse(raw).access_token ?? null;
  } catch {
    return null;
  }
}

async function fetchCount(
  url: string,
  key: string,
  token: string,
  path: string
): Promise<number> {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      Prefer: "count=exact",
      Range: "0-0",
    },
  });
  const range = res.headers.get("content-range");
  if (!range) return 0;
  const part = range.split("/")[1];
  return part === "*" ? 0 : Number(part);
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = getAccessToken();
      if (!token) {
        toast.error("Oturum bulunamadı.");
        setLoading(false);
        return;
      }

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      try {
        const [articles, authors, categories, messages] = await Promise.all([
          fetchCount(url, key, token, "articles"),
          fetchCount(url, key, token, "authors"),
          fetchCount(url, key, token, "categories"),
          fetchCount(url, key, token, "contact_messages"),
        ]);

        if (!cancelled) {
          setStats({ articles, authors, categories, messages });
        }
      } catch {
        if (!cancelled) toast.error("İstatistikler yüklenemedi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const links = [
    {
      href: "/admin/articles",
      label: "Makaleler",
      description: "Yazı ekle, düzenle, yayınla",
      icon: FileText,
      stat: stats?.articles,
      accent: "primary",
    },
    {
      href: "/admin/authors",
      label: "Yazarlar",
      description: "Yazar profilleri",
      icon: Users,
      stat: stats?.authors,
      accent: "muted",
    },
    {
      href: "/admin/categories",
      label: "Kategoriler",
      description: "Kategori yönetimi",
      icon: FolderTree,
      stat: stats?.categories,
      accent: "muted",
    },
    {
      href: "/admin/iletisim-mesajlari",
      label: "İletişim mesajları",
      description: "İletişim formundan gelen kayıtlar",
      icon: Mail,
      stat: stats?.messages,
      accent: "muted",
    },
  ];

  return (
    <div className="space-y-6 px-4 py-4 sm:px-6 sm:py-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 sm:size-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <LayoutDashboard className="size-5 sm:size-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Admin paneli özeti ve hızlı erişim
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <>
          {stats && (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Makale</span>
                  <span className="flex size-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                    <FileText className="size-4" />
                  </span>
                </div>
                <p className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-bold tabular-nums text-slate-900">{stats.articles}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Yazar</span>
                  <span className="flex size-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Users className="size-4" />
                  </span>
                </div>
                <p className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-bold tabular-nums text-slate-900">{stats.authors}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Kategori</span>
                  <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <FolderTree className="size-4" />
                  </span>
                </div>
                <p className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-bold tabular-nums text-slate-900">{stats.categories}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Mesaj</span>
                  <span className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Mail className="size-4" />
                  </span>
                </div>
                <p className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-bold tabular-nums text-slate-900">{stats.messages}</p>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="font-semibold text-slate-900">Hızlı erişim</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                İlgili sayfaya gitmek için tıklayın
              </p>
            </div>
            <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
              {links.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 sm:gap-4 bg-white p-4 sm:p-5 transition-colors hover:bg-slate-50"
                  >
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                        item.accent === "primary"
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    {item.stat !== undefined && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium tabular-nums text-slate-600">
                        {item.stat}
                      </span>
                    )}
                    <ArrowRight className="size-4 shrink-0 text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
