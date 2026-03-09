"use client";

import { useState } from "react";
import ProgressBar from "./ProgressBar";

interface ExportPanelProps {
  canvases: HTMLCanvasElement[];
  delays: number[];
  brandName: string;
}

type ExportFormat = "gif" | "carousel" | "mp4";

export default function ExportPanel({
  canvases,
  delays,
  brandName,
}: ExportPanelProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const slug = brandName.toLowerCase().replace(/\s+/g, "-");

  const handleExport = async (format: ExportFormat) => {
    if (canvases.length === 0) return;

    setExporting(format);
    setProgress(0);
    setDownloadUrl(null);
    setError(null);

    try {
      let blob: Blob;
      let filename: string;

      switch (format) {
        case "gif": {
          const { encodeGif } = await import("@/lib/gif-encoder");
          blob = await encodeGif({
            frames: canvases,
            delays,
            onProgress: setProgress,
          });
          filename = `${slug}-brand.gif`;
          break;
        }
        case "carousel": {
          const { exportCarousel } = await import("@/lib/carousel-export");
          blob = await exportCarousel({
            frames: canvases,
            brandName,
            onProgress: setProgress,
          });
          filename = `${slug}-carousel.zip`;
          break;
        }
        case "mp4": {
          const { encodeMp4 } = await import("@/lib/mp4-encoder");
          blob = await encodeMp4({
            frames: canvases,
            delays,
            onProgress: setProgress,
          });
          filename = `${slug}-brand.mp4`;
          break;
        }
      }

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(filename);
      setProgress(1);
    } catch (err) {
      console.error("Export error:", err);
      setError(
        `Export failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setExporting(null);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadName;
    a.click();
  };

  const disabled = canvases.length === 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <button
          onClick={() => handleExport("gif")}
          disabled={disabled || exporting !== null}
          className="flex-1 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-medium transition-colors text-sm"
        >
          {exporting === "gif" ? "Encoding..." : "GIF"}
        </button>
        <button
          onClick={() => handleExport("carousel")}
          disabled={disabled || exporting !== null}
          className="flex-1 py-3 px-4 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-medium transition-colors text-sm"
        >
          {exporting === "carousel" ? "Packaging..." : "Instagram Carousel"}
        </button>
        <button
          onClick={() => handleExport("mp4")}
          disabled={disabled || exporting !== null}
          className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-medium transition-colors text-sm"
        >
          {exporting === "mp4" ? "Encoding..." : "MP4 Video"}
        </button>
      </div>

      {exporting && (
        <div className="mt-4">
          <ProgressBar
            progress={progress}
            label={`Exporting ${exporting.toUpperCase()}...`}
          />
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {downloadUrl && !exporting && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download {downloadName}
          </button>
        </div>
      )}
    </div>
  );
}
