import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl space-y-4", align === "center" && "mx-auto text-center")}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-copper">{eyebrow}</p>
      <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
      {intro ? <p className="text-[15px] leading-7 text-ink/70">{intro}</p> : null}
    </div>
  );
}
