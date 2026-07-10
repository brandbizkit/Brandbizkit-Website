import type { Video } from "@/lib/content";

/**
 * Video embed with an on-page transcript.
 *
 * The transcript is rendered as crawlable HTML (inside <details>) and mirrored
 * into VideoObject schema — AI search engines use transcriptions to recommend
 * specific videos, so every video on the site should carry one.
 */
export default function VideoWithTranscript({ video }: { video: Video }) {
  return (
    <figure className="card card-hover overflow-hidden">
      <div className="aspect-video bg-brand-ink">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}`}
          title={video.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <figcaption className="p-5">
        <h3 className="font-display font-semibold text-brand-ink">{video.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-brand-text/70">{video.description}</p>
        {video.transcript ? (
          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-semibold text-brand-accent transition hover:text-brand-accent-hover">
              Read full transcript
            </summary>
            <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-brand-text/80">
              {video.transcript}
            </div>
          </details>
        ) : (
          <p className="mt-2 text-xs text-brand-text/40">Transcript coming soon.</p>
        )}
      </figcaption>
    </figure>
  );
}
