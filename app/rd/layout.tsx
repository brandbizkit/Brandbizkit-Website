import type { Metadata } from "next";
import "./rd.css";
import RdNav from "./_components/RdNav";
import RdFooter from "./_components/RdFooter";

export const metadata: Metadata = {
  title: "BrandBizkit — Design Preview",
  description: "Parallel redesign preview of the BrandBizkit site. Not the live site.",
  robots: { index: false, follow: false },
};

export default function RdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rd-root">
      <RdNav />
      {children}
      <RdFooter />
    </div>
  );
}
