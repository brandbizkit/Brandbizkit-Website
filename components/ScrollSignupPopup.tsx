"use client";

/**
 * First-visit, scroll-triggered signup popup — mounted sitewide (root
 * layout). Shows once ever per browser: the first time a visitor scrolls
 * past roughly 2–3 sections' worth of content on ANY page, then never
 * again (localStorage flag), and never if they've already subscribed.
 */
import { useEffect, useState } from "react";
import Image from "next/image";
import PopupModal from "./PopupModal";
import NewsletterSignup from "./NewsletterSignup";

const SEEN_KEY = "bb_popup_scroll_shown";
const SUBSCRIBED_KEY = "bb_subscribed";

export default function ScrollSignupPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1" || localStorage.getItem(SUBSCRIBED_KEY) === "1";
    } catch {
      return; // no localStorage (private mode) — skip the popup entirely
    }
    if (seen) return;

    // Roughly 2–3 sections' worth of scrolling, scaled to viewport so it
    // feels consistent whether sections run short or tall on a given page.
    const threshold = Math.max(900, window.innerHeight * 1.6);

    function onScroll() {
      if (window.scrollY < threshold) return;
      setOpen(true);
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        // non-fatal
      }
      window.removeEventListener("scroll", onScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!open) return null;

  return (
    <PopupModal onClose={() => setOpen(false)} labelledBy="scroll-popup-title">
      <Image
        src="/assets/brandbizkit-logo-icon_biz-in-a-box-m2WqBe1lo1IyOwpo.png"
        alt=""
        aria-hidden
        width={56}
        height={56}
        className="h-14 w-14"
      />
      <h2 id="scroll-popup-title" className="mt-4 font-display text-2xl font-bold text-brand-ink">
        Get free AI tools &amp; guides in your inbox
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-brand-text/75">
        Join the brandbizkit list for the newest free AI tools, step-by-step guides, and brand
        templates — no spam, unsubscribe anytime.
      </p>
      <div className="mt-6">
        <NewsletterSignup source="popup_scroll" onSubscribed={() => setTimeout(() => setOpen(false), 1500)} />
      </div>
    </PopupModal>
  );
}
