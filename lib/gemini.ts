import { GoogleGenerativeAI } from "@google/generative-ai";

const PROMPT = `Je bent een expert brand designer. Analyseer deze brand guide PDF en extraheer ALLE visuele brand elementen.

Reageer UITSLUITEND met valide JSON (geen markdown, geen backticks, geen toelichting):

{
  "brand_name": "string",
  "tagline": "string of null",
  "colors": {
    "primary": [{"hex": "#XXXXXX", "name": "string"}],
    "secondary": [{"hex": "#XXXXXX", "name": "string"}],
    "accent": [{"hex": "#XXXXXX", "name": "string"}],
    "neutral": [{"hex": "#XXXXXX", "name": "string"}]
  },
  "typography": {
    "primary_font": "string (font family naam)",
    "secondary_font": "string of null",
    "weights": ["Regular", "Bold"],
    "display_size": "string (bijv '48px')",
    "body_size": "string (bijv '16px')"
  },
  "logo": {
    "description": "string (gedetailleerde beschrijving van het logo)",
    "has_icon": true/false,
    "has_wordmark": true/false,
    "preferred_background": "#XXXXXX"
  },
  "visual_style": {
    "keywords": ["modern", "bold", "minimal"],
    "patterns": ["beschrijving van patronen of texturen"],
    "illustration_style": "string of null",
    "shape_language": "string (bijv 'rounded corners', 'geometric', 'organic')"
  }
}

Zorg ervoor dat:
- Alle hex kleuren geldig zijn (6 karakters, met #)
- Je minstens 1 primary kleur extraheert
- Font namen exact overeenkomen met gangbare font namen
- Als je iets niet kunt vinden, gebruik dan redelijke defaults`;

export async function analyzePDF(
  base64Data: string,
  apiKey: string
) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "application/pdf",
        data: base64Data,
      },
    },
    { text: PROMPT },
  ]);

  const text = result.response.text();
  const clean = text.replace(/```json\n?|```\n?/g, "").trim();
  return JSON.parse(clean);
}
