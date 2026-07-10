import Image from "next/image";

/**
 * The four free custom-GPT tool cards (Idea Generator, Brand Builder,
 * Market Research, Business Plan Wizard) from the original free-ai-tools
 * and popular-ai-tools pages.
 */
const GPT_TOOLS = [
  {
    name: "Idea Generator",
    text: "Spark creativity with a tool that helps you brainstorm unique business ideas effortlessly.",
    link: "https://chatgpt.com/g/g-QirotU3G3-business-idea-generator",
    image: "/assets/unsplash-photo-1550418290-a8d86ad674a6.jpg",
    alt: "black pencil on white printer paper",
  },
  {
    name: "Brand Builder",
    text: "Create a unique brand identity using this guided brand book builder.",
    link: "https://chatgpt.com/g/g-V4XDNRfZw-brand-book-builder?model=gpt-4o",
    image: "/assets/unsplash-photo-1613759612065-d5971d32ca49.jpg",
    alt: "two people collaborating on a brand",
  },
  {
    name: "Market Research",
    text: "Know your market before you launch with detailed marketing insights.",
    link: "https://chatgpt.com/g/g-O5mNWQGMa-marketing-research-and-competitive-analysis?model=gpt-4o",
    image: "/assets/unsplash-photo-1542744173-05336fcc7ad4.jpg",
    alt: "person using MacBook Pro for research",
  },
  {
    name: "Business Plan Wizard",
    text: "Develop a comprehensive business plan to help you launch your business with strategic insights.",
    link: "https://chatgpt.com/g/g-B7m98jiyn-business-plan-builder?model=gpt-4o",
    image: "/assets/unsplash-photo-1600344984673-32f0c989efdc.jpg",
    alt: "business plan on a phone",
  },
];

export default function ChatGptTools({
  heading = "ChatGPT Tools",
  sub = "Get ahead of the game with our free AI ChatGPT tools. Generate ideas for your new business, create your unique brand identity, or research a product you want to launch. We've got the tools for you.",
}: {
  heading?: string;
  sub?: string;
}) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="section-eyebrow">Free custom GPTs</p>
          <h2 className="section-title mt-2">{heading}</h2>
          <p className="section-sub mx-auto text-center">{sub}</p>
        </div>
        <div className="mt-12 grid gap-7 sm:grid-cols-2">
          {GPT_TOOLS.map((t) => (
            <a
              key={t.name}
              href={t.link}
              rel="noopener"
              target="_blank"
              className="card card-hover group flex flex-col overflow-hidden"
            >
              <div className="overflow-hidden">
                <Image
                  src={t.image}
                  alt={t.alt}
                  width={640}
                  height={420}
                  className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="flex items-baseline gap-2 font-display text-xl font-bold text-brand-ink">
                  {t.name}
                  <span className="rounded-full bg-brand-cream px-2 py-0.5 text-xs font-semibold text-brand-orange">
                    Free
                  </span>
                  <span aria-hidden className="ml-auto text-brand-accent transition group-hover:translate-x-1">→</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-text/75">{t.text}</p>
                <p className="mt-3 text-xs font-medium text-brand-text/50">
                  Requires a free ChatGPT account
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
