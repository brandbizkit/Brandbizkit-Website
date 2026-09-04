"use client";

import { useState } from "react";
import type { SiteConfig } from "@/lib/content";

/**
 * Redesigned top nav. Same items, labels and destinations as the live nav
 * (site.nav, already year-interpolated by getSite()). Only in-site links that
 * point at the old homepage are re-pointed into the redesign context so the
 * preview stays self-consistent:  "/" -> "/redesign",  "/#x" -> "/redesign#x".
 * Every other route (tools pages, AI School, Growth Score, …) still links to
 * the real shared page, which is intentionally not part of this redesign.
 */
function localize(href: string): string {
  if (href === "/") return "/redesign";
  if (href.startsWith("/#")) return `/redesign#${href.slice(2)}`;
  return href;
}

const Caret = () => (
  <svg className="rd-nav__caret" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
    <path d="M1 1l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function RedesignNav({ site }: { site: SiteConfig }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="rd-nav" data-od-id="redesign-nav">
      <div className="rd-wrap rd-nav__bar">
        <a href="/redesign" className="rd-nav__logo" aria-label={`${site.name} home`}>
          {/* existing brand asset, unmodified */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.logo} alt={`${site.name} logo`} width={180} height={37} />
        </a>

        <nav aria-label="Main navigation">
          <ul className="rd-nav__links">
            {site.nav.map((item) =>
              item.children ? (
                <li key={item.label} className="rd-nav__item">
                  <a className="rd-nav__link" href={localize(item.href)}>
                    {item.label}
                    <Caret />
                  </a>
                  <ul className="rd-nav__menu">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <a href={localize(c.href)}>{c.label}</a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.label} className="rd-nav__item">
                  <a
                    className={item.cta ? "rd-btn rd-btn--primary" : "rd-nav__link"}
                    href={localize(item.href)}
                    style={item.cta ? { marginLeft: "0.6rem" } : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>

        <button
          className="rd-nav__toggle"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="#0d141a" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#0d141a" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <div className={`rd-nav__mobile ${open ? "is-open" : ""}`}>
        {site.nav.map((item) => (
          <div key={item.label}>
            <a href={localize(item.href)} onClick={() => setOpen(false)}>
              {item.label}
            </a>
            {item.children && (
              <div className="rd-nav__sub">
                {item.children.map((c) => (
                  <a key={c.href} href={localize(c.href)} onClick={() => setOpen(false)}>
                    {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}
