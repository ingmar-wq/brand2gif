export interface Mp4EncoderOptions {
  frames: HTMLCanvasElement[];
  delays: number[];
  onProgress?: (progress: number) => void;
}

export async function encodeMp4({
  frames,
  delays,
  onProgress,
}: Mp4EncoderOptions): Promise<Blob> {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { fetchFile } = await import("@ffmpeg/util");

  const ffmpeg = new FFmpeg();

  ffmpeg.on("progress", ({ progress }) => {
    onProgress?.(progress);
  });

  await ffmpeg.load({
    coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js",
    wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm",
  });

  // Write frames as PNG
  for (let i = 0; i < frames.length; i++) {
    const blob = await new Promise<Blob>((resolve) => {
      frames[i].toBlob((b) => resolve(b!), "image/png");
    });
    const data = await fetchFile(blob);
    await ffmpeg.writeFile(`frame${String(i).padStart(4, "0")}.png`, data);
  }

  // Create a concat file with durations
  let concatContent = "";
  for (let i = 0; i < frames.length; i++) {
    const duration = (delays[i] || 400) / 1000;
    concatContent += `file 'frame${String(i).padStart(4, "0")}.png'\n`;
    concatContent += `duration ${duration}\n`;
  }
  // Repeat last frame for proper ending
  concatContent += `file 'frame${String(frames.length - 1).padStart(4, "0")}.png'\n`;

  await ffmpeg.writeFile(
    "concat.txt",
    new TextEncoder().encode(concatContent)
  );

  // Run ffmpeg
  await ffmpeg.exec([
    "-f", "concat",
    "-safe", "0",
    "-i", "concat.txt",
    "-vf", "scale=1080:1080",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "fast",
    "output.mp4",
  ]);

  const data = await ffmpeg.readFile("output.mp4");
  const blob = new Blob([data as BlobPart], { type: "video/mp4" });

  return blob;
}
