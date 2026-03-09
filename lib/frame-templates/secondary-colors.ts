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

export function renderSecondaryColors(
  ctx: CanvasRenderingContext2D,
  brand: BrandData
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  const colors = [
    ...brand.colors.secondary,
    ...brand.colors.accent,
  ].filter(Boolean);

  if (colors.length === 0) {
    // Fallback: use primary colors
    colors.push(...brand.colors.primary);
  }

  const count = Math.min(colors.length, 4);

  // Draw diagonal split sections
  for (let i = 0; i < count; i++) {
    const color = colors[i];
    ctx.save();
    ctx.beginPath();

    // Create diagonal slices
    const sliceWidth = w / count;
    const skew = 60; // pixels of diagonal offset

    ctx.moveTo(i * sliceWidth - skew, 0);
    ctx.lineTo((i + 1) * sliceWidth - skew, 0);
    ctx.lineTo((i + 1) * sliceWidth + skew, h);
    ctx.lineTo(i * sliceWidth + skew, h);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = color.hex;
    ctx.fillRect(0, 0, w, h);

    // Color name label
    const textColor = getContrastColor(color.hex);
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.85;
    ctx.font = '600 18px "Inter", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const centerX = i * sliceWidth + sliceWidth / 2;
    ctx.fillText(color.name, centerX, h / 2 - 16);

    ctx.font = '400 14px "SF Mono", "Fira Code", monospace';
    ctx.fillText(color.hex.toUpperCase(), centerX, h / 2 + 16);

    ctx.restore();
  }
}
