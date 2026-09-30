"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isExternalHref, mergeExternalRel } from "@/lib/external-link";

function applyExternalLinkPolicy(root: ParentNode = document) {
  root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!isExternalHref(href)) return;
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", mergeExternalRel(anchor.getAttribute("rel")));
  });
}

/** Public sayfalardaki tüm dış linklere nofollow + yeni sekme uygular. */
export function EnforceExternalLinks() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    applyExternalLinkPolicy();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) applyExternalLinkPolicy(node);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
