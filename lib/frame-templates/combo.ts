import { BrandData } from "../brand-schema";

function getContrastColor(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "#FFFFFF";
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export function renderComboA(
  ctx: CanvasRenderingContext2D,
  brand: BrandData
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  // Secondary color background
  const bgColor = brand.colors.secondary[0]?.hex || brand.colors.primary[0]?.hex || "#2d3436";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  // Decorative accent bar at top
  const accentColor = brand.colors.accent[0]?.hex || brand.colors.primary[0]?.hex || "#6c5ce7";
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 0, w, 8);

  // Brand name
  const textColor = getContrastColor(bgColor);
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(w * 0.1)}px "${brand.typography.primary_font}", "Inter", sans-serif`;
  ctx.fillText(brand.brand_name, w / 2, h / 2);

  // Subtle bottom accent
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, h - 8, w, 8);
}

export function renderComboB(
  ctx: CanvasRenderingContext2D,
  brand: BrandData
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  // Primary color background
  const bgColor = brand.colors.primary[0]?.hex || "#333333";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  const textColor = getContrastColor(bgColor);
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const displayText = brand.tagline || brand.visual_style.keywords.join(" · ");
  const fontFamily = brand.typography.secondary_font || brand.typography.primary_font || "Inter";

  ctx.font = `400 ${Math.round(w * 0.05)}px "${fontFamily}", "Inter", sans-serif`;
  ctx.fillText(displayText, w / 2, h / 2);

  // Small brand name at bottom
  ctx.globalAlpha = 0.5;
  ctx.font = `500 20px "${brand.typography.primary_font}", "Inter", sans-serif`;
  ctx.fillText(brand.brand_name, w / 2, h - 80);
  ctx.globalAlpha = 1;
}
