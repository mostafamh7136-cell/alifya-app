export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-100 px-6" aria-busy="true" aria-label="جار التحميل">
      <div className="w-full max-w-sm rounded-3xl border border-cream-300 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-clay-500 font-serif text-2xl font-bold text-white animate-pulse">ع</div>
        <div className="mx-auto mt-5 h-3 w-40 animate-pulse rounded-full bg-cream-300" />
        <div className="mx-auto mt-3 h-3 w-56 animate-pulse rounded-full bg-cream-200" />
      </div>
    </main>
  );
}
