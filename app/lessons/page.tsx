"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import LessonCard from "@/components/LessonCard";
import { lessons, categories } from "@/lib/lessons";
import { loadProgress } from "@/lib/progress";

function LessonsContent() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string>("الكل");
  const [state, setState] = useState(() => loadProgress());

  useEffect(() => {
    const onStorage = () => setState(loadProgress());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    let list = lessons;
    if (activeCat !== "الكل") list = list.filter((l) => l.category === activeCat);
    if (q) {
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.arabicTitle.includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.vocabulary.some(
            (v) =>
              v.arabic.includes(q) ||
              v.meaning.toLowerCase().includes(q) ||
              v.translit.toLowerCase().includes(q)
          )
      );
    }
    return list;
  }, [activeCat, q]);

  const completedCount = lessons.filter((l) => state.lessons[l.id]?.completed).length;

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setIsOpen(true)} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          <div className="animate-fade-up">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-ink-800">الدروس</h1>
                <p className="mt-1 text-sm text-ink-400">
                  {q ? `نتائج البحث عن «${q}»` : `${lessons.length} دروس · أكملت ${completedCount} منها`}
                </p>
              </div>
              <div className="chip bg-sage-100 text-sage-700">
                <span aria-hidden>✅</span> {completedCount}/{lessons.length} مكتملة
              </div>
            </div>

            {/* Category filter */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["الكل", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeCat === cat
                      ? "bg-ink-800 text-cream-50"
                      : "border border-cream-300 bg-white text-ink-500 hover:bg-cream-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="animate-fade-up card mt-8 p-12 text-center">
              <p className="text-4xl">🔍</p>
              <p className="mt-3 font-semibold text-ink-700">لا توجد نتائج</p>
              <p className="mt-1 text-sm text-ink-400">جرّب كلمة بحث أخرى أو غيّر التصنيف</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((l, i) => (
                <div key={l.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <LessonCard lesson={l} progress={state.lessons[l.id]} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-ink-400">جارِ التحميل…</div>}>
      <LessonsContent />
    </Suspense>
  );
}
