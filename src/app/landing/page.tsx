import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { LandingPage } from "@/components/landing/LandingPage";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pyramid — The board that keeps the receipts",
  description:
    "A Kanban board, a grouped list and an analytics view over one set of tasks, with an activity log that records who moved what, and when.",
};

export default function Page() {
  return (
    <div className={`${instrumentSans.variable} ${ibmPlexMono.variable}`}>
      <LandingPage />
    </div>
  );
}
