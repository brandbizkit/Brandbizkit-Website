"use client";

import { useEffect, useRef } from "react";

/**
 * Shared overlay/card shell for the signup popups — dismissible via the
 * close button, backdrop click, or Escape.
 */
export default function PopupModal({
  onClose,
  children,
  labelledBy,
}: {
  onClose: () => void;
  children: React.ReactNode;
  labelledBy: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-ink/60 p-4 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_30px_80px_rgb(13_20_26/0.35)] animate-pop-in"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-brand-text/50 transition hover:bg-brand-light hover:text-brand-ink"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
