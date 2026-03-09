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

export function renderLogoRevealA(
  ctx: CanvasRenderingContext2D,
  brand: BrandData
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  // Background: second most prominent color
  const bgColor =
    brand.colors.primary[1]?.hex ||
    brand.colors.secondary[0]?.hex ||
    "#1a1a2e";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  // Brand name at 60% scale, centered
  const textColor = getContrastColor(bgColor);
  ctx.fillStyle = textColor;
  const fontSize = Math.round(w * 0.08);
  ctx.font = `400 ${fontSize}px "${brand.typography.primary_font}", "Inter", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(brand.brand_name, w / 2, h / 2);
}

export function renderLogoRevealB(
  ctx: CanvasRenderingContext2D,
  brand: BrandData
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  const bgColor =
    brand.colors.primary[1]?.hex ||
    brand.colors.secondary[0]?.hex ||
    "#1a1a2e";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  // Brand name at 100% scale, bold
  const textColor = getContrastColor(bgColor);
  ctx.fillStyle = textColor;
  const fontSize = Math.round(w * 0.13);
  ctx.font = `700 ${fontSize}px "${brand.typography.primary_font}", "Inter", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(brand.brand_name, w / 2, h / 2);
}
