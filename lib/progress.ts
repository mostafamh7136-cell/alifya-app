// Alifya — client-side progress tracking (localStorage)

export type QuizResult = {
  lessonId: string;
  score: number;
  total: number;
  date: string;
};

export type LessonProgress = {
  completed: boolean;
  completedAt?: string;
  bestScore?: number;
  attempts: number;
  lastQuiz?: QuizResult;
};

export type ProgressState = {
  lessons: Record<string, LessonProgress>;
  xp: number;
  streak: number;
  lastActiveDay?: string;
};

const STORAGE_KEY = "alifya-progress-v1";
const defaultProgress: ProgressState = { lessons: {}, xp: 0, streak: 0 };

type ProgressUpdatedEvent = Event & { detail?: ProgressState };

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function emitProgressUpdated(state: ProgressState) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ProgressState>("alifya:progress-updated", { detail: state }));
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      lessons: parsed.lessons ?? {},
      xp: Number.isFinite(parsed.xp) ? Number(parsed.xp) : 0,
      streak: Number.isFinite(parsed.streak) ? Number(parsed.streak) : 0,
      lastActiveDay: parsed.lastActiveDay,
    };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    emitProgressUpdated(state);
  } catch {
    // Storage may be unavailable; the app remains usable without persistence.
  }
}

export function recordQuizResult(lessonId: string, score: number, total: number): ProgressState {
  const state = loadProgress();
  const safeTotal = Math.max(0, total);
  const safeScore = Math.min(Math.max(0, score), safeTotal);
  const pct = safeTotal > 0 ? Math.round((safeScore / safeTotal) * 100) : 0;
  const prev = state.lessons[lessonId] ?? { completed: false, attempts: 0 };
  const now = new Date().toISOString();

  const updated: ProgressState = {
    ...state,
    lessons: {
      ...state.lessons,
      [lessonId]: {
        completed: true,
        completedAt: prev.completedAt ?? now,
        bestScore: Math.max(prev.bestScore ?? 0, pct),
        attempts: prev.attempts + 1,
        lastQuiz: { lessonId, score: safeScore, total: safeTotal, date: now },
      },
    },
  };

  const isFirstCompletion = !prev.completed;
  updated.xp = state.xp + (isFirstCompletion ? 10 : 0) + Math.round((pct / 100) * 20);

  const today = todayKey();
  if (state.lastActiveDay !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    updated.streak = state.lastActiveDay === yKey ? state.streak + 1 : 1;
    updated.lastActiveDay = today;
  }

  saveProgress(updated);
  return updated;
}

export function getLessonProgress(state: ProgressState, lessonId: string): LessonProgress | undefined {
  return state.lessons[lessonId];
}

export function stats(state: ProgressState, totalLessons: number) {
  const completed = Object.values(state.lessons).filter((l) => l.completed);
  const avgScore =
    completed.length > 0
      ? Math.round(completed.reduce((sum, lesson) => sum + (lesson.bestScore ?? 0), 0) / completed.length)
      : 0;
  const total = Math.max(0, totalLessons);
  return {
    completed: completed.length,
    total,
    pct: total > 0 ? Math.min(100, Math.round((completed.length / total) * 100)) : 0,
    avgScore,
    xp: state.xp,
    streak: state.streak,
  };
}

export type { ProgressUpdatedEvent };
