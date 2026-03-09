import { BrandData } from "../brand-schema";
import { renderColorBackground } from "./color-background";
import { renderLogoRevealA, renderLogoRevealB } from "./logo-reveal";
import { renderColorPalette } from "./color-palette";
import { renderTypography } from "./typography";
import { renderSecondaryColors } from "./secondary-colors";
import { renderComboA, renderComboB } from "./combo";
import { renderCloser } from "./closer";

export type FrameRenderer = (
  ctx: CanvasRenderingContext2D,
  brand: BrandData,
  frameIndex: number
) => void;

export interface FrameTemplate {
  id: string;
  name: string;
  render: FrameRenderer;
}

export function getDefaultFrames(): FrameTemplate[] {
  return [
    {
      id: "color-background",
      name: "Brand Color",
      render: (ctx, brand) => renderColorBackground(ctx, brand),
    },
    {
      id: "logo-reveal-a",
      name: "Logo Reveal (Small)",
      render: (ctx, brand) => renderLogoRevealA(ctx, brand),
    },
    {
      id: "logo-reveal-b",
      name: "Logo Reveal (Large)",
      render: (ctx, brand) => renderLogoRevealB(ctx, brand),
    },
    {
      id: "color-palette",
      name: "Color Palette",
      render: (ctx, brand) => renderColorPalette(ctx, brand),
    },
    {
      id: "typography",
      name: "Typography",
      render: (ctx, brand) => renderTypography(ctx, brand),
    },
    {
      id: "secondary-colors",
      name: "Secondary Colors",
      render: (ctx, brand) => renderSecondaryColors(ctx, brand),
    },
    {
      id: "combo-a",
      name: "Brand + Color",
      render: (ctx, brand) => renderComboA(ctx, brand),
    },
    {
      id: "combo-b",
      name: "Tagline",
      render: (ctx, brand) => renderComboB(ctx, brand),
    },
    {
      id: "closer",
      name: "Closer",
      render: (ctx, brand) => renderCloser(ctx, brand),
    },
  ];
}
