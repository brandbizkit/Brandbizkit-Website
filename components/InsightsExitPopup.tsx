"use client";

/**
 * Exit-intent signup popup for Bizkit Insights pages (the /ai-news index and
 * every article). Triggers when the cursor leaves via the top of the
 * viewport — the classic "about to close the tab / switch away" signal.
 *
 * Unlike ScrollSignupPopup (once ever, sitewide), this one is scoped to
 * Insights content and re-arms every browser session, so a reader who comes
 * back tomorrow and reads another article can see it again — but it won't
 * fire twice in the same session, and never once someone has subscribed.
 */
import { useEffect, useState } from "react";
import PopupModal from "./PopupModal";
import NewsletterSignup from "./NewsletterSignup";

const SEEN_KEY = "bb_popup_insights_shown"; // sessionStorage — resets per session
const SUBSCRIBED_KEY = "bb_subscribed"; // localStorage — persists forever

export default function InsightsExitPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") return;
      if (localStorage.getItem(SUBSCRIBED_KEY) === "1") return;
    } catch {
      return; // no storage access (private mode) — skip entirely
    }

    function onMouseLeave(e: MouseEvent) {
      if (e.clientY > 0) return; // only the top edge counts as exit intent
      setOpen(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // non-fatal
      }
      document.removeEventListener("mouseleave", onMouseLeave);
    }

    // Small delay so a quick mouse jitter right after page load can't fire it.
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", onMouseLeave);
    }, 4000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  if (!open) return null;

  return (
    <PopupModal onClose={() => setOpen(false)} labelledBy="exit-popup-title">
      <p className="section-eyebrow">Before you go</p>
      <h2 id="exit-popup-title" className="mt-2 font-display text-2xl font-bold text-brand-ink">
        Enjoying Bizkit Insights?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-brand-text/75">
        Get our best AI-for-business articles delivered as soon as they publish — practical
        tools, real data, zero fluff.
      </p>
      <div className="mt-6">
        <NewsletterSignup
          source="popup_exit_insights"
          onSubscribed={() => setTimeout(() => setOpen(false), 1500)}
        />
      </div>
    </PopupModal>
  );
}
