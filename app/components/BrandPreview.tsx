"use client";

import { BrandData, BrandColor } from "@/lib/brand-schema";
import { useState } from "react";

interface BrandPreviewProps {
  brand: BrandData;
  onUpdate: (brand: BrandData) => void;
}

function ColorSwatch({
  color,
  onChange,
}: {
  color: BrandColor;
  onChange: (color: BrandColor) => void;
}) {
  return (
    <div className="flex items-center gap-2 group">
      <input
        type="color"
        value={color.hex}
        onChange={(e) => onChange({ ...color, hex: e.target.value })}
        className="w-10 h-10 rounded-lg border border-zinc-700 cursor-pointer bg-transparent"
      />
      <div className="flex flex-col">
        <input
          type="text"
          value={color.name}
          onChange={(e) => onChange({ ...color, name: e.target.value })}
          className="text-sm text-zinc-300 bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-violet-500 outline-none px-1 py-0.5 w-32"
        />
        <span className="text-xs text-zinc-500 font-mono px-1">
          {color.hex.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

function ColorGroup({
  label,
  colors,
  onChange,
}: {
  label: string;
  colors: BrandColor[];
  onChange: (colors: BrandColor[]) => void;
}) {
  return (
    <div>
      <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
        {label}
      </h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((color, i) => (
          <ColorSwatch
            key={i}
            color={color}
            onChange={(updated) => {
              const newColors = [...colors];
              newColors[i] = updated;
              onChange(newColors);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function BrandPreview({ brand, onUpdate }: BrandPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateColors = (
    key: keyof BrandData["colors"],
    colors: BrandColor[]
  ) => {
    onUpdate({
      ...brand,
      colors: { ...brand.colors, [key]: colors },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header card */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <input
              type="text"
              value={brand.brand_name}
              onChange={(e) =>
                onUpdate({ ...brand, brand_name: e.target.value })
              }
              className="text-3xl font-bold text-white bg-transparent border-b-2 border-transparent hover:border-zinc-600 focus:border-violet-500 outline-none"
            />
            {brand.tagline !== null && (
              <input
                type="text"
                value={brand.tagline || ""}
                onChange={(e) =>
                  onUpdate({ ...brand, tagline: e.target.value || null })
                }
                placeholder="Tagline..."
                className="block mt-2 text-lg text-zinc-400 bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-violet-500 outline-none w-full"
              />
            )}
          </div>
          <div className="flex gap-2">
            {brand.visual_style.keywords.map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Color swatches strip */}
        <div className="flex gap-2 mt-6">
          {[
            ...brand.colors.primary,
            ...brand.colors.secondary,
            ...brand.colors.accent,
          ].map((color, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-lg border border-zinc-700 transition-transform hover:scale-110"
              style={{ backgroundColor: color.hex }}
              title={`${color.name} (${color.hex})`}
            />
          ))}
        </div>

        {/* Typography preview */}
        <div className="mt-6 flex items-baseline gap-6">
          <span className="text-zinc-500 text-sm">Primary Font:</span>
          <span className="text-xl text-white">
            {brand.typography.primary_font}
          </span>
          {brand.typography.secondary_font && (
            <>
              <span className="text-zinc-500 text-sm">Secondary:</span>
              <span className="text-lg text-zinc-300">
                {brand.typography.secondary_font}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Expandable edit section */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        {isExpanded ? "Hide" : "Edit"} brand details
      </button>

      {isExpanded && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Colors */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">
              Colors
            </h3>
            <div className="space-y-4">
              <ColorGroup
                label="Primary"
                colors={brand.colors.primary}
                onChange={(c) => updateColors("primary", c)}
              />
              <ColorGroup
                label="Secondary"
                colors={brand.colors.secondary}
                onChange={(c) => updateColors("secondary", c)}
              />
              <ColorGroup
                label="Accent"
                colors={brand.colors.accent}
                onChange={(c) => updateColors("accent", c)}
              />
              <ColorGroup
                label="Neutral"
                colors={brand.colors.neutral}
                onChange={(c) => updateColors("neutral", c)}
              />
            </div>
          </div>

          {/* Typography */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">
              Typography
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500">Primary Font</label>
                <input
                  type="text"
                  value={brand.typography.primary_font}
                  onChange={(e) =>
                    onUpdate({
                      ...brand,
                      typography: {
                        ...brand.typography,
                        primary_font: e.target.value,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Secondary Font</label>
                <input
                  type="text"
                  value={brand.typography.secondary_font || ""}
                  onChange={(e) =>
                    onUpdate({
                      ...brand,
                      typography: {
                        ...brand.typography,
                        secondary_font: e.target.value || null,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Logo description */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">
              Logo Description
            </h3>
            <textarea
              value={brand.logo.description}
              onChange={(e) =>
                onUpdate({
                  ...brand,
                  logo: { ...brand.logo, description: e.target.value },
                })
              }
              rows={3}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm outline-none focus:border-violet-500 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
