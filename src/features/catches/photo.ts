/**
 * Client-side photo handling for catch logs. There's no backend in this build, so a
 * photo is stored as a data: URL inside the persisted CatchLog record itself. To keep
 * localStorage usage sane (data: URLs are ~33% bigger than the raw bytes, and phone
 * camera photos can be several MB), every photo is downscaled to a max dimension
 * before it's ever stored.
 */
const MAX_DIMENSION = 900;
const JPEG_QUALITY = 0.8;

/** Reads an image File, downscales it, and resolves to a compact JPEG data: URL. */
export function readAndDownscaleImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file doesn't look like an image."));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported in this browser."));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
