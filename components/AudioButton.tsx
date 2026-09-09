"use client";
import {useEffect,useRef,useState} from "react";

type Props={text:string;lang?:"ar"|"en";label?:string;compact?:boolean};
const HUMAN_AUDIO:Record<string,string>={
 "مرحبا":"https://upload.wikimedia.org/wikipedia/commons/c/cb/LL-Q55633582_%28ajp%29-AdrianAbdulBaha-%D9%85%D8%B1%D8%AD%D8%A8%D8%A7.wav",
 "السلام عليكم":"https://upload.wikimedia.org/wikipedia/commons/0/07/%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85_%D8%B9%D9%84%D9%8A%D9%83%D9%85.ogg",
 "صباح الخير":"https://upload.wikimedia.org/wikipedia/commons/e/e2/%E1%B9%A2ab%C4%81%E1%B8%A5_al-kh%C3%A1yr2.ogg"
};
const normalize=(text:string)=>text.trim().normalize("NFKC").replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,"").replace(/[.,!?؟،؛:]/g,"");
const cacheKey=(text:string)=>`alifya:human-audio:${normalize(text)}`;
const audioCandidates=(text:string)=>Array.from(new Set([text.trim(),normalize(text)].filter(Boolean)));
async function findHumanAudio(text:string):Promise<string|null>{
 const exact=HUMAN_AUDIO[normalize(text)];if(exact)return exact;
 for(const candidate of audioCandidates(text)){
  const cached=window.sessionStorage.getItem(cacheKey(candidate));if(cached)return cached==="none"?null:cached;
  try{
   const u=`https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(candidate)}&prop=text&format=json&origin=*`;
   const res=await fetch(u,{cache:"force-cache"});if(!res.ok)continue;
   const data=await res.json();const html=String(data?.parse?.text?.["*"]||"");if(!html)continue;
   const doc=new DOMParser().parseFromString(html,"text/html");
   const raw=[...Array.from(doc.querySelectorAll("audio source")),...Array.from(doc.querySelectorAll('a[href]'))].map(el=>el.getAttribute("src")||el.getAttribute("href")||"").filter(Boolean);
   const hit=raw.find(s=>/\.(ogg|oga|wav|mp3)(?:\?|$)/i.test(s));
   if(hit){const url=hit.startsWith("//")?`https:${hit}`:hit.startsWith("http")?hit:new URL(hit,"https://en.wiktionary.org").href;window.sessionStorage.setItem(cacheKey(candidate),url);return url;}
  }catch{}
 }
 window.sessionStorage.setItem(cacheKey(text),"none");return null;
}
export default function AudioButton({text,lang="ar",label,compact=false}:Props){
 const audioRef=useRef<HTMLAudioElement|null>(null);const[busy,setBusy]=useState(false);const[human,setHuman]=useState(false);const[error,setError]=useState(false);
 useEffect(()=>()=>{audioRef.current?.pause()},[]);
 const speak=async()=>{setBusy(true);setError(false);try{let src=lang==="ar"?await findHumanAudio(text):null;if(src){setHuman(src.includes("wikimedia.org")||src.includes("lingualibre.org"));const a=audioRef.current;if(!a)throw new Error("audio element unavailable");a.src=src;a.currentTime=0;await a.play();return;}setHuman(false);if("speechSynthesis" in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang==="ar"?"ar-EG":"en-US";u.rate=lang==="ar"?.86:.92;u.onend=()=>setBusy(false);u.onerror=()=>{setBusy(false);setError(true)};window.speechSynthesis.speak(u);return;}throw new Error("speech synthesis unavailable")}catch{setBusy(false);setError(true)}};
 const displayLabel=label|| (lang==="ar"?"Play pronunciation":"Play audio");
 return <><audio ref={audioRef} preload="none" onEnded={()=>setBusy(false)} onError={()=>{setBusy(false);setError(true)}} data-audio-language={lang} data-audio-text={text} data-audio-source={human?"human-wikimedia":(HUMAN_AUDIO[normalize(text)]?"human-wikimedia":"browser-fallback")} aria-hidden="true"/><button type="button" onClick={speak} className={`audio-btn ${compact?"audio-btn-compact":""}`} aria-label={`${displayLabel}: ${text}`} aria-pressed={busy} title={human?"Human recording":"Browser voice fallback"}><span aria-hidden>{busy?"■":"🔊"}</span>{!compact&&<span>{busy?(human?"Playing human recording":"Playing"):(error?"Try again":displayLabel)}</span>}</button></>;
}
