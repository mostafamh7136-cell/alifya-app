"use client";

import { useEffect, useRef, useState } from "react";

type Props = { text: string; lang?: "ar" | "en"; label?: string; compact?: boolean };
type AudioSource = "human-msa" | "unavailable" | "";

// Human recordings independently checked as Standard Arabic/MSA.
const VERIFIED_MSA_AUDIO: Record<string, string> = {
  "السلام عليكم": "https://upload.wikimedia.org/wikipedia/commons/0/07/%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85_%D8%B9%D9%84%D9%8A%D9%83%D9%85.ogg",
  "وعليكم السلام": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Ar-%D9%88%D8%B9%D9%84%D9%8A%D9%83%D9%85_%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85.oga",
  "صباح الخير": "https://upload.wikimedia.org/wikipedia/commons/e/e2/%E1%B9%A2ab%C4%81%E1%B8%A5_al-kh%C3%A1yr2.ogg",
  "ما اسمك؟": "https://upload.wikimedia.org/wikipedia/commons/c/ca/%D9%85%D8%A7_%D8%A7%D8%B3%D9%85%D9%83.ogg",
  "لذيذ": "https://upload.wikimedia.org/wikipedia/commons/1/15/Ar-%D9%84%D8%B0%D9%8A%D8%B0.ogg",
};

const DIALECT_CODES = new Set(["ajp", "ary", "arz", "apc", "afb", "acm", "acq", "aeb", "aao", "abh", "ars", "avl", "shu"]);

const normalize = (text: string) =>
  text.trim().normalize("NFKC").replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "").replace(/[.,!?؟،؛:]/g, "");

const cacheKey = (text: string) => `alifya:msa-human-audio:${normalize(text)}`;

function isClearlyMsaWikimediaUrl(raw: string) {
  const decoded = decodeURIComponent(raw);
  if (!/upload\.wikimedia\.org/i.test(decoded)) return false;
  const dialect = decoded.match(/\(([a-z]{2,3})\)(?:-|_)/i)?.[1]?.toLowerCase();
  if (dialect && DIALECT_CODES.has(dialect)) return false;
  return /(?:^|[/_-])Ar-[^/]+\.(?:ogg|oga|wav|mp3)(?:\?|$)/i.test(decoded) || /_\(ar\)-[^/]+\.(?:ogg|oga|wav|mp3)(?:\?|$)/i.test(decoded);
}

async function findVerifiedMsaAudio(text: string): Promise<string | null> {
  const key = normalize(text);
  if (VERIFIED_MSA_AUDIO[key]) return VERIFIED_MSA_AUDIO[key];
  const cached = window.sessionStorage.getItem(cacheKey(text));
  if (cached) return cached === "none" ? null : cached;

  try {
    const api = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(text)}&prop=text&format=json&origin=*`;
    const res = await fetch(api, { cache: "no-store" });
    if (!res.ok) throw new Error(`Wiktionary HTTP ${res.status}`);
    const data = await res.json();
    const html = String(data?.parse?.text?.["*"] || "");
    if (!html) return null;
    const doc = new DOMParser().parseFromString(html, "text/html");
    const rawSources = Array.from(doc.querySelectorAll("audio source, a[href]"))
      .map((el) => el.getAttribute("src") || el.getAttribute("href") || "")
      .filter((src) => /\.(ogg|oga|wav|mp3)(?:\?|$)/i.test(src));

    for (const raw of rawSources) {
      const url = raw.startsWith("//") ? `https:${raw}` : raw.startsWith("http") ? raw : new URL(raw, "https://en.wiktionary.org").href;
      if (isClearlyMsaWikimediaUrl(url)) {
        window.sessionStorage.setItem(cacheKey(text), url);
        return url;
      }
    }
  } catch {
    // Failed lookup = unavailable. Never substitute synthetic or dialect speech.
  }

  window.sessionStorage.setItem(cacheKey(text), "none");
  return null;
}

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
      <audio ref={audioRef} preload="none" onEnded={() => setBusy(false)} onError={() => { setBusy(false); setError(true); setSource("unavailable"); }} data-audio-language={lang} data-audio-text={text} data-audio-source={source} data-audio-human={source === "human-msa" ? "true" : "false"} aria-hidden="true" />
      <button type="button" onClick={speak} className={`audio-btn ${compact ? "audio-btn-compact" : ""}`} aria-label={`${displayLabel}: ${text}`} aria-pressed={busy} title={title}>
        <span aria-hidden>{busy ? "■" : "🔊"}</span>
        {!compact && <span>{busy ? "Playing human MSA recording" : error ? "Try again" : source === "unavailable" ? "MSA recording unavailable" : displayLabel}</span>}
      </button>
    </>
  );
}
