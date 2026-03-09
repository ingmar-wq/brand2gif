"use client";

import { useState, useCallback, useEffect } from "react";
import { BrandData, DEMO_BRAND_DATA } from "@/lib/brand-schema";
import UploadZone from "./components/UploadZone";
import BrandPreview from "./components/BrandPreview";
import FrameEditor from "./components/FrameEditor";
import ExportPanel from "./components/ExportPanel";
import ProgressBar from "./components/ProgressBar";

type AppStep = "upload" | "analyzing" | "preview" | "frames";

// Simple hash for PDF caching
async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Cache helpers
function getCachedBrand(hash: string): BrandData | null {
  try {
    const cached = localStorage.getItem(`brand2gif_${hash}`);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedBrand(hash: string, data: BrandData, fileName: string) {
  try {
    localStorage.setItem(`brand2gif_${hash}`, JSON.stringify(data));

    const recentRaw = localStorage.getItem("brand2gif_recent");
    const recent: { hash: string; name: string; brandName: string; date: string }[] =
      recentRaw ? JSON.parse(recentRaw) : [];

    const filtered = recent.filter((r) => r.hash !== hash);
    filtered.unshift({
      hash,
      name: fileName,
      brandName: data.brand_name,
      date: new Date().toISOString(),
    });

    localStorage.setItem(
      "brand2gif_recent",
      JSON.stringify(filtered.slice(0, 10))
    );
  } catch {
    // localStorage full or unavailable
  }
}

function getRecentBrands(): {
  hash: string;
  name: string;
  brandName: string;
  date: string;
}[] {
  try {
    const raw = localStorage.getItem("brand2gif_recent");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function Home() {
  const [step, setStep] = useState<AppStep>("upload");
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [renderedCanvases, setRenderedCanvases] = useState<HTMLCanvasElement[]>(
    []
  );
  const [frameDelays, setFrameDelays] = useState<number[]>([]);
  const [recentBrands, setRecentBrands] = useState<
    { hash: string; name: string; brandName: string; date: string }[]
  >([]);

  useEffect(() => {
    setRecentBrands(getRecentBrands());
  }, []);

  const handleFileSelected = useCallback(async (file: File) => {
    setError(null);
    setStep("analyzing");
    setAnalyzeProgress(0);

    try {
      const hash = await hashFile(file);
      const cached = getCachedBrand(hash);

      if (cached) {
        setBrandData(cached);
        setStep("preview");
        return;
      }

      const progressInterval = setInterval(() => {
        setAnalyzeProgress((prev) => Math.min(prev + 0.05, 0.85));
      }, 500);

      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      const data: BrandData = await response.json();
      setAnalyzeProgress(1);

      setCachedBrand(hash, data, file.name);
      setRecentBrands(getRecentBrands());

      setBrandData(data);
      setTimeout(() => setStep("preview"), 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze PDF");
      setStep("upload");
    }
  }, []);

  const handleLoadRecent = useCallback((hash: string) => {
    const data = getCachedBrand(hash);
    if (data) {
      setBrandData(data);
      setStep("preview");
    }
  }, []);

  const handleLoadDemo = useCallback(() => {
    setBrandData({ ...DEMO_BRAND_DATA });
    setStep("preview");
  }, []);

  const handleFramesReady = useCallback(
    (canvases: HTMLCanvasElement[], delays: number[]) => {
      setRenderedCanvases(canvases);
      setFrameDelays(delays);
    },
    []
  );

  const handleStartOver = () => {
    setBrandData(null);
    setRenderedCanvases([]);
    setFrameDelays([]);
    setStep("upload");
    setError(null);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1
              className="text-xl font-bold tracking-tight cursor-pointer"
              onClick={handleStartOver}
            >
              <span className="text-violet-400">brand</span>
              <span className="text-zinc-400">2</span>
              <span className="text-fuchsia-400">gif</span>
            </h1>
            <span className="text-xs text-zinc-600 hidden sm:inline">
              Brand Guide → Animated Showcase
            </span>
          </div>

          {step !== "upload" && step !== "analyzing" && (
            <button
              onClick={handleStartOver}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ← Start over
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-3">
                Upload your brand guide
              </h2>
              <p className="text-zinc-400 text-lg">
                AI extracts colors, typography, and visual identity — then
                generates an animated showcase.
              </p>
            </div>

            <UploadZone
              onFileSelected={handleFileSelected}
              isAnalyzing={false}
            />

            <div className="text-center mt-8">
              <button
                onClick={handleLoadDemo}
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-4"
              >
                Try with example data
              </button>
            </div>

            {recentBrands.length > 0 && (
              <div className="mt-12">
                <h3 className="text-sm font-medium text-zinc-500 mb-3">
                  Recent brand guides
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {recentBrands.map((item) => (
                    <button
                      key={item.hash}
                      onClick={() => handleLoadRecent(item.hash)}
                      className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors text-left"
                    >
                      <p className="text-sm text-zinc-300 font-medium">
                        {item.brandName}
                      </p>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {item.name} ·{" "}
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 max-w-2xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Analyzing */}
        {step === "analyzing" && (
          <div className="animate-fade-in max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-violet-500/10 flex items-center justify-center animate-pulse-subtle">
              <svg
                className="w-8 h-8 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Analyzing brand guide</h2>
            <p className="text-zinc-400 mb-6">
              Gemini AI is extracting colors, typography, and brand elements...
            </p>
            <ProgressBar progress={analyzeProgress} label="Processing PDF" />
          </div>
        )}

        {/* Step 2: Brand Preview */}
        {step === "preview" && brandData && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Brand elements found</h2>
              <p className="text-zinc-400">
                Review and adjust the extracted data, then continue to generate
                frames.
              </p>
            </div>

            <BrandPreview brand={brandData} onUpdate={setBrandData} />

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setStep("frames")}
                className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors text-sm"
              >
                Generate frames →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 + 4: Frame Editor + Export */}
        {step === "frames" && brandData && (
          <div className="animate-fade-in space-y-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Preview & Export</h2>
              <p className="text-zinc-400">
                Reorder frames, toggle them on/off, then export.
              </p>
            </div>

            <FrameEditor brand={brandData} onFramesReady={handleFramesReady} />

            {renderedCanvases.length > 0 && (
              <div className="pt-6 border-t border-zinc-800">
                <h3 className="text-lg font-semibold text-center mb-6">
                  Export
                </h3>
                <ExportPanel
                  canvases={renderedCanvases}
                  delays={frameDelays}
                  brandName={brandData.brand_name}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
