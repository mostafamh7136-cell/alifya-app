"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { lessons } from "@/lib/lessons";
import { loadProgress, stats } from "@/lib/progress";

const accentMap: Record<string, { bg: string; text: string; bar: string }> = {
  clay: { bg: "bg-clay-50", text: "text-clay-700", bar: "bg-clay-500" },
  sage: { bg: "bg-sage-50", text: "text-sage-700", bar: "bg-sage-500" },
  gold: { bg: "bg-gold-50", text: "text-gold-600", bar: "bg-gold-500" },
};

export default function ProgressPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(() => loadProgress());

  useEffect(() => {
    const onStorage = () => setState(loadProgress());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const s = stats(state, lessons.length);
  const completedLessons = lessons.filter((l) => state.lessons[l.id]?.completed);
  const remaining = lessons.filter((l) => !state.lessons[l.id]?.completed);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setIsOpen(true)} />

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
          <div className="animate-fade-up">
            <h1 className="font-serif text-3xl font-bold text-ink-800">تقدّمك</h1>
            <p className="mt-1 text-sm text-ink-400">
              راقب رحلتك في تعلم العربية وابنِ سلسلة أيامك 🔥
            </p>
          </div>

          {/* Stat cards */}
          <section className="animate-fade-up mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4" style={{ animationDelay: "0.04s" }}>
            <div className="card p-5 text-center">
              <p className="text-3xl" aria-hidden>📚</p>
              <p className="mt-2 font-serif text-3xl font-bold text-ink-800">
                {s.completed}
                <span className="text-base font-normal text-ink-400">/{s.total}</span>
              </p>
              <p className="text-xs font-semibold text-ink-400">دروس مكتملة</p>
            </div>
            <div className="card p-5 text-center">
              <p className="text-3xl" aria-hidden>🎯</p>
              <p className="mt-2 font-serif text-3xl font-bold text-clay-600">
                {s.completed > 0 ? `${s.avgScore}%` : "—"}
              </p>
              <p className="text-xs font-semibold text-ink-400">متوسط النتائج</p>
            </div>
            <div className="card p-5 text-center">
              <p className="text-3xl" aria-hidden>⚡</p>
              <p className="mt-2 font-serif text-3xl font-bold text-gold-600">{s.xp}</p>
              <p className="text-xs font-semibold text-ink-400">نقاط الخبرة</p>
            </div>
            <div className="card p-5 text-center">
              <p className="text-3xl" aria-hidden>🔥</p>
              <p className="mt-2 font-serif text-3xl font-bold text-sage-600">{s.streak}</p>
              <p className="text-xs font-semibold text-ink-400">أيام متتالية</p>
            </div>
          </section>

          {/* Overall progress */}
          <section className="animate-fade-up card mt-6 p-6" style={{ animationDelay: "0.08s" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-ink-800">التقدم الكلي</h2>
              <span className="font-serif text-2xl font-bold text-clay-600">{s.pct}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-cream-300">
              <div
                className="h-full rounded-full bg-gradient-to-l from-clay-500 to-gold-500 transition-all duration-700"
                style={{ width: `${s.pct}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-ink-400">
              {s.completed === 0
                ? "ابدأ أول درس لتنطلق رحلتك!"
                : s.completed === s.total
                ? "أكملت جميع الدروس — أنت أسطورة! 🏆"
                : `بقي لديك ${s.total - s.completed} دروس لإكمال المنهج`}
            </p>
          </section>

          {/* Lesson breakdown */}
          <section className="animate-fade-up mt-8" style={{ animationDelay: "0.12s" }}>
            <h2 className="font-serif text-xl font-bold text-ink-800">تفاصيل الدروس</h2>
            <div className="mt-4 space-y-3">
              {lessons.map((l) => {
                const p = state.lessons[l.id];
                const a = accentMap[l.accent] ?? accentMap.clay;
                return (
                  <Link
                    key={l.id}
                    href={`/lessons/${l.id}`}
                    className="card card-hover flex items-center gap-4 p-4"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${a.bg}`} aria-hidden>
                      {l.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-ink-800">{l.arabicTitle}</p>
                      <p className="truncate text-xs text-ink-400">{l.title}</p>
                    </div>
                    {p?.completed ? (
                      <div className="w-28 shrink-0 text-end">
                        <div className="h-2 overflow-hidden rounded-full bg-cream-300">
                          <div className={`h-full rounded-full ${a.bar}`} style={{ width: `${p.bestScore}%` }} />
                        </div>
                        <p className={`mt-1 text-xs font-bold ${a.text}`}>{p.bestScore}% · {p.attempts} محاولة</p>
                      </div>
                    ) : (
                      <span className="chip shrink-0 border border-cream-300 bg-cream-100 text-ink-400">
                        لم يبدأ
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Next up */}
          {remaining.length > 0 && (
            <section className="animate-fade-up card mt-8 flex flex-wrap items-center justify-between gap-4 border-clay-200 bg-clay-50 p-6" style={{ animationDelay: "0.16s" }}>
              <div>
                <p className="text-sm font-bold text-clay-800">الدرس التالي</p>
                <p className="font-serif text-lg font-bold text-ink-800">
                  {remaining[0].icon} {remaining[0].arabicTitle}
                </p>
              </div>
              <Link href={`/lessons/${remaining[0].id}`} className="btn-primary">
                ابدأ الآن ←
              </Link>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}