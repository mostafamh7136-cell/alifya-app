"use client";

import { useEffect, useRef, useState } from "react";

type Props = { text: string; lang?: "ar" | "en"; label?: string; compact?: boolean };
type AudioSource = "human-ar" | "unavailable" | "";
type QualityResult = { ok: boolean; duration: number; reason?: string };

const normalize = (text: string) => text.trim().normalize("NFKC").replace(/[\u064B-\u065F\u0670-\u06ED]/g, "").replace(/[.,!?؛،؟!\"'“”‘’]/g, "").replace(/\s+/g, " ");
const DIALECT_WORDS = ["moroccan", "morocco", "darija", "egyptian", "egypt", "levantine", "levant", "jordanian", "jordan", "syrian", "syria", "lebanese", "lebanon", "palestinian", "palestine", "iraqi", "iraq", "gulf arabic", "hijazi", "hejazi", "yemeni", "yemen", "sudanese", "sudan", "libyan", "libya", "tunisian", "tunisia", "algerian", "algeria", "mauritanian", "mauritania"];
const VERIFIED_HUMAN_AR: Record<string, string> = {
  [normalize("السلام عليكم")]: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Ar-%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85_%D8%B9%D9%84%D9%8A%D9%83%D9%85.oga",
  [normalize("وعليكم السلام")]: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Ar-%D9%88%D8%B9%D9%84%D9%8A%D9%83%D9%85_%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85.oga",
  [normalize("صباح الخير")]: "https://upload.wikimedia.org/wikipedia/commons/e/e2/%E1%B9%A2ab%C4%81%E1%B8%A5_al-kh%C3%A1yr2.ogg",
};

const cacheKey = (text: string) => `alifya:msa-audio:${normalize(text)}`;
const qualityKey = (url: string) => `alifya:audio-quality:${url}`;

async function checkAudioQuality(url: string): Promise<QualityResult> {
  try { const cached = sessionStorage.getItem(qualityKey(url)); if (cached) return JSON.parse(cached); } catch {}
  try {
    const res = await fetch(url, { mode: "cors", cache: "force-cache" });
    if (!res.ok) return { ok: false, duration: 0, reason: `HTTP ${res.status}` };
    const bytes = await res.arrayBuffer();
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return { ok: false, duration: 0, reason: "Audio analysis unavailable" };
    const ctx = new Ctx();
    const buffer = await ctx.decodeAudioData(bytes.slice(0));
    await ctx.close();
    const duration = buffer.duration;
    if (!Number.isFinite(duration) || duration < 0.25 || duration > 12) return { ok: false, duration, reason: "Invalid duration" };
    const channel = buffer.getChannelData(0);
    let peak = 0, sum = 0, clipped = 0;
    for (let i = 0; i < channel.length; i++) { const x = channel[i]; const ax = Math.abs(x); peak = Math.max(peak, ax); sum += x; if (ax >= 0.999) clipped++; }
    const dc = Math.abs(sum / channel.length);
    if (peak < 0.015) return { ok: false, duration, reason: "Near-silent recording" };
    if (clipped / channel.length > 0.01) return { ok: false, duration, reason: "Clipping detected" };
    if (dc > 0.1) return { ok: false, duration, reason: "DC/noise corruption" };
    const frame = Math.max(256, Math.floor(buffer.sampleRate * 0.02));
    const rms: number[] = [];
    for (let start = 0; start < channel.length; start += frame) {
      let s = 0; const end = Math.min(channel.length, start + frame);
      for (let i = start; i < end; i++) s += channel[i] * channel[i];
      rms.push(Math.sqrt(s / Math.max(1, end - start)));
    }
    rms.sort((a, b) => a - b);
    const noise = rms[Math.floor(rms.length * 0.1)] || 0;
    const signal = rms[Math.floor(rms.length * 0.9)] || 0;
    const snr = noise > 0 ? 20 * Math.log10(signal / noise) : 99;
    if (snr < 7) return { ok: false, duration, reason: "Excessive background noise" };
    const result = { ok: true, duration };
    try { sessionStorage.setItem(qualityKey(url), JSON.stringify(result)); } catch {}
    return result;
  } catch { return { ok: false, duration: 0, reason: "Corrupt or undecodable audio" }; }
}

async function fileIsGeneralArabic(fileHref: string, sourceUrl?: string): Promise<boolean> {
  try {
    let title = fileHref ? decodeURIComponent(fileHref.split("/wiki/")[1] || "") : "";
    if (!title && sourceUrl) {
      const fileName = decodeURIComponent(new URL(sourceUrl).pathname.split("/").pop() || "");
      if (fileName) title = `File:${fileName}`;
    }
    if (!title) return false;
    const fileName = decodeURIComponent((title.split("File:")[1] || "")).trim();
    const dialect = fileName.match(/\(([^)]+)\)/)?.[1]?.toLowerCase();
    if (dialect && DIALECT_WORDS.some((word) => dialect === word)) return false;
    // Wikimedia's generic Ar-* pronunciation files are categorized as Arabic pronunciation, not a regional dialect.
    if (/^Ar-/i.test(fileName) || /^LL-Q\d+\s*\(ara\)-/i.test(fileName)) return true;
    const api = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=wikitext&format=json&origin=*`;
    const response = await fetch(api, { cache: "force-cache" });
    if (!response.ok) return false;
    const data = await response.json();
    const wikitext = String(data?.parse?.wikitext?.["*"] || "").toLowerCase();
    if (!wikitext.includes("arabic")) return false;
    if (DIALECT_WORDS.some((word) => wikitext.includes(word))) return false;
    return true;
  } catch { return false; }
}

async function findHumanArabicAudio(text: string): Promise<string | null> {
  const key = cacheKey(text);
  try { const cached = sessionStorage.getItem(key); if (cached === "NONE") return null; if (cached) return cached; } catch {}
  const verified = VERIFIED_HUMAN_AR[key === cacheKey(text) ? normalize(text) : text];
  if (verified) {
    const quality = await checkAudioQuality(verified);
    if (quality.ok) { try { sessionStorage.setItem(key, verified); } catch {} return verified; }
  }
  const page = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(text)}&prop=text&format=json&origin=*`;
  try {
    const response = await fetch(page, { cache: "force-cache" });
    if (!response.ok) throw new Error("Wiktionary lookup failed");
    const data = await response.json();
    const html = data?.parse?.text?.["*"] || "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const candidates = Array.from(doc.querySelectorAll("audio source[src], audio[src]"));
    for (const node of candidates) {
      const src0 = (node.getAttribute("src") || "").trim();
      if (!src0) continue;
      const src = src0.startsWith("//") ? `https:${src0}` : src0.startsWith("/") ? `https://en.wiktionary.org${src0}` : src0;
      if (!/^https?:\/\/upload\.wikimedia\.org\//i.test(src)) continue;
      const anchor = node.closest("a[href*='/wiki/File:']") || node.parentElement?.closest("a[href*='/wiki/File:']");
      const fileHref = anchor?.getAttribute("href") || "";
      if (!(await fileIsGeneralArabic(fileHref, src))) continue;
      const quality = await checkAudioQuality(src);
      if (!quality.ok) continue;
      try { sessionStorage.setItem(key, src); } catch {}
      return src;
    }
  } catch {}
  try { sessionStorage.setItem(key, "NONE"); } catch {}
  return null;
}

export default function AudioButton({ text, lang = "ar", label, compact = false }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef(0);
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState<AudioSource>("");
  const [error, setError] = useState(false);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const speak = async () => {
    if (lang !== "ar") return;
    const id = ++requestRef.current;
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause(); audio.removeAttribute("src"); audio.load();
    setBusy(true); setError(false); setSource("");
    try {
      const src = await findHumanArabicAudio(text);
      if (id !== requestRef.current) return;
      if (!src) { setSource("unavailable"); setBusy(false); return; }
      audio.src = src; audio.preload = "auto"; audio.load();
      await new Promise<void>((resolve, reject) => {
        const onReady = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); reject(new Error("Audio failed to load")); };
        const cleanup = () => { audio.removeEventListener("canplay", onReady); audio.removeEventListener("error", onError); };
        audio.addEventListener("canplay", onReady, { once: true }); audio.addEventListener("error", onError, { once: true });
        if (audio.readyState >= 3) onReady();
      });
      if (!Number.isFinite(audio.duration) || audio.duration < 0.25) throw new Error("Invalid audio");
      await audio.play();
      if (id === requestRef.current) setSource("human-ar");
    } catch {
      if (id === requestRef.current) { audio.pause(); audio.removeAttribute("src"); audio.load(); setError(true); setSource("unavailable"); }
    } finally { if (id === requestRef.current) setBusy(false); }
  };

  const title = source === "human-ar" ? "Clear human Arabic recording" : source === "unavailable" ? "No verified clear human Arabic recording available" : "Human Arabic recording";
  const display = label || "Play pronunciation";
  return <>
    <audio ref={audioRef} preload="none" onEnded={() => setBusy(false)} onError={() => { setBusy(false); setError(true); setSource("unavailable"); }} data-audio-language={lang} data-audio-text={text} data-audio-source={source} data-audio-human={source === "human-ar" ? "true" : "false"} aria-hidden="true" />
    <button type="button" onClick={speak} className={`audio-btn ${compact ? "audio-btn-compact" : ""}`} aria-label={`${display}: ${text}`} aria-pressed={busy} title={title} disabled={busy}>
      <span aria-hidden="true">{busy ? "◉" : "▶"}</span>
      {!compact && <span>{busy ? "Playing human Arabic" : error ? "Recording unavailable" : source === "unavailable" ? "MSA recording unavailable" : display}</span>}
    </button>
  </>;
}
