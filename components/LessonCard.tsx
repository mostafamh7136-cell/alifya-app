"use client";

import Link from "next/link";
import type { Lesson } from "@/lib/lessons";
import type { LessonProgress } from "@/lib/progress";

const accentStyles: Record<string, { bg: string; text: string; bar: string }> = {
  clay: { bg: "bg-clay-50", text: "text-clay-700", bar: "bg-clay-500" },
  sage: { bg: "bg-sage-50", text: "text-sage-700", bar: "bg-sage-500" },
  gold: { bg: "bg-gold-50", text: "text-gold-600", bar: "bg-gold-500" },
};

export default function LessonCard({
  lesson,
  progress,
}: {
  lesson: Lesson;
  progress?: LessonProgress;
}) {
  const a = accentStyles[lesson.accent] ?? accentStyles.clay;
  const done = progress?.completed;
  const pct = progress?.bestScore ?? 0;

  return (
    <Link
      href={`/lessons/${lesson.id}`}
      className="card card-hover group block p-5"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${a.bg}`}>
          <span aria-hidden>{lesson.icon}</span>
        </div>
        {done ? (
          <span className="chip bg-sage-100 text-sage-700">
            <span aria-hidden>✓</span> مكتمل
          </span>
        ) : (
          <span className={`chip ${a.bg} ${a.text}`}>{lesson.level}</span>
        )}
      </div>

      <h3 className="mt-4 font-serif text-lg font-bold text-ink-800 group-hover:text-clay-700 transition-colors">
        {lesson.arabicTitle}
      </h3>
      <p className="text-xs font-medium text-ink-400">{lesson.title}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
        {lesson.description}
      </p>

      <div className="mt-4 flex items-center gap-3 text-xs text-ink-400">
        <span className="inline-flex items-center gap-1">
          <span aria-hidden>⏱</span> {lesson.duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <span aria-hidden>📖</span> {lesson.vocabulary.length} كلمة
        </span>
        <span className="inline-flex items-center gap-1">
          <span aria-hidden>❓</span> {lesson.quiz.length} أسئلة
        </span>
      </div>

      {done && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-400">أفضل نتيجة</span>
            <span className={`font-bold ${a.text}`}>{pct}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream-300">
            <div className={`h-full rounded-full ${a.bar}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </Link>
  );
}
