import Link from "next/link";
import { Suspense } from "react";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { deleteNote } from "./actions";
import NoteListSkeleton from "./components/NoteListSkeleton";

export const dynamic = "force-dynamic"; // selalu ambil data terbaru dari DB

export default function HomePage() {
  return (
    <main className="w-full p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Catatan</h1>
        <Link
          href="/notes/new"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          + Tambah
        </Link>
      </div>

      <Suspense fallback={<NoteListSkeleton />}>
        <NoteList />
      </Suspense>
    </main>
  );
}

async function NoteList() {
  const items = await db.select().from(notes).orderBy(asc(notes.createdAt));

  if (items.length === 0) {
    return <p className="text-gray-500">Belum ada catatan.</p>;
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-4">
      {items.map((note) => (
        <li key={note.id} className="rounded border p-4">
          {note.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={note.imageUrl}
              alt={note.title}
              className="mx-auto mb-3 h-[200px] w-[200px] shrink-0 rounded object-cover"
            />
          )}
          <h2 className="font-semibold">{note.title}</h2>
          <p className="text-gray-600">{note.content}</p>

          <div className="mt-3 flex gap-3">
            <Link href={`/notes/${note.id}/edit`} className="text-blue-600">
              Edit
            </Link>
            <form action={deleteNote.bind(null, note.id)}>
              <button className="text-red-600">Hapus</button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
