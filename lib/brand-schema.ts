export interface BrandColor {
  hex: string;
  name: string;
}

export interface BrandData {
  brand_name: string;
  tagline: string | null;
  colors: {
    primary: BrandColor[];
    secondary: BrandColor[];
    accent: BrandColor[];
    neutral: BrandColor[];
  };
  typography: {
    primary_font: string;
    secondary_font: string | null;
    weights: string[];
    display_size: string;
    body_size: string;
  };
  logo: {
    description: string;
    has_icon: boolean;
    has_wordmark: boolean;
    preferred_background: string;
  };
  visual_style: {
    keywords: string[];
    patterns: string[];
    illustration_style: string | null;
    shape_language: string;
  };
}

export const DEMO_BRAND_DATA: BrandData = {
  brand_name: "Lumina Studio",
  tagline: "Design that illuminates",
  colors: {
    primary: [
      { hex: "#6C5CE7", name: "Electric Violet" },
      { hex: "#0F0A1E", name: "Deep Night" },
    ],
    secondary: [
      { hex: "#A29BFE", name: "Soft Lavender" },
      { hex: "#FD79A8", name: "Pink Accent" },
    ],
    accent: [
      { hex: "#FFEAA7", name: "Warm Gold" },
      { hex: "#00CEC9", name: "Teal Spark" },
    ],
    neutral: [
      { hex: "#FFFFFF", name: "White" },
      { hex: "#DFE6E9", name: "Light Gray" },
      { hex: "#636E72", name: "Medium Gray" },
      { hex: "#2D3436", name: "Charcoal" },
    ],
  },
  typography: {
    primary_font: "Space Grotesk",
    secondary_font: "Inter",
    weights: ["Regular", "Medium", "Bold"],
    display_size: "48px",
    body_size: "16px",
  },
  logo: {
    description:
      "A geometric star shape composed of overlapping triangles in Electric Violet, with the wordmark 'LUMINA' in Space Grotesk Bold to the right.",
    has_icon: true,
    has_wordmark: true,
    preferred_background: "#0F0A1E",
  },
  visual_style: {
    keywords: ["modern", "bold", "geometric", "vibrant"],
    patterns: ["Geometric grid patterns", "Gradient overlays"],
    illustration_style: "Flat geometric with bold colors",
    shape_language: "Angular, geometric, sharp edges",
  },
};
