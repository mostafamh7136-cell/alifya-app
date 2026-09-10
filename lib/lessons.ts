// Alifya — Arabic lesson content
// Core lesson library. The universal curriculum in lib/curriculum.ts layers CEFR-style
// progression, units, skills, and additional lessons over this reusable content set.

export type VocabItem = {
  arabic: string;
  translit: string;
  meaning: string;
  example?: string;
  exampleTranslit?: string;
  exampleMeaning?: string;
};

export type PhraseItem = {
  arabic: string;
  translit: string;
  meaning: string;
  note?: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
};

export type Lesson = {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  category: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  levelEn: "beginner" | "intermediate" | "advanced";
  icon: string;
  accent: "clay" | "sage" | "gold";
  duration: string;
  durationEn: number;
  vocabulary: VocabItem[];
  phrases: PhraseItem[];
  quiz: QuizQuestion[];
  tip?: string;
};

export const lessons: Lesson[] = [
