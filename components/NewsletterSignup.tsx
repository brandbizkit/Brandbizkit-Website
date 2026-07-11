"use client";

import { useState } from "react";

/**
 * Reusable newsletter signup form — used in the footer and inside both
 * popups. Every submission carries a `source` so /admin can see which
 * touch-point is actually converting.
 */
export default function NewsletterSignup({
  source,
  variant = "light",
  onSubscribed,
}: {
  source: string;
  variant?: "light" | "dark";
  onSubscribed?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source, pagePath: window.location.pathname }),
    });
    if (res.ok) {
      setStatus("sent");
      try {
        localStorage.setItem("bb_subscribed", "1");
      } catch {
        // localStorage unavailable (private mode etc.) — non-fatal
      }
      onSubscribed?.();
    } else {
      setStatus("error");
    }
  }

  const dark = variant === "dark";

  if (status === "sent") {
    return (
      <p className={dark ? "text-white" : "text-brand-ink"}>
        🎉 You&apos;re on the list — check your inbox for a confirmation soon.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor={`newsletter-email-${source}`}>
        Email address
      </label>
      <input
        id={`newsletter-email-${source}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className={
          dark
            ? "min-w-0 flex-1 rounded-full border border-white/30 bg-white/15 px-5 py-3 text-white placeholder:text-white/60 outline-none focus:border-white focus:bg-white/20"
            : "min-w-0 flex-1 rounded-full border border-brand-ink/12 bg-white px-5 py-3 text-brand-ink placeholder:text-brand-text/40 outline-none focus:border-brand-periwinkle focus:ring-2 focus:ring-brand-periwinkle/25"
        }
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className={dark ? "btn bg-white px-6 text-brand-ink hover:bg-brand-light" : "btn btn-primary px-6"}
      >
        {status === "sending" ? "Joining…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p className={`text-sm ${dark ? "text-white" : "text-brand-accent"} sm:basis-full`}>
          Something went wrong — please try again.
        </p>
      )}
    </form>
  );
}
