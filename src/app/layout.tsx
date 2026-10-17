import type { Metadata, Viewport } from "next";
import { Host_Grotesk, DM_Mono, Newsreader } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import MobileCta from "@/components/MobileCta";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, abs } from "@/lib/seo";
import { studio } from "@/content/site";
import { lowPowerScript } from "@/lib/perf";
import "./globals.css";

const host = Host_Grotesk({ variable: "--font-host", subsets: ["latin"], weight: "variable" });
const mono = DM_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });
const serif = Newsreader({ variable: "--font-serif", subsets: ["latin"], style: "italic", axes: ["opsz"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Monark Studio — AI automation, websites & brand studio", template: "%s — Monark Studio" },
  description:
    "Monark Studio finds the hours your business loses to manual work and builds the systems, websites and brands that win them back.",
  applicationName: "Monark Studio",
  authors: [{ name: "Krishna Soni", url: abs("/studio") }],
  creator: "Monark Studio",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: { type: "website", siteName: "Monark Studio", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
  // Google Search Console → HTML tag method: paste only the content="…" value into this env var.
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

const organization = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${abs("/")}#organization`,
  name: studio.name,
  url: abs("/"),
  email: studio.email,
  description: "AI automation, websites and brand systems for businesses that want their hours back.",
  foundingDate: String(studio.founded),
  founder: { "@type": "Person", name: "Krishna Soni" },
  address: { "@type": "PostalAddress", addressLocality: "Bhopal", addressRegion: "Madhya Pradesh", addressCountry: "IN" },
  areaServed: "Worldwide",
  currenciesAccepted: "USD",
  knowsAbout: ["AI automation", "Workflow automation", "Web development", "E-commerce", "Brand identity", "UI design"],
  sameAs: studio.social.map((s) => s.href),
};

export const viewport: Viewport = {
  themeColor: "#ede9e1",
};

// Hide reveal targets before first paint — but only when motion is allowed,
// and never for longer than 3s in case JS fails.
const motionGuard = `(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.classList.add('js-motion');setTimeout(function(){d.classList.remove('js-motion')},3000)}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${host.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: lowPowerScript + motionGuard }} />
      </head>
      <body>
        <JsonLd data={organization} />
        <SmoothScroll />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileCta />
      </body>
    </html>
  );
}
