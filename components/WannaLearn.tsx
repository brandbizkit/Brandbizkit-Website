import Link from "next/link";
import Image from "next/image";

/**
 * Shared "Wanna learn how to use AI?" section — workspace photo with the
 * Karla K. testimonial bubble, as on the original chatgpt / free-ai-tools /
 * popular-ai-tools pages.
 */
export default function WannaLearn({
  heading = "Wanna learn how to use AI for your business?",
  body = "We can help you get started using ChatGPT and other popular AI tools. If you already have some basic knowledge and understanding of AI we can also help you level up your game, teach you new ways of using AI and enhance your output and productivity with super efficient prompts.",
  quote = "I didn't know there were so many amazing AI tools out there!",
}: {
  heading?: string;
  body?: string;
  quote?: string;
}) {
  return (
    <section className="bg-brand-cream py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
        <div>
          <p className="section-eyebrow">AI School</p>
          <h2 className="section-title mt-2">{heading}</h2>
          <p className="section-sub">{body}</p>
          <Link href="/ai-school" className="btn btn-secondary mt-7">
            Learn More
          </Link>
        </div>
        <div className="relative pb-8">
          <Image
            src="/assets/bb_laptop-YbNJEPyLNyhr9yo9.png"
            alt="A laptop displaying an AI-powered dashboard on a bright, modern desk setup"
            width={640}
            height={480}
            className="w-full rounded-2xl object-cover shadow-[0_18px_44px_rgb(13_20_26/0.16)]"
          />
          <figure className="absolute -bottom-2 right-4 max-w-64 rounded-2xl border border-brand-ink/6 bg-white p-4 shadow-[0_12px_32px_rgb(13_20_26/0.18)]">
            <blockquote className="text-sm font-semibold leading-snug text-brand-ink">
              <span aria-hidden className="mr-1 font-display text-lg text-brand-accent">“</span>
              {quote}
            </blockquote>
            <figcaption className="mt-2 flex items-center gap-2 text-xs text-brand-text/60">
              <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-periwinkle/15 font-bold text-brand-periwinkle">
                K
              </span>
              Karla K.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
