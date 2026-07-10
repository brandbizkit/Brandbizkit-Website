"use client";

/**
 * Floating podcast player — rebuild of the original homepage audio widget
 * (Crunch Time podcast, episode 1). Collapsed bubble in the corner; expands
 * to a small player panel.
 */
import { useRef, useState } from "react";

export default function PodcastWidget() {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play();
      setPlaying(true);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio
        ref={audioRef}
        src="/assets/episode1-crunchtime-podcast.mp3"
        preload="none"
        onEnded={() => setPlaying(false)}
      />
      {expanded ? (
        <div className="w-72 rounded-2xl border border-brand-ink/8 bg-white p-4 shadow-[0_20px_48px_rgb(13_20_26/0.22)] transition-all">
          <div className="flex items-start justify-between">
            <p className="font-display text-sm font-bold text-brand-ink">
              🎙️ Crunch Time — Episode 1
            </p>
            <button
              aria-label="Close player"
              onClick={() => setExpanded(false)}
              className="text-brand-text/50 hover:text-brand-ink"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-xs text-brand-text/60">The brandbizkit podcast</p>
          <button
            onClick={toggle}
            className="btn btn-quiz mt-3 w-full px-4 py-2"
          >
            {playing ? "⏸ Pause" : "▶ Listen now"}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          aria-label="Open podcast player"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-2xl shadow-[0_10px_28px_rgb(255_87_51/0.5)] transition hover:scale-110"
        >
          🎙️
        </button>
      )}
    </div>
  );
}
