import Link from "next/link";
import { createNote } from "@/app/actions";

export default function NewNotePage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Tambah Catatan</h1>

      <form action={createNote} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Judul"
          required
          maxLength={255}
        />
        <textarea
          name="content"
          placeholder="Isi catatan (opsional)"
          rows={6}
          className="w-full rounded border border-gray-300 px-3 py-2 text-white"
        />
        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="block text-sm"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Simpan
          </button>
          <Link href="/" className="px-4 py-2 text-gray-600 hover:underline">
            Batal
          </Link>
        </div>
      </form>
    </main>
  );
}
