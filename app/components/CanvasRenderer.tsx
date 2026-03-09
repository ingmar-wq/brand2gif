"use client";

import { useEffect, useRef, useCallback } from "react";
import { BrandData } from "@/lib/brand-schema";
import { FrameTemplate } from "@/lib/frame-templates";

const FRAME_SIZE = 1080;

interface CanvasRendererProps {
  brand: BrandData;
  frames: FrameTemplate[];
  activeFrameIndex: number;
  onFramesRendered: (canvases: HTMLCanvasElement[]) => void;
}

async function loadGoogleFont(fontName: string): Promise<void> {
  if (!fontName) return;

  try {
    // Check if font is already loaded
    if (document.fonts.check(`16px "${fontName}"`)) return;

    // Try loading from Google Fonts CSS API
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700&display=swap`;
    const link = document.createElement("link");
    link.href = url;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Wait for font to be available
    await document.fonts.ready;

    // Give it a moment to register
    await new Promise((r) => setTimeout(r, 100));
  } catch {
    console.warn(`Font "${fontName}" not available, using fallback`);
  }
}

export default function CanvasRenderer({
  brand,
  frames,
  activeFrameIndex,
  onFramesRendered,
}: CanvasRendererProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const renderedFramesRef = useRef<HTMLCanvasElement[]>([]);

  const renderAllFrames = useCallback(async () => {
    // Load fonts first
    await loadGoogleFont(brand.typography.primary_font);
    if (brand.typography.secondary_font) {
      await loadGoogleFont(brand.typography.secondary_font);
    }

    const canvases: HTMLCanvasElement[] = [];

    for (const frame of frames) {
      const canvas = document.createElement("canvas");
      canvas.width = FRAME_SIZE;
      canvas.height = FRAME_SIZE;
      const ctx = canvas.getContext("2d")!;

      // Clear
      ctx.clearRect(0, 0, FRAME_SIZE, FRAME_SIZE);

      // Render frame
      frame.render(ctx, brand, 0);

      canvases.push(canvas);
    }

    renderedFramesRef.current = canvases;
    onFramesRendered(canvases);

    // Show active frame on preview
    drawPreview(activeFrameIndex);
  }, [brand, frames, onFramesRendered, activeFrameIndex]);

  const drawPreview = useCallback(
    (index: number) => {
      const previewCanvas = previewCanvasRef.current;
      const source = renderedFramesRef.current[index];
      if (!previewCanvas || !source) return;

      const ctx = previewCanvas.getContext("2d")!;
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      ctx.drawImage(
        source,
        0,
        0,
        previewCanvas.width,
        previewCanvas.height
      );
    },
    []
  );

  useEffect(() => {
    renderAllFrames();
  }, [renderAllFrames]);

  useEffect(() => {
    drawPreview(activeFrameIndex);
  }, [activeFrameIndex, drawPreview]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={previewCanvasRef}
        width={540}
        height={540}
        className="rounded-xl border border-zinc-700 shadow-2xl max-w-full"
        style={{ imageRendering: "auto" }}
      />
    </div>
  );
}
