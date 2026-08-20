"use client";

import { useEffect, useState } from "react";

/**
 * Floating "Go to top" pill — appears once the visitor has scrolled past the
 * hero on long tool-directory pages. Sits on the right edge on desktop and
 * bottom-right on mobile, with a gentle continuous float so it reads as
 * interactive without being distracting.
 */
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Go to top"
      className={`fixed bottom-6 right-4 z-40 flex items-center gap-1.5 rounded-full bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgb(255_66_50/0.4)] transition-all duration-300 hover:bg-brand-accent-hover sm:right-6 sm:bottom-8 ${
        visible
          ? "translate-y-0 opacity-100 animate-bb-float"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span aria-hidden className="text-base leading-none">↑</span>
      Go to top
    </button>
  );
}
