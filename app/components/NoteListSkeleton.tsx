export default function NoteListSkeleton() {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="animate-pulse rounded border p-4">
          <div className="mx-auto mb-3 size-[200px] rounded bg-gray-200" />
          <div className="mb-2 h-5 w-1/2 rounded bg-gray-200" />
          <div className="mb-1 h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
        </li>
      ))}
    </ul>
  );
}
