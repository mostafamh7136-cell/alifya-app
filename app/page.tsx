"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import LessonCard from "@/components/LessonCard";
import { lessons, totalVocab } from "@/lib/lessons";
import { loadProgress, stats } from "@/lib/progress";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(() => loadProgress());

  useEffect(() => {
    const onStorage = () => setState(loadProgress());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const s = stats(state, lessons.length);
  const inProgress = lessons.filter((l) => !state.lessons[l.id]?.completed);
  const continueLesson =
    inProgress.length > 0 ? inProgress[0] : lessons[0];
  const doneLessons = lessons.filter((l) => state.lessons[l.id]?.completed);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setIsOpen(true)} />

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          {/* Hero */}
          <section className="animate-fade-up relative overflow-hidden rounded-3xl bg-ink-800 p-8 text-cream-50 sm:p-10">
            <div
              className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-clay-500/30 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl"
              aria-hidden
            />
            <div className="relative">
              <span className="chip bg-clay-500/20 text-clay-100 border border-clay-400/30">
                ✨ رحلتك في تعلم العربية
              </span>
              <h1 className="mt-4 font-serif text-3xl font-bold leading-snug sm:text-4xl">
                تعلّم العربية خطوة بخطوة، <span className="text-clay-300">بذكاء وأناقة</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream-200 sm:text-base">
                دروس تفاعلية، مفردات من الحياة الواقعية، واختبارات فورية — صُمم أليفا
                ليأخذك من «مرحباً» إلى محادثة كاملة في الأسواق والمجالس.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href={`/lessons/${continueLesson.id}`} className="btn-primary">
                  {s.completed > 0 ? "تابع التعلّم" : "ابدأ الدرس الأول"}
                  <span aria-hidden>←</span>
                </Link>
                <Link href="/lessons" className="btn-secondary text-ink-700 border-cream-300/30 bg-white/10 text-cream-50 hover:bg-white/20">
                  تصفح كل الدروس
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:max-w-md">
                <div>
                  <p className="font-serif text-2xl font-bold text-clay-300">{lessons.length}</p>
                  <p className="text-xs text-cream-200">دروس</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-clay-300">{totalVocab}+</p>
                  <p className="text-xs text-cream-200">كلمة وعبارة</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-clay-300">{s.streak}🔥</p>
                  <p className="text-xs text-cream-200">أيام متتالية</p>
                </div>
              </div>
            </div>
          </section>

          {/* Progress strip */}
          <section className="animate-fade-up mt-6 grid gap-4 sm:grid-cols-3" style={{ animationDelay: "0.05s" }}>
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-600">الدروس المكتملة</p>
                <span className="text-lg">📚</span>
              </div>
              <p className="mt-2 font-serif text-3xl font-bold text-ink-800">
                {s.completed}
                <span className="text-base font-normal text-ink-400"> / {s.total}</span>
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream-300">
                <div className="h-full rounded-full bg-sage-500 transition-all duration-700" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-600">متوسط النتائج</p>
                <span className="text-lg">🎯</span>
              </div>
              <p className="mt-2 font-serif text-3xl font-bold text-ink-800">
                {s.completed > 0 ? `${s.avgScore}%` : "—"}
              </p>
              <p className="mt-3 text-xs text-ink-400">
                {s.completed > 0 ? "أداء ممتاز، واصل!" : "أكمل درساً أولاً لترى نتيجتك"}
              </p>
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-600">نقاط الخبرة</p>
                <span className="text-lg">⚡</span>
              </div>
              <p className="mt-2 font-serif text-3xl font-bold text-clay-600">{s.xp} XP</p>
              <p className="mt-3 text-xs text-ink-400">
                {s.xp >= 100 ? "أنت نجمة أليفا!" : "أكمل الدروس لكسب المزيد"}
              </p>
            </div>
          </section>

          {/* Continue learning */}
          {s.completed > 0 && (
            <section className="animate-fade-up mt-8" style={{ animationDelay: "0.1s" }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-ink-800">دروسك الأخيرة</h2>
                <Link href="/progress" className="text-sm font-semibold text-clay-600 hover:text-clay-700">
                  عرض التقدم ←
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {doneLessons.slice(-2).reverse().map((l) => (
                  <LessonCard key={l.id} lesson={l} progress={state.lessons[l.id]} />
                ))}
              </div>
            </section>
          )}

          {/* All lessons */}
          <section className="animate-fade-up mt-8" style={{ animationDelay: "0.15s" }}>
            <div className="mb-4">
              <h2 className="font-serif text-xl font-bold text-ink-800">جميع الدروس</h2>
              <p className="text-sm text-ink-400">اختر درساً وابدأ رحلتك</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((l) => (
                <LessonCard key={l.id} lesson={l} progress={state.lessons[l.id]} />
              ))}
            </div>
          </section>

          <footer className="mt-12 border-t border-cream-300 pt-6 pb-4 text-center text-xs text-ink-400">
            <p>
              صُنع بحب لتعليم اللغة العربية — Alifya © {new Date().getFullYear()}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
