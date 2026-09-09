"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const isHome = pathname === "/";

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/lessons?q=${encodeURIComponent(value)}` : "/lessons");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-cream-300 bg-cream-100/80 px-4 py-3 backdrop-blur-md sm:px-6 no-print">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-cream-300 bg-white text-ink-600 lg:hidden"
        aria-label="فتح القائمة"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <div className="flex-1">
        <p className="text-xs font-medium text-ink-400">{isHome ? "لوحة التعلم" : "أليفا"}</p>
        <p className="font-serif text-lg font-bold leading-tight text-ink-800">
          {isHome ? "أهلاً بعودتك 👋" : pathname.startsWith("/lessons") ? "الدروس" : pathname.startsWith("/progress") ? "تقدّمك" : "أليفا"}
        </p>
      </div>

      <form
        onSubmit={submitSearch}
        className="hidden md:flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-clay-400/40"
        role="search"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <label htmlFor="lesson-search" className="sr-only">البحث في الدروس</label>
        <input
          id="lesson-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن درس…"
          autoComplete="off"
          className="w-44 bg-transparent text-sm text-ink-700 placeholder:text-ink-400 focus:outline-none"
        />
      </form>

      <Link
        href="/progress"
        className="flex items-center gap-2 rounded-xl border border-clay-200 bg-clay-50 px-3 py-2 text-sm font-semibold text-clay-700 transition-colors hover:bg-clay-100"
      >
        <span aria-hidden="true">🔥</span>
        <span className="hidden sm:inline">النقاط</span>
      </Link>
    </header>
  );
}
