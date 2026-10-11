import { ScanLine, Sparkles, CircleCheck, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Scan",
    description: "Capture a product or waste item with your phone.",
    icon: ScanLine,
  },
  {
    number: "02",
    title: "Understand",
    description: "AI identifies the product, material and useful information.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Act",
    description: "Get a clear reuse, repair, recycle or disposal action.",
    icon: CircleCheck,
  },
  {
    number: "04",
    title: "Impact",
    description: "Verify what you did and track your environmental impact.",
    icon: BarChart3,
  },
];

export function Journey() {
  return (
    <section id="how-it-works" className="border-y border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Simple journey
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            From “What do I do with this?”
            <span className="text-[var(--primary)]"> to action.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--primary)]">
                    {step.number}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)]">
                    <Icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                </div>

                <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
