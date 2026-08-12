"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/lessons";

type QuizProps = {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
};

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const pick = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.answerIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      onComplete(score, questions.length);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📖";
    return (
      <div className="animate-pop rounded-2xl border border-cream-300 bg-white p-8 text-center shadow-lift">
        <p className="text-5xl">{emoji}</p>
        <h3 className="mt-3 font-serif text-2xl font-bold text-ink-800">اكتمل الاختبار!</h3>
        <p className="mt-2 text-sm text-ink-500">
          أجبت بشكل صحيح على{" "}
          <span className="font-bold text-clay-600">{score}</span> من{" "}
          <span className="font-bold">{questions.length}</span> أسئلة
        </p>
        <div className="mx-auto mt-5 max-w-xs">
          <div className="flex items-center justify-between text-xs text-ink-400">
            <span>النتيجة</span>
            <span className="font-bold text-ink-700">{pct}%</span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-cream-300">
            <div
              className="h-full rounded-full bg-clay-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-400">
          {pct >= 80
            ? "ممتاز! أنت تتقن هذا الدرس 🎉"
            : pct >= 50
            ? "جيد جداً — أعِد المراجعة وحاول مجدداً"
            : "لا بأس، التكرار يصنع الإتقان — أعد المحاولة!"}
        </p>
        <button
          onClick={() => {
            setCurrent(0);
            setSelected(null);
            setAnswered(false);
            setScore(0);
            setFinished(false);
          }}
          className="btn-secondary mt-6"
        >
          🔄 إعادة الاختبار
        </button>
      </div>
    );
  }

  const optionState = (i: number) => {
    if (!answered) return "border-cream-300 bg-white hover:border-clay-300 hover:bg-cream-50";
    if (i === q.answerIndex) return "border-sage-500 bg-sage-50 text-sage-800";
    if (i === selected) return "border-clay-400 bg-clay-50 text-clay-800";
    return "border-cream-300 bg-white opacity-50";
  };

  return (
    <div className="card p-6 sm:p-8">
      {/* Progress dots */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-600">
          السؤال {current + 1} من {questions.length}
        </span>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i < current || (i === current && answered)
                  ? "bg-clay-500"
                  : i === current
                  ? "bg-clay-300"
                  : "bg-cream-400"
              }`}
            />
          ))}
        </div>
      </div>

      <h3 className="prose-ar mt-5 font-serif text-xl font-bold leading-relaxed text-ink-800 sm:text-2xl">
        {q.question}
      </h3>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            disabled={answered}
            className={`rounded-xl border-2 px-4 py-3.5 text-start text-sm font-semibold transition-all duration-150 ${optionState(i)} ${
              answered && i === selected ? "animate-pop" : ""
            }`}
          >
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-current/10 text-xs">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>

      {answered && (
        <div className="animate-fade-up mt-5">
          {q.explanation && (
            <p className="rounded-xl bg-gold-50 px-4 py-3 text-sm leading-relaxed text-gold-800">
              💡 {q.explanation}
            </p>
          )}
          <button onClick={next} className="btn-primary mt-4 w-full sm:w-auto">
            {isLast ? "إنهاء الاختبار" : "السؤال التالي ←"}
          </button>
        </div>
      )}
    </div>
  );
}