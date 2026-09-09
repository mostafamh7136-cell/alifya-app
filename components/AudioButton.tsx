"use client";
import { useEffect, useRef, useState } from "react";

export const FISH_AUDIO={
  arabicWelcome:"/audio/arabic-welcome.mp3",
  arabicRepeat:"/audio/arabic-repeat.mp3",
  englishWelcome:"/audio/english-welcome.mp3",
  englishRepeat:"/audio/english-repeat.mp3",
} as const;

type Props={text:string;lang?:"ar"|"en";sample?:keyof typeof FISH_AUDIO;label?:string;compact?:boolean};
export default function AudioButton({text,lang="ar",sample,label="استمع",compact=false}:Props){
  const audioRef=useRef<HTMLAudioElement|null>(null); const [busy,setBusy]=useState(false);
  useEffect(()=>()=>{audioRef.current?.pause();},[]);
  const speak=()=>{
    if(sample){
      if(!audioRef.current){audioRef.current=new Audio(FISH_AUDIO[sample]);audioRef.current.onended=()=>setBusy(false);}
      audioRef.current.currentTime=0; setBusy(true); void audioRef.current.play().catch(()=>{setBusy(false);fallbackSpeak();}); return;
    }
    fallbackSpeak();
  };
  const fallbackSpeak=()=>{
    if(typeof window==="undefined"||!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=lang==="ar"?"ar-EG":"en-US"; u.rate=lang==="ar"?0.86:0.9; u.onstart=()=>setBusy(true); u.onend=()=>setBusy(false); window.speechSynthesis.speak(u);
  };
  return <button type="button" onClick={speak} className={`audio-btn ${compact?"audio-btn-compact":""}`} aria-label={`${label}: ${text}`} aria-pressed={busy}><span aria-hidden>{busy?"■":"🔊"}</span>{!compact&&<span>{busy?"جاري التشغيل":label}</span>}</button>;
}
