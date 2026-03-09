import { BrandData, BrandColor } from "../brand-schema";

function getContrastColor(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "#FFFFFF";
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export function renderColorPalette(
  ctx: CanvasRenderingContext2D,
  brand: BrandData
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  // Collect all colors
  const allColors: BrandColor[] = [
    ...brand.colors.primary,
    ...brand.colors.secondary,
    ...brand.colors.accent,
  ];

  // Determine if dark or light brand
  const primaryHex = brand.colors.primary[0]?.hex || "#333333";
  const bgIsLight = getContrastColor(primaryHex) === "#000000";
  ctx.fillStyle = bgIsLight ? "#FFFFFF" : "#111111";
  ctx.fillRect(0, 0, w, h);

  // Title
  const titleColor = bgIsLight ? "#000000" : "#FFFFFF";
  ctx.fillStyle = titleColor;
  ctx.font = `700 36px "${brand.typography.primary_font}", "Inter", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("Color Palette", w / 2, 80);

  // Grid layout
  const padding = 60;
  const spacing = 20;
  const cols = Math.min(allColors.length, 4);
  const rows = Math.ceil(allColors.length / cols);
  const availW = w - padding * 2 - spacing * (cols - 1);
  const availH = h - 140 - padding - spacing * (rows - 1);
  const cellW = Math.floor(availW / cols);
  const cellH = Math.min(cellW, Math.floor(availH / rows));

  const startX = (w - (cols * cellW + (cols - 1) * spacing)) / 2;
  const startY = 120;

  allColors.forEach((color, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * (cellW + spacing);
    const y = startY + row * (cellH + spacing);

    // Color block with rounded corners
    ctx.beginPath();
    const radius = 12;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + cellW - radius, y);
    ctx.quadraticCurveTo(x + cellW, y, x + cellW, y + radius);
    ctx.lineTo(x + cellW, y + cellH - radius);
    ctx.quadraticCurveTo(x + cellW, y + cellH, x + cellW - radius, y + cellH);
    ctx.lineTo(x + radius, y + cellH);
    ctx.quadraticCurveTo(x, y + cellH, x, y + cellH - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = color.hex;
    ctx.fill();

    // Hex code inside block
    const contrast = getContrastColor(color.hex);
    ctx.fillStyle = contrast;
    ctx.font = '500 18px "SF Mono", "Fira Code", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(color.hex.toUpperCase(), x + cellW / 2, y + cellH / 2 - 12);

    // Color name
    ctx.font = '400 14px "Inter", sans-serif';
    ctx.fillText(color.name, x + cellW / 2, y + cellH / 2 + 14);
  });
}
