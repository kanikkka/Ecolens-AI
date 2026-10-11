import { ArrowRight, Leaf, TreePine } from "lucide-react";

export function ImpactCTA() {
  return (
    <section id="impact" className="px-5 pb-20 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--primary)] px-7 py-12 text-white shadow-xl sm:px-10 lg:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-center gap-2 text-[var(--primary-light)]">
              <Leaf className="h-5 w-5" />
              <span className="text-sm font-semibold">Your impact matters</span>
            </div>

            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Small actions become meaningful when you can see the journey.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              EcoLens helps you understand what happened to your waste,
              measure your progress and make the next action easier.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-[var(--primary)] transition hover:bg-[var(--cream)]">
            Start your journey
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-10 flex items-center gap-3 border-t border-white/20 pt-6 text-sm text-white/80">
          <TreePine className="h-5 w-5" />
          Scan. Understand. Act. Make an Impact.
        </div>
      </div>
    </section>
  );
}
