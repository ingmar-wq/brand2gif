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

function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0,0,0,${alpha})`;
  return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})`;
}

export function renderCloser(
  ctx: CanvasRenderingContext2D,
  brand: BrandData
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  // Background
  const bgColor = brand.logo.preferred_background || brand.colors.primary[0]?.hex || "#111111";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  const textColor = getContrastColor(bgColor);

  // Decorative elements using brand colors
  const decoColors = [
    ...brand.colors.accent,
    ...brand.colors.secondary,
    ...brand.colors.primary,
  ];

  // Small decorative circles
  decoColors.slice(0, 5).forEach((color, i) => {
    ctx.fillStyle = hexToRgba(color.hex, 0.15);
    const size = 80 + i * 40;
    const angle = (i / 5) * Math.PI * 2;
    const cx = w / 2 + Math.cos(angle) * 200;
    const cy = h / 2 + Math.sin(angle) * 200;
    ctx.beginPath();
    ctx.arc(cx, cy, size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Corner accents
  const accentColor = decoColors[0]?.hex || "#6c5ce7";
  ctx.fillStyle = hexToRgba(accentColor, 0.3);
  ctx.fillRect(0, 0, 4, 120);
  ctx.fillRect(0, 0, 120, 4);
  ctx.fillRect(w - 4, h - 120, 4, 120);
  ctx.fillRect(w - 120, h - 4, 120, 4);

  // Brand name centered
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(w * 0.1)}px "${brand.typography.primary_font}", "Inter", sans-serif`;
  ctx.fillText(brand.brand_name, w / 2, h / 2 - 20);

  // Tagline or "Brand Guide"
  ctx.globalAlpha = 0.6;
  ctx.font = `400 28px "${brand.typography.secondary_font || brand.typography.primary_font}", "Inter", sans-serif`;
  ctx.fillText(brand.tagline || "Brand Guide", w / 2, h / 2 + 50);
  ctx.globalAlpha = 1;

  // Footer
  ctx.globalAlpha = 0.3;
  ctx.font = '400 14px "Inter", sans-serif';
  ctx.fillText("Generated with brand2gif", w / 2, h - 40);
  ctx.globalAlpha = 1;
}
