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
  title: {
    default: "Alifya — تعلّم العربية بذكاء",
    template: "%s · Alifya",
  },
  description:
    "Alifya is a beautiful, interactive Arabic language learning app — lessons, vocabulary, and quizzes with real-world phrases.",
  keywords: [
    "Arabic learning",
    "تعلم العربية",
    "language app",
    "Arabic lessons",
    "Alifya",
  ],
  openGraph: {
    title: "Alifya — تعلّم العربية بذكاء",
    description:
      "Interactive Arabic lessons, vocabulary and quizzes — from greetings to bargaining in the souk.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF9F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${cairo.variable}`}>
      <body className="font-sans text-ink-800">
        <div className="min-h-screen bg-cream-100">{children}</div>
      </body>
    </html>
  );
}
