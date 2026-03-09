import { BrandData } from "../brand-schema";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function adjustBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const adjust = (v: number) =>
    Math.min(255, Math.max(0, Math.round(v + (255 * percent) / 100)));
  return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`;
}

function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export function renderColorBackground(
  ctx: CanvasRenderingContext2D,
  brand: BrandData
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const primaryColor = brand.colors.primary[0]?.hex || "#333333";

  // Diagonal gradient
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, adjustBrightness(primaryColor, 10));
  gradient.addColorStop(1, adjustBrightness(primaryColor, -10));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Brand name bottom-right
  const textColor = getContrastColor(primaryColor);
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.7;
  ctx.font = `500 24px "${brand.typography.primary_font}", "Inter", sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(brand.brand_name, w - 60, h - 50);
  ctx.globalAlpha = 1;
}
