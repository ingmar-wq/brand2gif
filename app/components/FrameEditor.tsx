"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BrandData } from "@/lib/brand-schema";
import { FrameTemplate, getDefaultFrames } from "@/lib/frame-templates";
import CanvasRenderer from "./CanvasRenderer";

interface FrameEditorProps {
  brand: BrandData;
  onFramesReady: (canvases: HTMLCanvasElement[], delays: number[]) => void;
}

interface FrameState {
  template: FrameTemplate;
  enabled: boolean;
  delay: number; // ms
}

export default function FrameEditor({ brand, onFramesReady }: FrameEditorProps) {
  const [frameStates, setFrameStates] = useState<FrameState[]>(() =>
    getDefaultFrames().map((t) => ({
      template: t,
      enabled: true,
      delay: t.id.startsWith("logo-reveal") ? 250 : 400,
    }))
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(400); // base delay ms
  const [, setRenderedCanvases] = useState<HTMLCanvasElement[]>([]);
  const animFrameRef = useRef<number>();
  const lastTickRef = useRef<number>(0);

  const enabledFrames = frameStates.filter((f) => f.enabled);
  const enabledTemplates = enabledFrames.map((f) => f.template);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || enabledFrames.length === 0) return;

    const animate = (timestamp: number) => {
      if (!lastTickRef.current) lastTickRef.current = timestamp;

      const currentDelay = enabledFrames[activeIndex]?.delay || speed;
      if (timestamp - lastTickRef.current >= currentDelay) {
        lastTickRef.current = timestamp;
        setActiveIndex((prev) => (prev + 1) % enabledFrames.length);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, activeIndex, enabledFrames, speed]);

  // Update delays when speed slider changes
  useEffect(() => {
    setFrameStates((prev) =>
      prev.map((f) => ({
        ...f,
        delay: f.template.id.startsWith("logo-reveal")
          ? Math.round(speed * 0.625)
          : speed,
      }))
    );
  }, [speed]);

  const handleFramesRendered = useCallback(
    (canvases: HTMLCanvasElement[]) => {
      setRenderedCanvases(canvases);
      const delays = enabledFrames.map((f) => f.delay);
      onFramesReady(canvases, delays);
    },
    [enabledFrames, onFramesReady]
  );

  const toggleFrame = (index: number) => {
    setFrameStates((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], enabled: !next[index].enabled };
      return next;
    });
    setActiveIndex(0);
  };

  const moveFrame = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= frameStates.length) return;

    setFrameStates((prev) => {
      const next = [...prev];
      [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
      return next;
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Preview */}
      <CanvasRenderer
        brand={brand}
        frames={enabledTemplates}
        activeFrameIndex={activeIndex}
        onFramesRendered={handleFramesRendered}
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-white transition-colors"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
          {isPlaying ? "Pause" : "Play"}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Speed</span>
          <input
            type="range"
            min={200}
            max={800}
            step={50}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32 accent-violet-500"
          />
          <span className="text-xs text-zinc-500 font-mono w-14">
            {speed}ms
          </span>
        </div>
      </div>

      {/* Frame list */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-3">
          Frames ({enabledFrames.length} active)
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {frameStates.map((frame, i) => (
            <div
              key={frame.template.id}
              className={`
                flex-shrink-0 w-32 rounded-xl border-2 overflow-hidden transition-all cursor-pointer
                ${!frame.enabled ? "opacity-40 border-zinc-800" : "border-zinc-700 hover:border-violet-500"}
                ${enabledFrames.indexOf(frame) === activeIndex && frame.enabled ? "border-violet-500 ring-2 ring-violet-500/30" : ""}
              `}
              onClick={() => {
                if (frame.enabled) {
                  const enabledIdx = enabledFrames.indexOf(frame);
                  if (enabledIdx >= 0) {
                    setActiveIndex(enabledIdx);
                    setIsPlaying(false);
                  }
                }
              }}
            >
              {/* Mini preview canvas */}
              <MiniPreview
                brand={brand}
                template={frame.template}
                size={128}
              />
              <div className="p-2 bg-zinc-900/90">
                <p className="text-xs text-zinc-400 truncate">
                  {frame.template.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFrame(i);
                    }}
                    className={`text-xs px-1.5 py-0.5 rounded ${frame.enabled ? "bg-violet-500/20 text-violet-400" : "bg-zinc-800 text-zinc-500"}`}
                  >
                    {frame.enabled ? "ON" : "OFF"}
                  </button>
                  <div className="flex gap-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveFrame(i, "up");
                      }}
                      className="text-zinc-600 hover:text-zinc-300 text-xs p-0.5"
                      disabled={i === 0}
                    >
                      ←
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveFrame(i, "down");
                      }}
                      className="text-zinc-600 hover:text-zinc-300 text-xs p-0.5"
                      disabled={i === frameStates.length - 1}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mini preview component
function MiniPreview({
  brand,
  template,
  size,
}: {
  brand: BrandData;
  template: FrameTemplate;
  size: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Render at full resolution then display small
    const offscreen = document.createElement("canvas");
    offscreen.width = 1080;
    offscreen.height = 1080;
    const offCtx = offscreen.getContext("2d")!;
    template.render(offCtx, brand, 0);

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(offscreen, 0, 0, size, size);
  }, [brand, template, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="w-full aspect-square"
    />
  );
}
