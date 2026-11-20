/**
 * Downscales an image file to a square thumbnail and re-encodes as JPEG.
 * Keeps avatars tiny (~20–40 KB) so they store cheaply and load instantly,
 * whether the backend uses Cloudinary or an inline data URL.
 */
export async function resizeImageToSquare(file: File, size = 256, quality = 0.85): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;

  // Cover-crop to a centered square.
  const min = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - min) / 2;
  const sy = (bitmap.height - min) / 2;
  ctx.drawImage(bitmap, sx, sy, min, min, 0, 0, size, size);

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Encode failed'))), 'image/jpeg', quality)
  );
  return new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
}
