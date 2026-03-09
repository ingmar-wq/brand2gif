import GIF from "gif.js";

export interface GifEncoderOptions {
  frames: HTMLCanvasElement[];
  delays: number[];
  onProgress?: (progress: number) => void;
}

export async function encodeGif({
  frames,
  delays,
  onProgress,
}: GifEncoderOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: frames[0].width,
      height: frames[0].height,
      workerScript: "/gif.worker.js",
      repeat: 0, // infinite loop
    });

    frames.forEach((canvas, i) => {
      gif.addFrame(canvas, { delay: delays[i] || 400, copy: true });
    });

    gif.on("progress", (p: number) => {
      onProgress?.(p);
    });

    gif.on("finished", (blob: Blob) => {
      resolve(blob);
    });

    try {
      gif.render();
    } catch (err) {
      reject(err);
    }
  });
}
