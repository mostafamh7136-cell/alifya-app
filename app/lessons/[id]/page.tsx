"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import PracticeSession from "@/components/PracticeSession";
import AudioButton from "@/components/AudioButton";
import Quiz from "@/components/Quiz";
import { getCurriculumLesson, curriculumLessons, levels } from "@/lib/curriculum";
import { loadProgress, recordLessonResult } from "@/lib/progress";

export default function LessonPage() {
  const { isArabic } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const lesson = getCurriculumLesson(id);
  const [open, setOpen] = useState(false);
  const [s, setS] = useState(loadProgress());
  useEffect(() => {
    const f = () => setS(loadProgress());
    window.addEventListener("storage", f);
    window.addEventListener("alifya:progress-updated", f);
    return () => { window.removeEventListener("storage", f); window.removeEventListener("alifya:progress-updated", f); };
  }, []);

  if (!lesson) return <><TopBar onMenuClick={() => setOpen(true)} /><main className="main"><div className="surface-card"><h2>{isArabic ? "الدرس غير موجود" : "Lesson not found"}</h2><Link href="/lessons" className="btn primary">{isArabic ? "العودة للمنهج" : "Back to curriculum"}</Link></div></main></>;

  const idx = curriculumLessons.findIndex((x) => x.id === lesson.id);
  const prev = curriculumLessons[idx - 1];
  const next = curriculumLessons[idx + 1];
  const level = levels.find((l) => l.id === lesson.cefr)!;

  return <div>
    <TopBar onMenuClick={() => setOpen(true)} />
    <div className="layout"><Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <main className="main">
        <Link href="/lessons" className="muted" style={{ fontSize: 12 }}>← {isArabic ? "العودة للمنهج" : "Back to curriculum"}</Link>
        <section className="surface-card lesson-hero" style={{ marginTop: 12 }}>
          <div className="lesson-header">
            <div className="lesson-icon" style={{ width: 76, height: 76, fontSize: 34 }}>{lesson.icon}</div>
            <div>
              <div className="lesson-kicker"><span className="cefr-badge">{lesson.cefr}</span><span>{isArabic ? level.arabic : level.name}</span><span>·</span><span>{lesson.skill}</span></div>
              <h1 className="lesson-title">{isArabic ? lesson.arabicTitle : lesson.title}</h1>
              <p className="muted">{isArabic ? lesson.title : lesson.arabicTitle}</p>
              <div className="lesson-meta">
                <span className="pill">⏱ {lesson.durationEn} min</span>
                <span className="pill">{lesson.vocabulary.length} {isArabic ? "مفردة" : "words"}</span>
                <span className="pill">{lesson.phrases.length} {isArabic ? "عبارات" : "phrases"}</span>
                <span className="pill">{lesson.quiz.length} {isArabic ? "أسئلة" : "checks"}</span>
                {s.lessons[lesson.id]?.completed && <span className="pill">✓ {isArabic ? "أفضل نتيجة" : "Best"} {s.lessons[lesson.id].bestScore}%</span>}
              </div>
              <p className="muted lesson-description">{lesson.description}</p>
            </div>
          </div>
          <div className="lesson-goals"><span>{isArabic ? "المهارة" : "Skill"} <b>{lesson.skill}</b></span><span>{isArabic ? "الوحدة" : "Unit"} <b>{lesson.unit}</b></span></div>
          <AudioButton text={lesson.vocabulary[0]?.arabic || lesson.arabicTitle} lang="ar" label={isArabic ? "تسجيل بشري" : "Play pronunciation"} />
          <p className="muted" style={{ fontSize: 10, marginTop: 8 }}>{isArabic ? "التسجيل البشري يُستخدم عند توفره، وإلا يعمل النطق الصوتي على الجهاز." : "Verified human audio is used when available; otherwise the browser provides an Arabic computer pronunciation."}</p>
        </section>

        <PracticeSession lesson={lesson} onChange={() => setS(loadProgress())} />

        <section className="surface-card content-section">
          <div className="section-head compact-head"><div><span className="eyebrow">{isArabic ? "اللغة في السياق" : "USE IT"}</span><h2>{isArabic ? "عبارات الدرس" : "Phrase bank"}</h2><span className="muted">{isArabic ? "جمل جاهزة للاستعمال خارج البطاقات." : "Ready-to-use phrases beyond the flashcards."}</span></div></div>
          <div className="phrase-grid">
            {lesson.phrases.map((p, i) => <article className="phrase-card" key={`${p.arabic}-${i}`}><div className="phrase-main"><div className="phrase-arabic">{p.arabic}</div><div className="translit">{p.translit}</div><p>{p.meaning}</p>{p.note && <small>{p.note}</small>}</div><AudioButton text={p.arabic} lang="ar" compact label={isArabic ? "استمع" : "Listen"} /></article>)}
          </div>
        </section>

        <section className="surface-card content-section">
          <div className="section-head compact-head"><div><span className="eyebrow">{isArabic ? "اختبار قصير" : "CHECKPOINT"}</span><h2>{isArabic ? "اختبر فهمك" : "Check your understanding"}</h2><span className="muted">{isArabic ? "أكمل الاختبار لإثبات إتقانك للدرس." : "Finish the checkpoint to measure what you learned."}</span></div></div>
          <Quiz questions={lesson.quiz} onComplete={(score, total) => { recordLessonResult(lesson.id, score, total); setS(loadProgress()); }} />
        </section>

        <div className="lesson-nav"><div>{prev ? <Link href={`/lessons/${prev.id}`} className="surface-card nav-card">← {isArabic ? "السابق" : "Previous"}<br/><b>{isArabic ? prev.arabicTitle : prev.title}</b></Link> : <span />}</div><div>{next ? <Link href={`/lessons/${next.id}`} className="surface-card nav-card next">{isArabic ? "التالي" : "Next"} →<br/><b>{isArabic ? next.arabicTitle : next.title}</b></Link> : <span />}</div></div>
      </main>
    </div>
  </div>;
}
