"use client";

import { Leaf, ScanLine } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-light)]">
            <Leaf className="h-5 w-5 text-[var(--primary)]" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            EcoLens <span className="text-[var(--primary)]">AI</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          <a href="#how-it-works" className="text-sm text-[var(--muted)] transition hover:text-[var(--primary)]">
            How it works
          </a>
          <a href="#features" className="text-sm text-[var(--muted)] transition hover:text-[var(--primary)]">
            Features
          </a>
          <a href="#impact" className="text-sm text-[var(--muted)] transition hover:text-[var(--primary)]">
            Impact
          </a>
        </nav>

        <button className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]">
          <ScanLine className="h-4 w-4" />
          Scan
        </button>
      </div>
    </header>
  );
}
