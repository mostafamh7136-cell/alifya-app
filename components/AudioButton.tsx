"use client";

import { useEffect, useRef, useState } from "react";

type Props = { text: string; lang?: "ar" | "en"; label?: string; compact?: boolean };
type AudioSource = "human-msa" | "unavailable" | "";

// Human recordings for formal/standard Arabic. Dialect-labelled recordings are excluded.
const VERIFIED_MSA_AUDIO: Record<string, string> = {
  "مرحبا": "https://upload.wikimedia.org/wikipedia/commons/1/1f/LL-Q13955_%28ara%29-Zinou2go-%D9%85%D8%B1%D8%AD%D8%A8%D8%A7.wav",
  "السلام عليكم": "https://upload.wikimedia.org/wikipedia/commons/0/07/%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85_%D8%B9%D9%84%D9%8A%D9%83%D9%85.ogg",
  "وعليكم السلام": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Ar-%D9%88%D8%B9%D9%84%D9%8A%D9%83%D9%85_%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85.oga",
  "صباح الخير": "https://upload.wikimedia.org/wikipedia/commons/e/e2/%E1%B9%A2ab%C4%81%E1%B8%A5_al-kh%C3%A1yr2.ogg",
  "مساء الخير": "https://upload.wikimedia.org/wikipedia/commons/9/9e/LL-Q13955_%28ara%29-Zinou2go-%D9%85%D8%B3%D8%A7%D8%A1_%D8%A7%D9%84%D8%AE%D9%8A%D8%B1.wav",
  "ما اسمك": "https://upload.wikimedia.org/wikipedia/commons/c/ca/%D9%85%D8%A7_%D8%A7%D8%B3%D9%85%D9%83.ogg",
  "تشرفنا": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Ar-%D8%AA%D8%B4%D8%B1%D9%81%D9%86%D8%A7.oga",
  "إلى اللقاء": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Ar-%D8%A5%D9%84%D9%89_%D8%A7%D9%84%D9%84%D9%82%D8%A7%D8%A1.oga",
  "أهلا وسهلا": "https://upload.wikimedia.org/wikipedia/commons/1/10/LL-Q13955_%28ara%29-Zinou2go-%D8%A3%D9%87%D9%84%D8%A7_%D9%88%D8%B3%D9%87%D9%84%D8%A7.wav",
};

const normalize = (text: string) => text.trim().normalize("NFKC").replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "").replace(/[.,!?؟،؛:…]/g, "");
const findVerifiedMsaAudio = async (text: string): Promise<string | null> => VERIFIED_MSA_AUDIO[normalize(text)] ?? null;

export default function AudioButton({ text, lang = "ar", label, compact = false }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef(0);
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState<AudioSource>("");
  const [error, setError] = useState(false);

  useEffect(() => () => audioRef.current?.pause(), []);

  const speak = async () => {
    if (lang !== "ar") return;
    const requestId = ++requestRef.current;
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setBusy(true);
    setError(false);
    setSource("");
    try {
      const src = await findVerifiedMsaAudio(text);
      if (requestId !== requestRef.current) return;
      if (!src) {
        setSource("unavailable");
        setBusy(false);
        return;
      }
      setSource("human-msa");
      audio.src = src;
      audio.load();
      await audio.play();
      if (requestId !== requestRef.current) audio.pause();
    } catch {
      if (requestId !== requestRef.current) return;
      setError(true);
      setSource("unavailable");
      setBusy(false);
    }
  };

  const displayLabel = label || "Play pronunciation";
  const title = source === "human-msa" ? "Verified human MSA recording" : source === "unavailable" ? "No verified human MSA recording available yet" : "Human MSA recording";
  return (
    <>
      <audio key={`${lang}:${normalize(text)}`} ref={audioRef} preload="none" onEnded={() => setBusy(false)} onError={() => { setBusy(false); setError(true); setSource("unavailable"); }} data-audio-language={lang} data-audio-text={text} data-audio-source={source} data-audio-human={source === "human-msa" ? "true" : "false"} aria-hidden="true" />
      <button type="button" onClick={speak} className={`audio-btn ${compact ? "audio-btn-compact" : ""}`} aria-label={`${displayLabel}: ${text}`} aria-pressed={busy} title={title}>
        <span aria-hidden>{busy ? "■" : "🔊"}</span>
        {!compact && <span>{busy ? "Playing human MSA recording" : error ? "Try again" : source === "unavailable" ? "MSA recording unavailable" : displayLabel}</span>}
      </button>
    </>
  );
}
