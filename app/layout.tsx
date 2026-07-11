import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { getSite } from "@/lib/content";
import { organizationSchema, webSiteSchema, schemaScript } from "@/lib/schema";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollSignupPopup from "@/components/ScrollSignupPopup";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Launch Your Brand with FREE AI Tools for your business | BrandBizkit",
    template: "%s | BrandBizkit",
  },
  description:
    "Empower your entrepreneurial journey with brandbizkit. Access free AI tools for businesses, step-by-step guides, and other brand building resources.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  const rootSchema = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), webSiteSchema()],
  };
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaScript(rootSchema) }}
        />
        <Nav site={site} />
        <main id="main">{children}</main>
        <Footer site={site} />
        <ScrollSignupPopup />
      </body>
    </html>
  );
}
