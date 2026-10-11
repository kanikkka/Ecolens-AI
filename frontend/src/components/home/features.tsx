import {
  BrainCircuit,
  MapPinned,
  ShieldCheck,
  Trophy,
  Users,
  Sprout,
} from "lucide-react";

const features = [
  ["AI Identification", "Understand products, waste and materials.", BrainCircuit],
  ["Local Action", "Find relevant collection and recycling options.", MapPinned],
  ["Verified Actions", "Build trust through proof and verification.", ShieldCheck],
  ["Green Credits", "Earn meaningful rewards for sustainable actions.", Trophy],
  ["Community", "Learn, participate and grow together.", Users],
  ["Green Growth", "Track habits, goals and long-term impact.", Sprout],
] as const;

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
          One platform
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Everything around one sustainable action
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
          EcoLens connects identification, guidance, real-world action,
          verification and impact in one journey.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(([title, description, Icon]) => (
          <div
            key={title}
            className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
              <Icon className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <h3 className="mt-5 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
