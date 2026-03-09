import JSZip from "jszip";

export interface CarouselExportOptions {
  frames: HTMLCanvasElement[];
  brandName: string;
  onProgress?: (progress: number) => void;
}

export async function exportCarousel({
  frames,
  brandName,
  onProgress,
}: CarouselExportOptions): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder(
    `${brandName.toLowerCase().replace(/\s+/g, "-")}-carousel`
  )!;

  for (let i = 0; i < frames.length; i++) {
    const blob = await new Promise<Blob>((resolve) => {
      frames[i].toBlob((b) => resolve(b!), "image/png");
    });
    const arrayBuffer = await blob.arrayBuffer();
    folder.file(`slide-${String(i + 1).padStart(2, "0")}.png`, arrayBuffer);
    onProgress?.((i + 1) / frames.length);
  }

  return zip.generateAsync({ type: "blob" });
}
