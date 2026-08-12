// Alifya — client-side progress tracking (localStorage)

export type QuizResult = {
  lessonId: string;
  score: number;
  total: number;
  date: string; // ISO
};

export type LessonProgress = {
  completed: boolean;
  completedAt?: string;
  bestScore?: number; // percentage
  attempts: number;
  lastQuiz?: QuizResult;
};

export type ProgressState = {
  lessons: Record<string, LessonProgress>;
  xp: number;
  streak: number;
  lastActiveDay?: string; // YYYY-MM-DD
};

const STORAGE_KEY = "alifya-progress-v1";

export const defaultProgress: ProgressState = {
  lessons: {},
  xp: 0,
  streak: 0,
};

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      lessons: parsed.lessons ?? {},
      xp: parsed.xp ?? 0,
      streak: parsed.streak ?? 0,
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
  } catch {
    // storage may be unavailable (private mode) — fail silently
  }
}

export function recordQuizResult(
  lessonId: string,
  score: number,
  total: number
): ProgressState {
  const state = loadProgress();
  const pct = Math.round((score / total) * 100);
  const prev = state.lessons[lessonId] ?? {
    completed: false,
    attempts: 0,
  };

  const updated: ProgressState = {
    ...state,
    lessons: {
      ...state.lessons,
      [lessonId]: {
        completed: true,
        completedAt: prev.completedAt ?? new Date().toISOString(),
        bestScore: Math.max(prev.bestScore ?? 0, pct),
        attempts: prev.attempts + 1,
        lastQuiz: {
          lessonId,
          score,
          total,
          date: new Date().toISOString(),
        },
      },
    },
  };

  // XP: base 10 per lesson completion + score bonus
  const isFirstCompletion = !prev.completed;
  const xpGain = (isFirstCompletion ? 10 : 0) + Math.round((pct / 100) * 20);
  updated.xp = state.xp + xpGain;

  // Streak tracking
  const today = todayKey();
  if (state.lastActiveDay !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${String(
      yesterday.getMonth() + 1
    ).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    updated.streak = state.lastActiveDay === yKey ? state.streak + 1 : 1;
    updated.lastActiveDay = today;
  }

  saveProgress(updated);
  return updated;
}

export function getLessonProgress(
  state: ProgressState,
  lessonId: string
): LessonProgress | undefined {
  return state.lessons[lessonId];
}

export function stats(state: ProgressState, totalLessons: number) {
  const completed = Object.values(state.lessons).filter((l) => l.completed);
  const avgScore =
    completed.length > 0
      ? Math.round(
          completed.reduce((s, l) => s + (l.bestScore ?? 0), 0) /
            completed.length
        )
      : 0;
  return {
    completed: completed.length,
    total: totalLessons,
    pct: Math.round((completed.length / totalLessons) * 100),
    avgScore,
    xp: state.xp,
    streak: state.streak,
  };
}
