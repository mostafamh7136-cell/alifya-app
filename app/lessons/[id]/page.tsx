"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Quiz from "@/components/Quiz";
import { getLesson, lessons } from "@/lib/lessons";
import { recordQuizResult, loadProgress } from "@/lib/progress";

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const lesson = getLesson(params.id);

  const [isOpen, setIsOpen] = useState(false);
  const [section, setSection] = useState<"vocab" | "phrases" | "quiz">("vocab");
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [state, setState] = useState(() => loadProgress());

  useEffect(() => {
    const onStorage = () => setState(loadProgress());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="card p-12 text-center">
          <p className="text-5xl">🤔</p>
          <h1 className="mt-3 font-serif text-2xl font-bold text-ink-800">الدرس غير موجود</h1>
          <p className="mt-2 text-sm text-ink-400">ربما تغيّر الرابط أو حُذف الدرس</p>
          <Link href="/lessons" className="btn-primary mt-6">
            العودة للدروس
          </Link>
        </div>
      </div>
    );
  }

  const accentText =
    lesson.accent === "sage"
      ? "text-sage-700"
      : lesson.accent === "gold"
      ? "text-gold-600"
      : "text-clay-700";

  const flipCard = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const progress = state.lessons[lesson.id];
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const prev = lessons[idx - 1];
  const nextLesson = lessons[idx + 1];

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setIsOpen(true)} />

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
          {/* Breadcrumb */}
          <nav className="animate-fade-up flex items-center gap-2 text-sm text-ink-400">
            <Link href="/" className="hover:text-ink-600">الرئيسية</Link>
            <span aria-hidden>←</span>
            <Link href="/lessons" className="hover:text-ink-600">الدروس</Link>
            <span aria-hidden>←</span>
            <span className="font-semibold text-ink-700">{lesson.arabicTitle}</span>
          </nav>

          {/* Lesson header */}
          <header className="animate-fade-up mt-4" style={{ animationDelay: "0.03s" }}>
            <div className="card overflow-hidden">
              <div className="flex flex-wrap items-center gap-4 p-6 sm:p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-200 text-4xl" aria-hidden>
                  {lesson.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`chip ${lesson.accent === "sage" ? "bg-sage-100" : lesson.accent === "gold" ? "bg-gold-100" : "bg-clay-100"} ${accentText}`}>
                      {lesson.level}
                    </span>
                    <span className="chip bg-cream-200 text-ink-500">{lesson.category}</span>
                    <span className="chip bg-cream-200 text-ink-500">⏱ {lesson.duration}</span>
                    {progress?.completed && (
                      <span className="chip bg-sage-100 text-sage-700">✓ أفضل نتيجة {progress.bestScore}%</span>
                    )}
                  </div>
                  <h1 className="mt-2 font-serif text-2xl font-bold text-ink-800 sm:text-3xl">
                    {lesson.arabicTitle}
                  </h1>
                  <p className="text-sm font-medium text-ink-400">{lesson.title}</p>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
                    {lesson.description}
                  </p>
                </div>
              </div>
              {lesson.tip && (
                <div className="border-t border-cream-200 bg-gold-50 px-6 py-3.5 sm:px-8">
                  <p className="text-sm leading-relaxed text-gold-800">
                    <span className="font-bold">💡 نصيحة الخبراء: </span>
                    {lesson.tip}
                  </p>
                </div>
              )}
            </div>
          </header>

          {/* Section tabs */}
          <div className="animate-fade-up mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-cream-300 bg-cream-200 p-1.5" style={{ animationDelay: "0.06s" }}>
            {([
              ["vocab", "📖 المفردات"],
              ["phrases", "💬 عبارات"],
              ["quiz", "❓ اختبار"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  section === key
                    ? "bg-white text-ink-800 shadow-card"
                    : "text-ink-400 hover:text-ink-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Vocab section */}
          {section === "vocab" && (
            <section className="animate-fade-up mt-6" style={{ animationDelay: "0.08s" }}>
              <div className="grid gap-3 sm:grid-cols-2">
                {lesson.vocabulary.map((v, i) => {
                  const isFlipped = flipped.has(i);
                  return (
                    <button
                      key={i}
                      onClick={() => flipCard(i)}
                      className="card card-hover relative min-h-[9.5rem] overflow-hidden p-5 text-start"
                      aria-label={isFlipped ? "إظهار المعنى" : "إظهار الكلمة"}
                    >
                      {!isFlipped ? (
                        <div className="flex h-full flex-col">
                          <span className="text-xs font-semibold text-ink-400">
                            الكلمة {i + 1}
                          </span>
                          <span className="prose-ar mt-2 font-serif text-2xl font-bold text-ink-800">
                            {v.arabic}
                          </span>
                          <span className="mt-1 text-sm text-ink-400" dir="ltr">
                            {v.translit}
                          </span>
                          <span className="mt-auto pt-3 text-xs font-semibold text-clay-600">
                            اضغط للكشف عن المعنى ↵
                          </span>
                        </div>
                      ) : (
                        <div className="flex h-full flex-col">
                          <span className="text-xs font-semibold text-ink-400">المعنى</span>
                          <span className="mt-2 text-lg font-bold text-ink-800">
                            {v.meaning}
                          </span>
                          {v.example && (
                            <div className="mt-3 rounded-xl bg-cream-100 px-3 py-2.5">
                              <p className="prose-ar text-base font-semibold text-ink-700">
                                {v.example}
                              </p>
                              <p className="text-xs text-ink-400" dir="ltr">
                                {v.exampleTranslit}
                              </p>
                              <p className="mt-0.5 text-xs text-ink-500">— {v.exampleMeaning}</p>
                            </div>
                          )}
                          <span className="mt-auto pt-3 text-xs font-semibold text-clay-600">
                            اضغط للرجوع ↵
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Phrases section */}
          {section === "phrases" && (
            <section className="animate-fade-up mt-6 space-y-3" style={{ animationDelay: "0.08s" }}>
              {lesson.phrases.map((p, i) => (
                <div key={i} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="prose-ar font-serif text-xl font-bold text-ink-800">
                        {p.arabic}
                      </p>
                      <p className="mt-1 text-sm text-ink-400" dir="ltr">
                        {p.translit}
                      </p>
                    </div>
                    <span className="chip bg-sage-50 text-sage-700">{p.meaning}</span>
                  </div>
                  {p.note && (
                    <p className="mt-3 rounded-xl bg-gold-50 px-3 py-2 text-xs leading-relaxed text-gold-800">
                      📌 {p.note}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Quiz section */}
          {section === "quiz" && (
            <section className="animate-fade-up mt-6" style={{ animationDelay: "0.08s" }}>
              <Quiz
                questions={lesson.quiz}
                onComplete={(score, total) => {
                  const newState = recordQuizResult(lesson.id, score, total);
                  setState(newState);
                }}
              />
            </section>
          )}

          {/* Next/prev lesson */}
          <div className="animate-fade-up mt-8 grid gap-3 sm:grid-cols-2" style={{ animationDelay: "0.1s" }}>
            {prev && (
              <Link href={`/lessons/${prev.id}`} className="card card-hover flex items-center gap-3 p-4">
                <span className="text-2xl" aria-hidden>{prev.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs text-ink-400">الدرس السابق</p>
                  <p className="truncate font-bold text-ink-700">{prev.arabicTitle}</p>
                </div>
              </Link>
            )}
            {nextLesson && (
              <Link href={`/lessons/${nextLesson.id}`} className="card card-hover flex items-center justify-end gap-3 p-4 sm:flex-row-reverse">
                <div className="min-w-0 text-end">
                  <p className="text-xs text-ink-400">الدرس التالي</p>
                  <p className="truncate font-bold text-ink-700">{nextLesson.arabicTitle}</p>
                </div>
                <span className="text-2xl" aria-hidden>{nextLesson.icon}</span>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}