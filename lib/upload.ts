import { randomUUID } from "crypto";
import { supabase, BUCKET } from "./supabase";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function saveImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = ALLOWED[file.type];
  if (!ext) throw new Error("Format gambar harus JPG, PNG, WEBP, atau GIF.");
  if (file.size > MAX_SIZE) throw new Error("Ukuran gambar maksimal 2 MB.");

  const path = `${randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      upsert: false,
    });
  if (error) throw new Error(`Gagal upload gambar: ${error.message}`);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function deleteImage(url: string | null | undefined) {
  if (!url) return;

  // URL publik berbentuk .../storage/v1/object/public/<bucket>/<path>
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return; // bukan file di bucket ini, abaikan

  const path = decodeURIComponent(url.slice(i + marker.length));
  await supabase.storage.from(BUCKET).remove([path]);
}
