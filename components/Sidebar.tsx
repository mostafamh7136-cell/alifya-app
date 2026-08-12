"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lessons } from "@/lib/lessons";

const navItems = [
  { href: "/", label: "الرئيسية", icon: "🏠" },
  { href: "/lessons", label: "الدروس", icon: "📚" },
  { href: "/progress", label: "تقدّمك", icon: "📈" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-900/30 backdrop-blur-sm lg:hidden no-print"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-40 w-72 transform bg-cream-50 border-l border-cream-300 transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto lg:border-l-0 lg:border-r ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-clay-500 text-xl text-white shadow-card">
            <span>ع</span>
          </div>
          <div>
            <p className="font-serif text-xl font-bold text-ink-800">أليفا</p>
            <p className="text-[11px] font-medium tracking-wide text-ink-400">
              Alifya · Arabic Learning
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-clay-100 text-clay-700"
                    : "text-ink-500 hover:bg-cream-200 hover:text-ink-800"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5">
          <div className="rounded-2xl border border-cream-300 bg-cream-200 p-4">
            <p className="text-xs font-semibold text-ink-600">تقدمك الكلي</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-400">
                <div className="h-full w-1/3 rounded-full bg-clay-500" />
              </div>
              <span className="text-xs font-bold text-clay-600">33%</span>
            </div>
            <p className="mt-2 text-[11px] text-ink-400">
              {lessons.length} دروس تفاعلية جاهزة لك
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
