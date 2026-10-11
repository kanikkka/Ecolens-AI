"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Leaf,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { AppNavbar } from "@/components/layout/app-navbar";

import {
  getLoggedInUser,
  getToken,
  logout,
} from "@/lib/api/auth";

import type { User } from "@/lib/api/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const currentUser = await getLoggedInUser();

      if (!currentUser) {
        window.location.href = "/login";
        return;
      }

      setUser(currentUser);
      setLoading(false);
    }

    loadUser();
  }, []);

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <Leaf className="animate-pulse" size={24} />
          </div>

          <p className="text-sm text-muted">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <AppNavbar />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </button>
        </div>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="h-32 bg-primary-light sm:h-40" />

          <div className="px-5 pb-7 sm:px-8">
            <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border-4 border-card bg-primary text-2xl font-bold text-white sm:h-24 sm:w-24 sm:text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                    {user.name}
                  </h1>

                  <p className="mt-1 text-sm text-muted">
                    EcoLens AI member
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-xl border border-danger/20 px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <UserRound size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Personal information
                </p>

                <h2 className="text-lg font-bold text-foreground">
                  Your account
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <ProfileRow
                icon={<UserRound size={18} />}
                label="Full name"
                value={user.name}
              />

              <ProfileRow
                icon={<Mail size={18} />}
                label="Email address"
                value={user.email}
              />

              <ProfileRow
                icon={<ShieldCheck size={18} />}
                label="Account status"
                value="Active"
              />

              <ProfileRow
                icon={<CalendarDays size={18} />}
                label="User ID"
                value={String(user.id)}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-cream p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Leaf size={21} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-foreground">
              Your EcoLens journey
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              EcoLens will gradually build your
              sustainability profile as you scan items,
              complete actions and verify your impact.
            </p>

            <div className="mt-6 space-y-3">
              <JourneyStep
                number="01"
                title="Scan"
                text="Identify products and waste."
              />

              <JourneyStep
                number="02"
                title="Understand"
                text="Learn about materials and packaging."
              />

              <JourneyStep
                number="03"
                title="Act"
                text="Choose reuse, repair, recycle or disposal."
              />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-border bg-card p-6">
          <p className="text-sm font-semibold text-primary">
            Account security
          </p>

          <h2 className="mt-1 text-xl font-bold text-foreground">
            Your account is protected
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            EcoLens uses authenticated API requests and
            access tokens to protect your account and
            personal sustainability data.
          </p>
        </section>
      </div>
    </main>
  );
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-background p-4">
      <div className="text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted">
          {label}
        </p>

        <p className="mt-0.5 break-all font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

function JourneyStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
        {number}
      </div>

      <div>
        <p className="font-semibold text-foreground">
          {title}
        </p>

        <p className="text-sm text-muted">
          {text}
        </p>
      </div>
    </div>
  );
}
