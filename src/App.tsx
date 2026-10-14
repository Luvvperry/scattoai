import React, { useState, useRef, useEffect } from "react";
import { PromptGenerator } from "./components/PromptGenerator";
import { Language, TRANSLATIONS } from "./lib/i18n";
import { Globe, ChevronDown, Check } from "lucide-react";

const LANGUAGE_OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export default function App() {
  const [language, setLanguage] = useState<Language>("es");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsLangOpen(false);
      }
    }

    if (isLangOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLangOpen]);

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#08090b] text-zinc-300 font-sans antialiased selection:bg-white selection:text-black">
      <header className="py-7 px-5 sm:px-8 lg:px-12 flex justify-between items-center max-w-[1500px] mx-auto border-b border-white/10 mb-8 sm:mb-12 gap-4">
        {/* Brand Logo - Left corner */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col text-left">
            <div className="text-[13px] font-semibold tracking-[0.25em] text-white uppercase select-none">
              SCATTO AI
            </div>
            <div className="text-[9px] font-medium tracking-[0.3em] text-zinc-500 uppercase mt-0.5 select-none">
              PROMPT STUDIO
            </div>
          </div>
        </div>

        {/* Global Language Selector - Single organized button on the right side */}
        <div className="relative" ref={langMenuRef}>
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            aria-expanded={isLangOpen}
            aria-haspopup="true"
            className={`inline-flex items-center space-x-2.5 px-3.5 py-2 rounded-2xl border text-xs font-medium transition-all shadow-sm ${
              isLangOpen
                ? "bg-zinc-800 text-white border-zinc-600 shadow-md"
                : "bg-zinc-950/90 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white hover:bg-zinc-900/80"
            }`}
          >
            <span className="text-sm leading-none">{currentOption.flag}</span>
            <span className="font-semibold tracking-wide text-zinc-200">{currentOption.label}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                isLangOpen ? "rotate-180 text-white" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[9px] font-semibold tracking-widest text-zinc-500 uppercase flex items-center space-x-1.5 border-b border-zinc-850/80 mb-1">
                <Globe className="w-3 h-3 text-zinc-500" />
                <span>{t.languageSelectorLabel}</span>
              </div>

              <div className="flex flex-col space-y-0.5">
                {LANGUAGE_OPTIONS.map((opt) => {
                  const isSelected = language === opt.code;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        setLanguage(opt.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                        isSelected
                          ? "bg-zinc-800 text-white font-semibold shadow-xs"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-sm leading-none">{opt.flag}</span>
                        <span className="tracking-wide">{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-zinc-200 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12 pb-24">
        <div className="mb-14 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-white mb-4">
            {language === "es" && "De la Visión a la Realidad"}
            {language === "pt" && "Da Visão à Realidade"}
            {language === "en" && "From Vision to Reality"}
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-lg">
            {t.appSubtitle}
          </p>
        </div>

        <PromptGenerator currentLanguage={language} onLanguageChange={setLanguage} />
      </main>
    </div>
  );
}

