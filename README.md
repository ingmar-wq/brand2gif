# brand2gif

**Brand Guide → Animated Showcase**

Upload a brand guide PDF and let AI automatically extract the core design elements (colors, typography, visual style) and generate an animated brand showcase. Export as GIF, Instagram carousel (PNG slides in a ZIP), or MP4 video.

Built for design studios and brand teams who need quick, shareable brand showcases.

![brand2gif screenshot](screenshot-placeholder.png)

## How it works

1. **Upload** — Drag & drop a brand guide PDF
2. **Analyze** — Google Gemini AI reads the PDF and extracts brand elements (colors, fonts, logo description, visual style)
3. **Preview** — Review and fine-tune the extracted brand data
4. **Generate** — The app creates animated frames on an HTML5 Canvas (9 frames including color backgrounds, logo reveals, color palettes, typography showcases, and more)
5. **Export** — Download as GIF, Instagram carousel (ZIP with PNG slides), or MP4 video

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new API key (it's free!)
4. Free tier includes: 15 requests/minute, 1M tokens/day

## Local Development

```bash
# Clone the repo
git clone <your-repo-url>
cd brand2gif

# Install dependencies
npm install

# Create your environment file
cp .env.local.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add `GEMINI_API_KEY` as an environment variable in the Vercel dashboard
4. Deploy!

The API route runs as a serverless function with a 30-second timeout (enough for Gemini to process the PDF). All canvas rendering and encoding runs client-side in the browser — no heavy server compute needed.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (dark mode)
- **AI**: Google Gemini 2.0 Flash (free tier)
- **Canvas**: HTML5 Canvas (browser-side rendering)
- **GIF Encoding**: gif.js (web worker)
- **MP4 Encoding**: @ffmpeg/ffmpeg (WebAssembly)
- **PDF Preview**: pdfjs-dist
- **ZIP**: JSZip

## Limitations

- **Font matching is approximate** — The app tries to load fonts from Google Fonts. If the brand uses proprietary fonts, it falls back to system fonts (Inter, sans-serif).
- **Logo is described, not extracted** — Gemini describes the logo in text but cannot extract the actual vector/image. The frames use the brand name text as a stand-in.
- **MP4 export requires COOP/COEP headers** — These are configured in `next.config.mjs` for ffmpeg.wasm to work with SharedArrayBuffer.
- **Maximum PDF size is 20MB** — Larger files are rejected by the upload handler.

## Demo Mode

Click "Try with example data" on the upload screen to load a fictional brand ("Lumina Studio") and see the full flow without uploading a PDF or needing an API key.
