"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { saveImage, deleteImage } from "@/lib/upload";

function getFile(formData: FormData) {
  const f = formData.get("image");
  return f instanceof File ? f : null;
}

export async function createNote(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title) return;

  const imageUrl = await saveImage(getFile(formData));

  try {
    await db.insert(notes).values({
      title,
      content: content || null,
      imageUrl,
    });
  } catch (err) {
    await deleteImage(imageUrl);
    throw err;
  }

  revalidatePath("/");
  redirect("/");
}

export async function updateNote(id: number, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!id || !title) return;

  const [existing] = await db.select().from(notes).where(eq(notes.id, id));
  if (!existing) return;

  const newImage = await saveImage(getFile(formData));

  let imageUrl = existing.imageUrl;
  let oldToDelete: string | null = null;

  if (newImage) {
    imageUrl = newImage;
    oldToDelete = existing.imageUrl;
  } else if (formData.get("removeImage") === "on") {
    imageUrl = null;
    oldToDelete = existing.imageUrl;
  }

  try {
    await db
      .update(notes)
      .set({ title, content: content || null, imageUrl })
      .where(eq(notes.id, id));
  } catch (err) {
    await deleteImage(newImage);
    throw err;
  }

  await deleteImage(oldToDelete);
  revalidatePath("/");
  redirect("/");
}

export async function deleteNote(id: number) {
  const [existing] = await db.select().from(notes).where(eq(notes.id, id));
  if (!existing) return;

  await db.delete(notes).where(eq(notes.id, id));
  await deleteImage(existing.imageUrl);
  revalidatePath("/");
}
