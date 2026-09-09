"use client";
import {useEffect,useRef,useState} from "react";

type Props={text:string;lang?:"ar"|"en";label?:string;compact?:boolean};
const cacheKey=(text:string)=>`alifya:human-audio:${text.trim()}`;
const audioCandidates=(text:string)=>Array.from(new Set([text.trim(),text.trim().normalize("NFKC").replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,""),text.trim().replace(/[.,!?؟،؛:]/g,"")].filter(Boolean)));

async function findHumanAudio(text:string):Promise<string|null>{
 const exact=HUMAN_AUDIO[normalize(text)]; if(exact) return exact;
 for(const candidate of audioCandidates(text)){
  const cached=window.sessionStorage.getItem(cacheKey(candidate));
  if(cached) return cached==="none"?null:cached;
  try{
   const u=`https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(candidate)}&prop=text&format=json&origin=*`;
   const res=await fetch(u,{cache:"force-cache"}); if(!res.ok) continue;
   const data=await res.json(); const html=String(data?.parse?.text?.["*"]||"");
   if(!html) continue;
   const doc=new DOMParser().parseFromString(html,"text/html");
   const sources=Array.from(doc.querySelectorAll("audio source"));
   const links=Array.from(doc.querySelectorAll('a[href]')).map(a=>a.getAttribute("href")||"");
   const raw=[...sources.map(s=>s.getAttribute("src")||""),...links].map(s=>s.trim()).filter(Boolean);
   const hit=raw.find(s=>/\.(ogg|oga|wav|mp3)(?:\?|$)/i.test(s));
   if(hit){const url=hit.startsWith("//")?`https:${hit}`:hit.startsWith("http")?hit:new URL(hit,"https://en.wiktionary.org").href;window.sessionStorage.setItem(cacheKey(candidate),url);return url;}
  }catch{}
 }
 window.sessionStorage.setItem(cacheKey(text.trim()),"none"); return null;
}

export default function AudioButton({text,lang="ar",label,compact=false}:Props){
 const audioRef=useRef<HTMLAudioElement|null>(null); const [busy,setBusy]=useState(false); const [human,setHuman]=useState(false); const [error,setError]=useState(false);
 useEffect(()=>()=>{audioRef.current?.pause()},[]);
 const speak=async()=>{
  setError(false); setBusy(true);
  try{
   let src=lang==="ar"?await findHumanAudio(text):null;
   if(src){setHuman(src.includes("wikimedia.org")||src.includes("lingualibre.org"));if(!audioRef.current||audioRef.current.src!==src){audioRef.current?.pause();audioRef.current=new Audio(src);audioRef.current.preload="auto";audioRef.current.onended=()=>setBusy(false);audioRef.current.onerror=()=>{setBusy(false);setError(true)};}audioRef.current.currentTime=0;await audioRef.current.play();return;}
   setHuman(false);
   if("speechSynthesis" in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang==="ar"?"ar-EG":"en-US";u.rate=lang==="ar"?.86:.92;u.onend=()=>setBusy(false);u.onerror=()=>{setBusy(false);setError(true)};window.speechSynthesis.speak(u);return;}
   setBusy(false);setError(true);
  }catch{setBusy(false);setError(true)}
 };
 const displayLabel=label|| (lang==="ar" ? "Play pronunciation" : "Play audio");
 return <button type="button" onClick={speak} className={`audio-btn ${compact?"audio-btn-compact":""}`} aria-label={`${displayLabel}: ${text}`} aria-pressed={busy} title={human?"Human recording":"Browser voice fallback"}>
  <span aria-hidden>{busy?"■":"🔊"}</span>{!compact&&<span>{busy?(human?"Playing human recording":"Playing"):(error?"Try again":displayLabel)}</span>}
 </button>;
}
