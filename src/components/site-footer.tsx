import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { homeContent } from "@/data/home";
import { externalAnchorProps } from "@/lib/external-link";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/Container";

export function SiteFooter() {
  const { lawyer, workerRights, footer } = homeContent;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/8 bg-white text-ink">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <p className="font-serif text-xl">{lawyer.shortName}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ink/60">{footer.blurb}</p>
          <div className="mt-5 flex gap-3">
            <a href={siteConfig.social.instagram} {...externalAnchorProps} className="text-ink/40 transition-colors hover:text-copper" aria-label="Instagram">
              <Instagram className="size-4" />
            </a>
            <a href={siteConfig.social.linkedin} {...externalAnchorProps} className="text-ink/40 transition-colors hover:text-copper" aria-label="LinkedIn">
              <Linkedin className="size-4" />
            </a>
            <a href={siteConfig.social.facebook} {...externalAnchorProps} className="text-ink/40 transition-colors hover:text-copper" aria-label="Facebook">
              <Facebook className="size-4" />
            </a>
            <a href={siteConfig.social.youtube} {...externalAnchorProps} className="text-ink/40 transition-colors hover:text-copper" aria-label="YouTube">
              <Youtube className="size-4" />
            </a>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Hızlı linkler</p>
          <ul className="mt-4 space-y-2">
            {footer.quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink/70 transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">İşçi hakları</p>
          <ul className="mt-4 space-y-2">
            {workerRights.items.map((item) => (
              <li key={item.slug}>
                <Link href={item.href} className="text-sm text-ink/70 transition-colors hover:text-ink">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">İletişim</p>
          <ul className="mt-4 space-y-2 text-sm text-ink/70">
            <li>{lawyer.address}</li>
            <li>
              <a href={`mailto:${lawyer.email}`} className="transition-colors hover:text-ink">
                {lawyer.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-ink/8">
        <Container className="flex flex-col gap-3 py-5 text-[12px] text-ink/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {lawyer.shortName}
          </p>
          <ul className="flex flex-wrap gap-4">
            {footer.legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
