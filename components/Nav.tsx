"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { SiteConfig } from "@/lib/content";

export default function Nav({ site }: { site: SiteConfig }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-ink/8 bg-white/90 shadow-[0_1px_12px_rgb(13_20_26/0.04)] backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5"
      >
        <Link href="/" aria-label={`${site.name} home`} className="flex items-center gap-2">
          <Image
            src={site.logo}
            alt={`${site.name} logo`}
            width={180}
            height={37}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {site.nav.map((item) =>
            item.children ? (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-brand-ink transition hover:bg-brand-light hover:text-brand-accent"
                >
                  {item.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden className="opacity-60 transition group-hover:rotate-180">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Link>
                <ul className="invisible absolute left-0 top-full min-w-60 translate-y-1 rounded-2xl border border-brand-ink/8 bg-white p-2 opacity-0 shadow-[0_12px_40px_rgb(13_20_26/0.14)] transition-all duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        className="block rounded-xl px-3.5 py-2.5 text-sm text-brand-text/85 transition hover:bg-brand-cream hover:text-brand-accent"
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={
                    item.cta
                      ? "btn btn-secondary ml-3 px-5 py-2 text-sm"
                      : "rounded-full px-3.5 py-2 text-sm font-medium text-brand-ink transition hover:bg-brand-light hover:text-brand-accent"
                  }
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-1.5 transition hover:bg-brand-light lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="#0d141a" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#0d141a" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-brand-ink/8 bg-white px-4 pb-5 lg:hidden">
          {site.nav.map((item) => (
            <div key={item.label} className="py-1">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={
                  item.cta
                    ? "btn btn-secondary mt-3 px-5 py-2 text-sm"
                    : "block py-2 font-medium text-brand-ink"
                }
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-3 border-l-2 border-brand-cream pl-4">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-sm text-brand-text/75 transition hover:text-brand-accent"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
