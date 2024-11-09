import sharp from "sharp";

export async function compressImage(base64String) {
  const buffer = Buffer.from(base64String.split(",")[1], "base64");
  const compressedBuffer = await sharp(buffer)
    .resize(800)
    .jpeg({ quality: 80 })
    .toBuffer();
  return compressedBuffer;
}
