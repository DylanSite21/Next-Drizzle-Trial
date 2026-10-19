import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = ALLOWED[file.type];
  if (!ext) throw new Error("Format gambar harus JPG, PNG, WEBP, atau GIF.");
  if (file.size > MAX_SIZE) throw new Error("Ukuran gambar maksimal 2 MB.");

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(
    path.join(UPLOAD_DIR, filename),
    Buffer.from(await file.arrayBuffer()),
  );
  return `/uploads/${filename}`;
}

export async function deleteImage(url: string | null | undefined) {
  if (!url?.startsWith("/uploads/")) return;
  // basename mencegah path traversal
  const filename = path.basename(url);
  await unlink(path.join(UPLOAD_DIR, filename)).catch(() => {});
}
