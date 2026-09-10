"use client";

import { useEffect, useRef, useState } from "react";

type Props = { text: string; lang?: "ar" | "en"; label?: string; compact?: boolean };
type AudioSource = "human-ar" | "unavailable" | "";

const normalize = (text: string) => text.trim().normalize("NFKC").replace(/[\u064B-\u065F\u0670-\u06ED]/g, "").replace(/[.,!?؛،؟!\"'“”‘’]/g, "").replace(/\s+/g, " ");

// Curated recordings only. Do not fall back to browser speech, dialect sources,
// runtime Wiktionary discovery, or client-side download/analysis.
const HUMAN_ARABIC: Record<string, string> = {
  [normalize("مرحباً")]: "https://upload.wikimedia.org/wikipedia/commons/1/1f/LL-Q13955_%28ara%29-Zinou2go-%D9%85%D8%B1%D8%AD%D8%A8%D8%A7.wav",
  [normalize("السلام عليكم")]: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Ar-%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85_%D8%B9%D9%84%D9%8A%D9%83%D9%85.oga",
  [normalize("وعليكم السلام")]: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Ar-%D9%88%D8%B9%D9%84%D9%8A%D9%83%D9%85_%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85.oga",
  [normalize("صباح الخير")]: "https://upload.wikimedia.org/wikipedia/commons/e/e2/%E1%B9%A2ab%C4%81%E1%B8%A5_al-kh%C3%A1yr2.ogg",
  [normalize("مساء الخير")]: "https://upload.wikimedia.org/wikipedia/commons/9/9e/LL-Q13955_%28ara%29-Zinou2go-%D9%85%D8%B3%D8%A7%D8%A1_%D8%A7%D9%84%D8%AE%D9%8A%D8%B1.wav",
  [normalize("ما اسمك")]: "https://upload.wikimedia.org/wikipedia/commons/c/ca/%D9%85%D8%A7_%D8%A7%D8%B3%D9%85%D9%83.ogg",
  [normalize("تشرفنا")]: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Ar-%D8%AA%D8%B4%D8%B1%D9%81%D9%86%D8%A7.oga",
  [normalize("إلى اللقاء")]: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Ar-%D8%A5%D9%84%D9%89_%D8%A7%D9%84%D9%84%D9%82%D8%A7%D8%A1.oga",
  [normalize("أهلاً وسهلاً!")]: "https://upload.wikimedia.org/wikipedia/commons/1/10/LL-Q13955_%28ara%29-Zinou2go-%D8%A3%D9%87%D9%84%D8%A7_%D9%88%D8%B3%D9%87%D9%84%D8%A7.wav",
  [normalize("أهلا وسهلا")]: "https://upload.wikimedia.org/wikipedia/commons/1/10/LL-Q13955_%28ara%29-Zinou2go-%D8%A3%D9%87%D9%84%D8%A7_%D9%88%D8%B3%D9%87%D9%84%D8%A7.wav",
  [normalize("صفر")]: "https://upload.wikimedia.org/wikipedia/commons/d/de/Q204-ar.oga",
  [normalize("نعم")]: "https://upload.wikimedia.org/wikipedia/commons/8/8f/%D9%86%D8%B9%D9%85-Arabic-Yes.ogg",
  [normalize("لا")]: "https://upload.wikimedia.org/wikipedia/commons/8/8f/%D9%84%D8%A7-Arabic_No.ogg",
  [normalize("شكراً")]: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Ar-%D8%B4%D9%83%D8%B1%D9%8B%D8%A7.oga",
  [normalize("أين")]: "https://upload.wikimedia.org/wikipedia/commons/6/6f/LL-Q13955_%28ara%29-Zinou2go-%D8%A3%D9%8A%D9%86.wav",
};

export default function AudioButton({ text, lang = "ar", label, compact = false }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef(0);
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState<AudioSource>("");
  const [error, setError] = useState(false);

  useEffect(() => () => {
    audioRef.current?.pause();
    audioRef.current?.removeAttribute("src");
  }, []);

  const speak = async () => {
    if (lang !== "ar") return;
    const id = ++requestRef.current;
    const audio = audioRef.current;
    if (!audio) return;
    const src = HUMAN_ARABIC[normalize(text)];

    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setBusy(true);
    setError(false);
    setSource("");

    if (!src) {
      setSource("unavailable");
      setBusy(false);
      return;
    }

    try {
      audio.src = src;
      audio.preload = "auto";
      audio.load();
      await new Promise<void>((resolve, reject) => {
        const onReady = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); reject(new Error("Audio failed to load")); };
        const cleanup = () => {
          audio.removeEventListener("canplay", onReady);
          audio.removeEventListener("error", onError);
        };
        audio.addEventListener("canplay", onReady, { once: true });
        audio.addEventListener("error", onError, { once: true });
        if (audio.readyState >= 3) onReady();
      });

      if (!Number.isFinite(audio.duration) || audio.duration < 0.25) throw new Error("Invalid recording");
      await audio.play();
      if (id === requestRef.current) setSource("human-ar");
    } catch {
      if (id === requestRef.current) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        setError(true);
        setSource("unavailable");
      }
    } finally {
      if (id === requestRef.current) setBusy(false);
    }
  };

  const title = source === "human-ar" ? "Clear human Arabic recording" : source === "unavailable" ? "No verified clear human Arabic recording available" : "Human Arabic recording";
  const display = label || "Play pronunciation";

  return <>
    <audio ref={audioRef} preload="none" onEnded={() => setBusy(false)} onError={() => { setBusy(false); setError(true); setSource("unavailable"); audioRef.current?.removeAttribute("src"); }} data-audio-language={lang} data-audio-text={text} data-audio-source={source} data-audio-human={source === "human-ar" ? "true" : "false"} aria-hidden="true" />
    <button type="button" onClick={speak} className={`audio-btn ${compact ? "audio-btn-compact" : ""}`} aria-label={`${display}: ${text}`} aria-pressed={busy} title={title} disabled={busy}>
      <span aria-hidden="true">{busy ? "◉" : "▶"}</span>
      {!compact && <span>{busy ? "Playing human Arabic" : error ? "Recording unavailable" : source === "unavailable" ? "MSA recording unavailable" : display}</span>}
    </button>
  </>;
}
