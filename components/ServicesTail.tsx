import Image from "next/image";
import LeadForm from "./LeadForm";
import PricingKits from "./PricingKits";

/**
 * Shared page tail replicated from the live site: appears on every content page —
 * "Start your business, stress free" CTA, Biz-in-a-Box pricing kits, and the
 * "Let's talk" lead form.
 */
export default function ServicesTail({ source }: { source: string }) {
  return (
    <>
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
          <div>
            <p className="section-eyebrow">Done with you, or for you</p>
            <h3 className="section-title mt-2">
              Start your business, <span className="text-brand-accent">stress free</span>
            </h3>
            <p className="section-sub">
              We help you build your brand from start to finish. Visual identity, messaging,
              go-to-market strategy, marketing and more — powered by curated free AI tools.
            </p>
            <a href="#lets-talk" className="btn btn-primary mt-7">
              Start Now
            </a>
          </div>
          <Image
            src="/assets/start-your-business_brandbizkit-YX4xQvWke1T9D6Eb.jpg"
            alt="Entrepreneur starting a business with BrandBizkit"
            width={640}
            height={427}
            className="rounded-2xl object-cover shadow-[0_18px_44px_rgb(13_20_26/0.14)]"
          />
        </div>
      </section>

      <PricingKits />

      <section id="lets-talk" className="scroll-mt-20 bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <p className="section-eyebrow">Get in touch</p>
            <h3 className="section-title mt-2">Let&apos;s talk about your goals</h3>
            <p className="section-sub mx-auto text-center">
              Get in touch below and tell us about your business or idea and we will help you with
              the right solutions.
            </p>
          </div>
          <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
            <LeadForm source={source} />
            <Image
              src="/assets/filipina_phone-staff_brandbizkit_2-AVLa2kb3zbuGJ0yr.png"
              alt="BrandBizkit support — we're here to help"
              width={560}
              height={560}
              className="hidden w-full rounded-2xl object-cover md:block"
            />
          </div>
        </div>
      </section>
    </>
  );
}
