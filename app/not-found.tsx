import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-100 px-6">
      <section className="max-w-lg rounded-3xl border border-cream-300 bg-white p-8 text-center shadow-card sm:p-10" dir="rtl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-clay-100 font-serif text-3xl font-bold text-clay-700">404</div>
        <h1 className="mt-6 font-serif text-3xl font-bold text-ink-800">هذه الصفحة غير موجودة</h1>
        <p className="mt-3 leading-relaxed text-ink-500">يبدو أن الرابط غير صحيح أو أن الدرس الذي تبحث عنه لم يعد متاحاً.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">العودة للرئيسية</Link>
          <Link href="/lessons" className="btn-secondary">تصفّح الدروس</Link>
        </div>
      </section>
    </main>
  );
}
