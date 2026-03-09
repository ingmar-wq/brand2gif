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

export function renderTypography(
  ctx: CanvasRenderingContext2D,
  brand: BrandData
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const primaryColor = brand.colors.primary[0]?.hex || "#333333";

  // Background
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, w, h);

  const textColor = getContrastColor(primaryColor);
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";

  const fontName = brand.typography.primary_font || "Inter";

  // Font name large
  ctx.font = `700 72px "${fontName}", "Inter", sans-serif`;
  ctx.fillText(fontName.toUpperCase(), w / 2, 200);

  // Divider line
  ctx.strokeStyle = textColor;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w * 0.2, 250);
  ctx.lineTo(w * 0.8, 250);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Alphabet sample
  ctx.font = `400 56px "${fontName}", "Inter", sans-serif`;
  ctx.fillText("Aa Bb Cc Dd Ee Ff", w / 2, 350);

  // Numbers
  ctx.font = `400 48px "${fontName}", "Inter", sans-serif`;
  ctx.fillText("0 1 2 3 4 5 6 7 8 9", w / 2, 460);

  // Weights
  ctx.globalAlpha = 0.6;
  ctx.font = '400 24px "Inter", sans-serif';
  const weightsText = brand.typography.weights.join("  ·  ");
  ctx.fillText(weightsText, w / 2, 580);
  ctx.globalAlpha = 1;

  // Secondary font if available
  if (brand.typography.secondary_font) {
    ctx.globalAlpha = 0.5;
    ctx.font = `400 20px "Inter", sans-serif`;
    ctx.fillText(
      `Secondary: ${brand.typography.secondary_font}`,
      w / 2,
      h - 100
    );
    ctx.globalAlpha = 1;
  }

  // Size info
  ctx.globalAlpha = 0.4;
  ctx.font = '400 16px "SF Mono", "Fira Code", monospace';
  ctx.fillText(
    `Display: ${brand.typography.display_size}  ·  Body: ${brand.typography.body_size}`,
    w / 2,
    h - 60
  );
  ctx.globalAlpha = 1;
}
