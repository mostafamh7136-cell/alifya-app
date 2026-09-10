"use client";

import { useEffect, useRef, useState } from "react";

type Props = { text: string; lang?: "ar" | "en"; label?: string; compact?: boolean };
type AudioSource = "human-ar" | "computer-ar" | "unavailable" | "";

const normalize = (text: string) => text.trim().normalize("NFKC").replace(/[\u064B-\u065F\u0670-\u06ED]/g, "").replace(/[.,!?؛،؟!\"'“”‘’]/g, "").replace(/\s+/g, " ");

// Curated recordings only. They are served through our same-origin proxy to avoid CDN/CORS/rate-limit failures.
const HUMAN_ARABIC: Record<string, string> = {
  [normalize("مرحباً")]: "https://upload.wikimedia.org/wikipedia/commons/1/1f/LL-Q13955_%28ara%29-Zinou2go-%D9%85%D8%B1%D8%AD%D8%A8%D8%A7.wav",
  [normalize("السلام عليكم")]: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Ar-%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85_%D8%B9%D9%84%D9%8A%D9%83%D9%85.oga",
  [normalize("وعليكم السلام")]: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Ar-%D9%88%D8%B9%D9%84%D9%8A%D9%83%D9%85_%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85.oga",
  [normalize("صباح الخير")]: "https://upload.wikimedia.org/wikipedia/commons/e/e2/%E1%B9%A2ab%C4%81%E1%B8%A5_al-kh%C3%A1yr2.ogg",
  [normalize("مساء الخير")]: "https://upload.wikimedia.org/wikipedia/commons/9/9e/LL-Q13955_%28ara%29-Zinou2go-%D9%85%D8%B3%D8%A7%D8%A1_%D8%A7%D9%84%D8%AE%D9%8A%D8%B1.wav",
  [normalize("ما اسمك")]: "https://upload.wikimedia.org/wikipedia/commons/c/ca/%D9%85%D8%A7_%D8%A7%D8%B3%D9%85%D9%83.ogg",
  [normalize("تشرفنا")]: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Ar-%D8%AA%D8%B4%D8%B1%D9%81%D9%86%D8%A7.oga",
  [normalize("إلى اللقاء")]: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Ar-%D8%A5%D9%84%D9%89_%D8%A7%D9%84%D9%84%D9%82%D8%A7%D8%A1.oga",
  [normalize("أهلاً وسهلاً!")]: "https://upload.wikimedia.org/wikipedia/commons/1/10/LL-Q13955_%28ara%29-Zinou2go-%D8%A3%D9%87%D9%84%D8%A7-%D9%88%D8%B3%D9%87%D9%84%D8%A7.wav",
  [normalize("أهلا وسهلا")]: "https://upload.wikimedia.org/wikipedia/commons/1/10/LL-Q13955_%28ara%29-Zinou2go-%D8%A3%D9%87%D9%84%D8%A7-%D9%88%D8%B3%D9%87%D9%84%D8%A7.wav",
  [normalize("صفر")]: "https://upload.wikimedia.org/wikipedia/commons/d/de/Q204-ar.oga",
  [normalize("نعم")]: "https://upload.wikimedia.org/wikipedia/commons/c/c3/%D9%86%D8%B9%D9%85-Arabic-Yes.ogg",
  [normalize("لا")]: "https://upload.wikimedia.org/wikipedia/commons/9/9c/%D9%84%D8%A7-Arabic_No.ogg",
  [normalize("شكراً")]: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Ar-%D8%B4%D9%83%D8%B1%D9%8B%D8%A7.oga",
  [normalize("أين")]: "https://upload.wikimedia.org/wikipedia/commons/1/1b/LL-Q13955_%28ara%29-Zinou2go-%D8%A3%D9%8A%D9%86.wav",
};

function getHumanSource(text: string, lang: "ar" | "en") {
  if (lang !== "ar") return "";
  return HUMAN_ARABIC[normalize(text)] || "";
}

function speakArabic(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.84;
  utterance.pitch = 1;
  const voices = synth.getVoices();
  const arVoice = voices.find((v) => v.lang.toLowerCase().startsWith("ar"));
  if (arVoice) utterance.voice = arVoice;
  synth.speak(utterance);
  return true;
}

export default function AudioButton({ text, lang = "ar", label = "Play", compact = false }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState<AudioSource>("");

  useEffect(() => {
    const handler = () => {};
    window.speechSynthesis?.addEventListener?.("voiceschanged", handler);
    return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", handler);
  }, []);

  const human = getHumanSource(text, lang);

  const play = async () => {
    if (busy) return;
    setBusy(true);
    const audio = audioRef.current;
    try {
      if (audio && human) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        audio.src = `/api/audio?src=${encodeURIComponent(human)}`;
        await new Promise<void>((resolve, reject) => {
          const onReady = () => { cleanup(); resolve(); };
          const onError = () => { cleanup(); reject(new Error("audio-load")); };
          const cleanup = () => {
            audio.removeEventListener("canplay", onReady);
            audio.removeEventListener("error", onError);
          };
          audio.addEventListener("canplay", onReady, { once: true });
          audio.addEventListener("error", onError, { once: true });
          audio.load();
        });
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) throw new Error("invalid-duration");
        await audio.play();
        setSource("human-ar");
        return;
      }
      throw new Error("no-human-source");
    } catch {
      const spoke = lang === "ar" ? speakArabic(text) : false;
      setSource(spoke ? "computer-ar" : "unavailable");
      if (audio) { audio.pause(); audio.removeAttribute("src"); audio.load(); }
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    const audio = audioRef.current;
    audio?.pause();
    if (audio) { audio.currentTime = 0; audio.removeAttribute("src"); audio.load(); }
    if (source === "computer-ar") window.speechSynthesis?.cancel();
    setSource("");
  };

  return (
    <>
      <audio ref={audioRef} preload="none" onEnded={() => setBusy(false)} aria-hidden="true" />
      <button
        type="button"
        className={`audio-btn${compact ? " audio-btn-compact" : ""}`}
        onClick={source ? clear : play}
        disabled={busy}
        title={source === "human-ar" ? "Clear human Arabic recording" : source === "computer-ar" ? "Stop computer Arabic pronunciation" : "Play Arabic pronunciation"}
        data-audio-language={lang}
        data-audio-text={text}
        data-audio-source={source}
        data-audio-human={source === "human-ar" ? "true" : "false"}
      >
        <span aria-hidden="true">{busy ? "…" : source ? "■" : "▶"}</span>
        {busy ? "Loading audio…" : source === "human-ar" ? label : source === "computer-ar" ? "Computer pronunciation" : label}
      </button>
    </>
  );
}
