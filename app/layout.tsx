import type { Metadata, Viewport } from "next";
import { Amiri, Cairo } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alifya.vercel.app"),
  title: { default: "Alifya — تعلّم العربية بذكاء", template: "%s · Alifya" },
  description: "تعلم العربية بطريقة تفاعلية: دروس قصيرة، مفردات عملية، اختبارات فورية، وتتبع تقدّمك خطوة بخطوة.",
  keywords: ["Arabic learning", "تعلم العربية", "Arabic lessons", "تعليم العربية", "Alifya"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Alifya — تعلّم العربية بذكاء",
    description: "دروس عربية تفاعلية ومفردات واختبارات مع تتبع للتقدم.",
    url: "https://alifya.vercel.app",
    siteName: "Alifya",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Alifya — تعلّم العربية بذكاء",
    description: "دروس عربية تفاعلية ومفردات واختبارات.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF9F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${cairo.variable}`}>
      <body className="font-sans text-ink-800">
        <div className="min-h-screen bg-cream-100">{children}</div>
      </body>
    </html>
  );
}
