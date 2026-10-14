import React, { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  ImageIcon, 
  Loader2, 
  Copy, 
  Check, 
  X, 
  History, 
  Trash2, 
  User, 
  FileText, 
  Box, 
  Lightbulb, 
  Edit3, 
  Sparkles,
  Camera,
  Globe
} from "lucide-react";
import { PRESET_DESCRIPTIONS } from '../lib/presets';
import { 
  Language, 
  TRANSLATIONS, 
  PRESET_CATEGORIES_TRANSLATIONS 
} from '../lib/i18n';

type ModeType = "person_image" | "person_text" | "pov_image" | "pov_text" | "edit";

interface PromptHistoryItem {
  id: string;
  timestamp: number;
  imagePreview: string;
  prompt: string;
  customInstructions: string;
  preset: string;
  modeLabel?: string;
}

interface PromptGeneratorProps {
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

async function compressImage(file: File, maxDim = 1024, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

export function PromptGenerator({ currentLanguage = "es", onLanguageChange }: PromptGeneratorProps = {}) {
  const [mode, setMode] = useState<ModeType>("person_image");
  const [textIdea, setTextIdea] = useState("");
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [formatStyle, setFormatStyle] = useState<"iphone_realista" | "technical_blueprint" | "iphone_proraw_ultra">("iphone_realista");
  
  const promptLanguage = currentLanguage;
  const setPromptLanguage = (lang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const t = TRANSLATIONS[promptLanguage];
  const presetCategories = PRESET_CATEGORIES_TRANSLATIONS[promptLanguage];

  // Identity Configuration State
  const [includeTattoos, setIncludeTattoos] = useState(false);
  const [includeHairDye, setIncludeHairDye] = useState(false);
  const [includeScars, setIncludeScars] = useState(false);
  const [strictLighting, setStrictLighting] = useState(true);
  
  // Edit Tab State
  const [editExistingPrompt, setEditExistingPrompt] = useState("");
  const [editRequestedChanges, setEditRequestedChanges] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("promptHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse prompt history", e);
      }
    }
  }, []);

  const saveToHistory = (preview: string, promptText: string, instructions: string, presetName: string) => {
    const modeLabels: Record<ModeType, string> = {
      person_image: `${t.modePerson} (${t.modeFromPhoto})`,
      person_text: `${t.modePerson} (${t.modeFromText})`,
      pov_image: `${t.modePOV} (${t.modeFromPhoto})`,
      pov_text: `${t.modePOV} (${t.modeFromText})`,
      edit: t.modeEdit
    };

    const newItem: PromptHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      imagePreview: preview,
      prompt: promptText,
      customInstructions: instructions,
      preset: presetName,
      modeLabel: modeLabels[mode]
    };
    
    setHistory(prev => {
      const newHistory = [newItem, ...prev].slice(0, 20);
      try {
        localStorage.setItem("promptHistory", JSON.stringify(newHistory));
      } catch (err) {
        console.warn("Failed to save history to localStorage", err);
      }
      return newHistory;
    });
  };

  const loadFromHistory = (item: PromptHistoryItem) => {
    setImagePreviewUrl(item.imagePreview || null);
    setGeneratedPrompt(item.prompt);
    setEditExistingPrompt(item.prompt);
    setCustomInstructions(item.customInstructions);
    setSelectedPreset(item.preset || "");
    setError(null);
    if (window.innerWidth < 768) {
      setIsHistoryOpen(false);
    }
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem("promptHistory", JSON.stringify(newHistory));
      } catch (err) {
        console.warn("Failed to update localStorage", err);
      }
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("promptHistory");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError(promptLanguage === "es" ? "Por favor selecciona un archivo de imagen válido." : promptLanguage === "pt" ? "Por favor selecione um arquivo de imagem válido." : "Please select a valid image file.");
        return;
      }
      setImageFile(file);
      setError(null);
      
      try {
        const compressedDataUrl = await compressImage(file);
        setImagePreviewUrl(compressedDataUrl);
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) {
        setError(promptLanguage === "es" ? "Por favor arrastra un archivo de imagen." : promptLanguage === "pt" ? "Por favor arraste um arquivo de imagem." : "Please drag an image file.");
        return;
      }
      setImageFile(file);
      setError(null);

      try {
        const compressedDataUrl = await compressImage(file);
        setImagePreviewUrl(compressedDataUrl);
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const payload: any = {
        mode,
        modality: mode,
        promptLanguage,
        promptLang: promptLanguage,
        ideaText: textIdea,
        references: [],
        settings: { customInstructions, selectedPreset, formatStyle, includeTattoos, includeHairDye, includeScars, strictLighting, autoDetect: true },
        targetEngine: formatStyle === "iphone_realista" ? "v1" : formatStyle === "technical_blueprint" ? "v2" : "v3"
      };

      if (mode === "person_image" || mode === "pov_image") {
        if (!imagePreviewUrl) {
          setError(promptLanguage === "es" ? "Por favor sube una imagen de referencia." : promptLanguage === "pt" ? "Por favor envie uma imagem de referência." : "Please upload a reference image.");
          setIsGenerating(false);
          return;
        }
        const base64Data = imagePreviewUrl.split(",")[1];
        let mimeType = "image/jpeg";
        if (imageFile) {
          mimeType = imageFile.type;
        } else if (imagePreviewUrl.startsWith("data:image/")) {
          mimeType = imagePreviewUrl.split(";")[0].split(":")[1];
        }
        payload.references = [{ name: imageFile?.name || "reference.jpg", dataUrl: imagePreviewUrl, roles: [mode.startsWith("pov") ? "scene" : "person"] }];
      } else if (mode === "person_text" || mode === "pov_text") {
        if (!textIdea.trim()) {
          setError(promptLanguage === "es" ? "Por favor escribe tu idea o concepto." : promptLanguage === "pt" ? "Por favor escreva sua ideia ou conceito." : "Please type your idea or concept.");
          setIsGenerating(false);
          return;
        }
        payload.textIdea = textIdea;
      }

      const response = await fetch("/api/generate-prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate prompt");
      }

      const selectedPrompt = data.prompt || data[formatStyle === "iphone_realista" ? "v1" : formatStyle === "technical_blueprint" ? "v2" : "v3"] || data.v3 || data.v2 || data.v1 || "";
      setGeneratedPrompt(selectedPrompt);
      setEditExistingPrompt(selectedPrompt);
      saveToHistory(imagePreviewUrl || "", selectedPrompt, textIdea || customInstructions, selectedPreset);
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("429") || msg.includes("rate limit") || msg.includes("cuota") || msg.includes("RESOURCE_EXHAUSTED")) {
        setError(promptLanguage === "es" ? "Se alcanzó el límite temporal de la API de IA. Espera un momento antes de volver a intentarlo." : promptLanguage === "pt" ? "O limite temporário da API de IA foi atingido. Aguarde um momento antes de tentar novamente." : "The temporary AI API limit was reached. Please wait a moment before trying again.");
      } else {
        setError(msg || (promptLanguage === "es" ? "Ocurrió un error inesperado al generar el prompt." : promptLanguage === "pt" ? "Ocorreu um erro inesperado ao gerar o prompt." : "An unexpected error occurred while generating the prompt."));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePrompt = async () => {
    if (!editExistingPrompt || !editRequestedChanges) return;

    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch("/api/refine-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalPrompt: editExistingPrompt,
          refinementDirective: editRequestedChanges,
          targetEngine: "v3",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update prompt");
      }

      setGeneratedPrompt(data.refined || data.prompt);
      setEditExistingPrompt(data.refined || data.prompt);
      setEditRequestedChanges("");
      saveToHistory(imagePreviewUrl || "", data.refined || data.prompt || editExistingPrompt, `[Edit] ${editRequestedChanges}`, selectedPreset);
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("429") || msg.includes("rate limit") || msg.includes("cuota") || msg.includes("RESOURCE_EXHAUSTED")) {
        setError(promptLanguage === "es" ? "Se alcanzó el límite temporal de la API de IA. Espera un momento antes de volver a intentarlo." : promptLanguage === "pt" ? "O limite temporário da API de IA foi atingido. Aguarde um momento antes de tentar novamente." : "The temporary AI API limit was reached. Please wait a moment before trying again.");
      } else {
        setError(msg || (promptLanguage === "es" ? "Ocurrió un error inesperado al actualizar el prompt." : promptLanguage === "pt" ? "Ocorreu um erro inesperado ao atualizar o prompt." : "An unexpected error occurred while updating the prompt."));
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        console.error("Failed to copy to clipboard", err);
        const textArea = document.createElement("textarea");
        textArea.value = generatedPrompt;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (e) {
          console.error("Fallback copy failed", e);
        }
        document.body.removeChild(textArea);
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-[1600px] mx-auto gap-12 relative">
      
      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col md:flex-row gap-16 transition-all duration-300 ${isHistoryOpen ? 'md:pr-80' : ''}`}>
        
        {/* Input & Controls Section */}
        <div className="w-full md:w-1/2 flex flex-col space-y-8">
          
          {/* Mode Selector Navigation */}
          <div className="flex flex-col space-y-3 border-b border-zinc-900 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                {t.selectMode}
              </span>
              <button 
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className="md:hidden flex items-center space-x-2 text-[11px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                <span>{t.historyToggleLabel}</span>
              </button>
            </div>

            {/* Grid of Mode Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => { setMode("person_image"); setError(null); }}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  mode === "person_image"
                    ? "border-white bg-zinc-800 text-white shadow-lg"
                    : "border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <User className="w-4 h-4 mb-2 text-zinc-300" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider">{t.modePerson}</div>
                  <div className="text-[9px] text-zinc-500">{t.modeFromPhoto}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setMode("person_text"); setError(null); }}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  mode === "person_text"
                    ? "border-white bg-zinc-800 text-white shadow-lg"
                    : "border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <FileText className="w-4 h-4 mb-2 text-zinc-300" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider">{t.modePerson}</div>
                  <div className="text-[9px] text-zinc-500">{t.modeFromText}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setMode("pov_image"); setError(null); }}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  mode === "pov_image"
                    ? "border-white bg-zinc-800 text-white shadow-lg"
                    : "border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <Box className="w-4 h-4 mb-2 text-zinc-300" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider">{t.modePOV}</div>
                  <div className="text-[9px] text-zinc-500">{t.modeFromPhoto}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setMode("pov_text"); setError(null); }}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  mode === "pov_text"
                    ? "border-white bg-zinc-800 text-white shadow-lg"
                    : "border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <Lightbulb className="w-4 h-4 mb-2 text-zinc-300" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider">{t.modePOV}</div>
                  <div className="text-[9px] text-zinc-500">{t.modeFromText}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setMode("edit"); setError(null); }}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  mode === "edit"
                    ? "border-white bg-zinc-800 text-white shadow-lg"
                    : "border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <Edit3 className="w-4 h-4 mb-2 text-zinc-300" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider">{t.modeEdit}</div>
                  <div className="text-[9px] text-zinc-500">{t.modeExistingPrompt}</div>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-900/60 text-red-300 text-xs px-4 py-3 rounded-xl flex items-center justify-between transition-colors">
              <span className="leading-relaxed">{error}</span>
              <button 
                onClick={() => setError(null)} 
                className="text-red-400 hover:text-red-200 ml-3 shrink-0 p-1"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mode 1 & 3: Image Upload Modes */}
          {(mode === "person_image" || mode === "pov_image") && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-zinc-400" />
                  {mode === "person_image" ? t.personPhotoTitle : t.povPhotoTitle}
                </span>
                <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300">
                  {t.verticalBadge}
                </span>
              </div>

              {!imagePreviewUrl ? (
                <div 
                  className="group border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[320px]"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <UploadCloud className="w-8 h-8 text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300 mb-4" />
                  <p className="text-[11px] uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors duration-300 mb-2">
                    {mode === "person_image" ? t.uploadPersonPhoto : t.uploadPOVPhoto}
                  </p>
                  <p className="text-[10px] text-zinc-500 tracking-wider">{t.uploadFormatSubtext}</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="relative bg-zinc-900/20 rounded-3xl overflow-hidden border border-zinc-800 transition-colors duration-200">
                  <img 
                    src={imagePreviewUrl} 
                    alt="Reference preview" 
                    className="w-full h-auto object-contain max-h-[500px]"
                  />
                  <button 
                    onClick={clearImage}
                    className="absolute top-4 right-4 bg-zinc-900/90 hover:bg-zinc-800 text-white rounded-full p-2 transition-colors shadow-xl backdrop-blur-md border border-zinc-700 hover:border-zinc-500"
                    title={t.removeImage}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mode 2 & 4: Text Idea Modes */}
          {(mode === "person_text" || mode === "pov_text") && (
            <div className="space-y-4 p-5 border border-zinc-800 bg-zinc-900/40 rounded-2xl">
              <div className="flex items-center justify-between">
                <label htmlFor="textIdea" className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  {mode === "person_text" ? t.personIdeaTitle : t.povIdeaTitle}
                </label>
              </div>

              <textarea
                id="textIdea"
                value={textIdea}
                onChange={(e) => setTextIdea(e.target.value)}
                placeholder={mode === "person_text" ? t.personIdeaPlaceholder : t.povIdeaPlaceholder}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all resize-y min-h-[140px] outline-none"
              />

              {/* Ideas / Quick Examples */}
              <div className="space-y-2 pt-2 border-t border-zinc-850">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{t.quickExamplesLabel}</span>
                <div className="flex flex-wrap gap-2">
                  {(mode === "person_text" ? t.personExamples : t.povExamples).map((ex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTextIdea(ex)}
                      className="text-[10px] text-zinc-400 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg text-left transition-colors"
                    >
                      "{ex}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mode 5: Edit Mode */}
          {mode === "edit" && (
            <div className="flex flex-col space-y-4">
              <div className="space-y-3 p-5 border border-zinc-800 bg-zinc-900/40 rounded-2xl">
                <label htmlFor="editExistingPrompt" className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  {t.existingPromptLabel}
                </label>
                <textarea
                  id="editExistingPrompt"
                  value={editExistingPrompt}
                  onChange={(e) => setEditExistingPrompt(e.target.value)}
                  placeholder={t.existingPromptPlaceholder}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all resize-y min-h-[200px] outline-none"
                />
              </div>

              <div className="space-y-3 p-5 border border-zinc-800 bg-zinc-900/40 rounded-2xl">
                <label htmlFor="editRequestedChanges" className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  {t.requestedChangesLabel}
                </label>
                <textarea
                  id="editRequestedChanges"
                  value={editRequestedChanges}
                  onChange={(e) => setEditRequestedChanges(e.target.value)}
                  placeholder={t.requestedChangesPlaceholder}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all resize-y min-h-[100px] outline-none"
                />
              </div>

              <div className="space-y-3 p-5 border border-zinc-800 bg-zinc-900/40 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-zinc-400" />
                    {t.outputLanguageLabel}
                  </label>
                  <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 uppercase">
                    {promptLanguage === "es" ? "Español" : promptLanguage === "pt" ? "Português" : "English"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPromptLanguage("es")}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                      promptLanguage === "es"
                        ? "border-zinc-500 bg-zinc-800/90 text-white font-semibold shadow-md"
                        : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className="text-[11px] font-medium">Español</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPromptLanguage("pt")}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                      promptLanguage === "pt"
                        ? "border-zinc-500 bg-zinc-800/90 text-white font-semibold shadow-md"
                        : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className="text-[11px] font-medium">Português</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPromptLanguage("en")}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                      promptLanguage === "en"
                        ? "border-zinc-500 bg-zinc-800/90 text-white font-semibold shadow-md"
                        : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className="text-[11px] font-medium">English</div>
                  </button>
                </div>
              </div>

              <button
                onClick={updatePrompt}
                disabled={!editExistingPrompt || !editRequestedChanges || isUpdating}
                className="w-full mt-2 bg-zinc-200 text-black rounded-2xl text-[11px] tracking-widest uppercase font-semibold py-4 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.updatingPrompt}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{t.updatePromptButton}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Common Custom Instructions & Controls for Generation Modes */}
          {mode !== "edit" && (
            <>
              {/* Presets dropdown */}
              <div className="space-y-3 p-5 border border-zinc-800 bg-zinc-900/40 rounded-2xl">
                <label htmlFor="presetLibrary" className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  {t.presetLibraryLabel}
                </label>
                <select
                  id="presetLibrary"
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 focus:ring-1 focus:ring-zinc-700 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="" className="bg-black">{t.presetSelectPlaceholder}</option>
                  {presetCategories.map((category) => (
                    <optgroup key={category.label} label={category.label} className="bg-black">
                      {category.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-black">{opt}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {selectedPreset && PRESET_DESCRIPTIONS[selectedPreset] && (
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-mono pt-1">
                    {PRESET_DESCRIPTIONS[selectedPreset]}
                  </p>
                )}
              </div>

              {/* Format Style Selector (only for person_image) */}
              {mode === "person_image" && (
                <div className="space-y-3 p-5 border border-zinc-800 bg-zinc-900/40 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      {t.formatStyleTitle}
                    </label>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300">
                      {t.verticalBadge}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setFormatStyle("iphone_realista")}
                      className={`p-3.5 text-left rounded-xl border transition-all ${
                        formatStyle === "iphone_realista"
                          ? "border-zinc-500 bg-zinc-800/80 text-white shadow-xs"
                          : "border-zinc-850 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold tracking-wider">{t.formatIphoneTitle}</span>
                        {formatStyle === "iphone_realista" && <Check className="w-3.5 h-3.5 text-zinc-200" />}
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-snug">
                        {t.formatIphoneDesc}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormatStyle("technical_blueprint")}
                      className={`p-3.5 text-left rounded-xl border transition-all ${
                        formatStyle === "technical_blueprint"
                          ? "border-zinc-500 bg-zinc-800/80 text-white shadow-xs"
                          : "border-zinc-850 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold tracking-wider">{t.formatBlueprintTitle}</span>
                        {formatStyle === "technical_blueprint" && <Check className="w-3.5 h-3.5 text-zinc-200" />}
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-snug">
                        {t.formatBlueprintDesc}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormatStyle("iphone_proraw_ultra")}
                      className={`p-3.5 text-left rounded-xl border transition-all ${
                        formatStyle === "iphone_proraw_ultra"
                          ? "border-zinc-500 bg-zinc-800/80 text-white shadow-xs"
                          : "border-zinc-850 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold tracking-wider">{t.formatProRawTitle}</span>
                        {formatStyle === "iphone_proraw_ultra" && <Check className="w-3.5 h-3.5 text-zinc-200" />}
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-snug">
                        {t.formatProRawDesc}
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Instructions */}
              <div className="space-y-3 p-5 border border-zinc-800 bg-zinc-900/40 rounded-2xl">
                <label htmlFor="customInstructions" className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  {t.customInstructionsLabel}
                </label>
                <textarea
                  id="customInstructions"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder={t.customInstructionsPlaceholder}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all resize-y min-h-[90px] outline-none"
                />
              </div>

              {/* Tattoos & Identity Toggles (for person modes) */}
              {(mode === "person_image" || mode === "person_text") && (
                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">{t.identitySectionTitle}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`group flex flex-col p-3.5 border rounded-xl transition-all cursor-pointer ${strictLighting ? 'border-zinc-600 bg-zinc-800/80' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] uppercase tracking-widest font-semibold ${strictLighting ? 'text-white' : 'text-zinc-400'}`}>{t.strictLightingTitle}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${strictLighting ? 'border-zinc-300 bg-zinc-300' : 'border-zinc-700'}`}>
                          {strictLighting && <Check className="w-2.5 h-2.5 text-black" />}
                        </div>
                      </div>
                      <input type="checkbox" checked={strictLighting} onChange={(e) => setStrictLighting(e.target.checked)} className="hidden" />
                      <span className="text-[10px] text-zinc-500">{t.strictLightingDesc}</span>
                    </label>

                    <label className={`group flex flex-col p-3.5 border rounded-xl transition-all cursor-pointer ${includeTattoos ? 'border-zinc-600 bg-zinc-800/80' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] uppercase tracking-widest font-semibold ${includeTattoos ? 'text-white' : 'text-zinc-400'}`}>{t.includeTattoosTitle}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${includeTattoos ? 'border-zinc-300 bg-zinc-300' : 'border-zinc-700'}`}>
                          {includeTattoos && <Check className="w-2.5 h-2.5 text-black" />}
                        </div>
                      </div>
                      <input type="checkbox" checked={includeTattoos} onChange={(e) => setIncludeTattoos(e.target.checked)} className="hidden" />
                      <span className="text-[10px] text-zinc-500">{t.includeTattoosDesc}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generatePrompt}
                disabled={
                  isGenerating || 
                  ((mode === "person_image" || mode === "pov_image") && !imagePreviewUrl) ||
                  ((mode === "person_text" || mode === "pov_text") && !textIdea.trim())
                }
                className="w-full mt-8 bg-zinc-200 text-black rounded-2xl text-[11px] tracking-widest uppercase font-semibold py-4 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.generateButtonLoading}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>
                      {mode === "person_image" && t.generatePersonPhoto}
                      {mode === "person_text" && t.generatePersonText}
                      {mode === "pov_image" && t.generatePOVPhoto}
                      {mode === "pov_text" && t.generatePOVText}
                    </span>
                  </>
                )}
              </button>
            </>
          )}

        </div>

        {/* Output Section */}
        <div className="w-full md:w-1/2 flex flex-col space-y-8 md:pl-12 md:border-l border-zinc-900 min-h-[600px]">
          <div className="flex justify-between items-end border-b border-zinc-900 pb-2">
            <div className="flex items-center space-x-3 pb-2 -mb-[9px] border-b border-white">
              <h2 className="text-[11px] uppercase tracking-widest font-semibold text-white">{t.generatedPromptHeader}</h2>
              <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                {t.verticalBadge}
              </span>
            </div>
            {generatedPrompt && (
              <button
                onClick={copyToClipboard}
                className="text-[10px] text-zinc-400 hover:text-white uppercase tracking-widest transition-colors flex items-center space-x-2 pb-2 -mb-[9px]"
              >
                {isCopied ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> {t.copiedPrompt}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy className="w-3 h-3" /> {t.copyPrompt}
                  </span>
                )}
              </button>
            )}
          </div>
          
          <div className="relative flex-grow flex flex-col border border-zinc-800 bg-zinc-900/40 rounded-3xl min-h-[500px] overflow-hidden">
            {!generatedPrompt && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-zinc-600">
                <Sparkles className="w-8 h-8 mb-3 text-zinc-700" />
                <p className="text-[11px] uppercase tracking-widest">{t.waitingStateTitle}</p>
                <p className="text-[10px] text-zinc-600 mt-1 max-w-xs">
                  {t.waitingStateDesc}
                </p>
              </div>
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300 bg-black/40 backdrop-blur-sm">
                <Loader2 className="w-6 h-6 animate-spin mb-4 text-zinc-200" />
                <p className="text-[10px] uppercase tracking-widest animate-pulse text-zinc-400">{t.generatingStateTitle}</p>
              </div>
            )}

            {generatedPrompt && !isGenerating && (
              <div className="overflow-y-auto h-full absolute inset-0 p-8 custom-scrollbar">
                <pre className="text-[14px] text-zinc-200 font-sans whitespace-pre-wrap leading-relaxed pb-6">
                  {generatedPrompt}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <div className={`
        fixed md:absolute top-0 right-0 h-full w-80 bg-black border-l border-zinc-900 
        transform transition-transform duration-300 ease-in-out z-40 overflow-hidden flex flex-col
        ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-full'}
      `}>
        <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-black/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center space-x-3 text-white">
            <History className="w-4 h-4" />
            <h3 className="text-[10px] uppercase tracking-widest font-semibold">{t.historyTitle}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                title={t.clearHistory}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button 
              onClick={() => setIsHistoryOpen(false)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center text-zinc-700 text-[10px] uppercase tracking-widest mt-12">
              {t.emptyHistory}
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => loadFromHistory(item)}
                className="group cursor-pointer bg-zinc-950/60 p-3 rounded-2xl border border-zinc-900 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {item.modeLabel || "Prompt"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono text-zinc-600">{formatDate(item.timestamp)}</span>
                    <button 
                      onClick={(e) => deleteHistoryItem(e, item.id)}
                      className="text-zinc-600 hover:text-red-400 p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {item.imagePreview ? (
                  <div className="relative border border-zinc-800 rounded-xl overflow-hidden h-28 w-full mb-2">
                    <img 
                      src={item.imagePreview} 
                      alt="History thumbnail" 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                ) : null}

                <p className="text-[10px] text-zinc-400 line-clamp-3 font-mono leading-relaxed group-hover:text-zinc-200 transition-colors">
                  {item.prompt}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Desktop Toggle Button (when closed) */}
      {!isHistoryOpen && (
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="hidden md:flex absolute top-0 -right-12 h-10 w-10 border border-zinc-900 items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors z-30 bg-black rounded-r-xl"
          title={t.openHistory}
        >
          <History className="w-4 h-4" />
        </button>
      )}

      {/* Mobile Backdrop */}
      {isHistoryOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 z-30"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
}
