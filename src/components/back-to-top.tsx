"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <Button
      type="button"
      onClick={scrollToTop}
      size="icon-lg"
      className="fixed right-4 bottom-6 z-40 size-10 bg-slate-800 text-white shadow-lg hover:bg-slate-700 sm:size-12 md:right-6 md:bottom-8"
      aria-label="Yukarı çık"
    >
      <ChevronUp className="size-5 sm:size-6" />
    </Button>
  );
}
