"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Leaf,
  Recycle,
  Sparkles,
  TreePine,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[var(--accent)]/50 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[var(--sky)]/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--muted)] shadow-sm">
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            AI-powered sustainability
          </div>

          <h1 className="mt-6 max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Turn everyday choices into
            <span className="text-[var(--primary)]"> real impact.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
            Scan products and waste, understand their materials, discover the
            right action, and build a measurable sustainability journey.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[var(--primary-dark)]">
              <Camera className="h-5 w-5" />
              Start Scanning
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-7 py-3.5 font-semibold transition hover:border-[var(--primary)]"
            >
              See how it works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-5 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-[var(--primary)]" />
              AI guidance
            </span>
            <span className="flex items-center gap-2">
              <Recycle className="h-4 w-4 text-[var(--primary)]" />
              Local actions
            </span>
            <span className="flex items-center gap-2">
              <TreePine className="h-4 w-4 text-[var(--earth)]" />
              Impact tracking
            </span>
          </div>
        </motion.div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.1 }}
      className="relative mx-auto w-full max-w-lg"
    >
      <div className="rounded-[2rem] border border-[var(--border)] bg-white p-5 shadow-xl">
        <div className="rounded-[1.5rem] bg-[var(--primary-light)] p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted)]">EcoLens Scanner</p>
              <p className="mt-1 text-xl font-bold">Ready to identify</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
              <ScanIcon />
            </div>
          </div>

          <div className="mt-7 flex aspect-square items-center justify-center rounded-3xl border-2 border-dashed border-[var(--secondary)]/50 bg-white/70">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)]">
                <Camera className="h-9 w-9 text-[var(--primary)]" />
              </div>
              <p className="mt-4 font-semibold">Scan an item</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Photo → AI → Action
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <Stat label="Actions" value="24" icon={<Recycle />} />
          <Stat label="Impact tracked" value="18.4 kg" icon={<TreePine />} />
        </div>
      </div>
    </motion.div>
  );
}

function ScanIcon() {
  return <Sparkles className="h-5 w-5 text-[var(--primary)]" />;
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[var(--cream)] p-4">
      <div className="h-5 w-5 text-[var(--primary)]">{icon}</div>
      <p className="mt-3 text-xl font-bold">{value}</p>
      <p className="text-xs text-[var(--muted)]">{label}</p>
    </div>
  );
}
