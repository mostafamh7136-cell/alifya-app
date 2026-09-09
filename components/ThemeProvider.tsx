"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme="light"|"dark";
type ThemeContextValue={theme:Theme;toggleTheme:()=>void;setTheme:(theme:Theme)=>void};
const ThemeContext=createContext<ThemeContextValue|undefined>(undefined);

export default function ThemeProvider({children}:{children:React.ReactNode}){
  const [theme,setTheme]=useState<Theme>("light");
  useEffect(()=>{
    const stored=window.localStorage.getItem("alifya:theme") as Theme|null;
    const next=stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
    setTheme(next); document.documentElement.dataset.theme=next;
  },[]);
  useEffect(()=>{ document.documentElement.dataset.theme=theme; window.localStorage.setItem("alifya:theme",theme); },[theme]);
  const value=useMemo(()=>({theme,toggleTheme:()=>setTheme(v=>v==="light"?"dark":"light"),setTheme}),[theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme(){const ctx=useContext(ThemeContext);if(!ctx)throw new Error("useTheme must be inside ThemeProvider");return ctx;}
