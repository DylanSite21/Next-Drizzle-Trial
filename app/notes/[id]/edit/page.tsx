import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { updateNote } from "@/app/actions";

export default async function EditNote({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noteId = Number(id);
  if (!Number.isInteger(noteId)) notFound();

  const [note] = await db.select().from(notes).where(eq(notes.id, noteId));
  if (!note) notFound();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Edit Catatan</h1>

      <form action={updateNote.bind(null, note.id)} className="space-y-3">
        <input
          type="text"
          name="title"
          defaultValue={note.title}
          required
          maxLength={255}
          className="w-full rounded border border-gray-300 px-3 py-2 text-white"
        />
        <textarea
          name="content"
          defaultValue={note.content ?? ""}
          rows={6}
          className="w-full rounded border border-gray-300 px-3 py-2 text-white"
        />

        {note.imageUrl && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={note.imageUrl}
              alt={note.title}
              className="mb-2 max-h-60 rounded"
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="removeImage" />
              Hapus gambar ini
            </label>
          </div>
        )}

        <div>
          <p className="mb-1 text-sm">
            {note.imageUrl ? "Ganti gambar (opsional):" : "Tambah gambar:"}
          </p>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Simpan perubahan
          </button>
          <Link href="/" className="px-4 py-2 text-gray-600 hover:underline">
            Batal
          </Link>
        </div>
      </form>
    </main>
  );
}
