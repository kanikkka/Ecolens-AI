"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Leaf, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { login } from "@/lib/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm lg:grid-cols-2">

          <section className="hidden bg-[var(--primary-light)] p-12 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[var(--primary-dark)]">
                <Leaf size={24} />
                <span className="text-lg font-bold">
                  EcoLens AI
                </span>
              </div>

              <div className="mt-20 max-w-md">
                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
                  Welcome back
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight text-[var(--foreground)]">
                  Small actions.
                  <br />
                  Meaningful impact.
                </h1>

                <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                  Continue your sustainability journey,
                  track your impact, and turn everyday
                  choices into measurable change.
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--muted)]">
              Scan. Understand. Act. Make an Impact.
            </p>
          </section>

          <section className="flex items-center justify-center p-7 sm:p-10 lg:p-14">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md"
            >
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-2 text-[var(--primary-dark)]">
                  <Leaf size={24} />
                  <span className="text-lg font-bold">
                    EcoLens AI
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[var(--foreground)]">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  Sign in to continue to EcoLens AI.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--cream)] px-4 py-3 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--cream)] px-4 py-3 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-[var(--muted)]">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[var(--primary-dark)] hover:underline"
                >
                  Create one
                </Link>
              </p>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
