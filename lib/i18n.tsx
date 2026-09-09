"use client";
import {createContext,useContext,useEffect,useMemo,useState} from "react";
export type Lang="en"|"ar";
type Ctx={lang:Lang;setLang:(v:Lang)=>void;toggleLang:()=>void;isArabic:boolean};
const LanguageContext=createContext<Ctx|undefined>(undefined);
export default function LanguageProvider({children}:{children:React.ReactNode}){
 const [lang,setLang]=useState<Lang>("en");
 useEffect(()=>{const v=window.localStorage.getItem("alifya:lang"); if(v==="ar"||v==="en") setLang(v);},[]);
 useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";document.documentElement.dataset.lang=lang;window.localStorage.setItem("alifya:lang",lang);},[lang]);
 const value=useMemo(()=>({lang,setLang,toggleLang:()=>setLang(v=>v==="en"?"ar":"en"),isArabic:lang==="ar"}),[lang]);
 return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){const c=useContext(LanguageContext);if(!c)throw new Error("useLanguage must be inside LanguageProvider");return c;}
