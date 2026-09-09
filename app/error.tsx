"use client";

import { useEffect } from "react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Keep rendering minimal while the route recovers.
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-100 px-6">
      <section className="max-w-lg rounded-3xl border border-cream-300 bg-white p-8 text-center shadow-card sm:p-10" dir="rtl">
        <div className="text-5xl" aria-hidden="true">⚠️</div>
        <h1 className="mt-4 font-serif text-2xl font-bold text-ink-800">حدث خطأ غير متوقع</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">لم ينجح تحميل هذه الصفحة. جرّب المحاولة مرة أخرى.</p>
        <button type="button" onClick={() => reset()} className="btn-primary mt-6">إعادة المحاولة</button>
      </section>
    </main>
  );
}
