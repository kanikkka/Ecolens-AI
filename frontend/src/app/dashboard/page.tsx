"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Leaf,
  MapPin,
  Recycle,
  ScanLine,
  UserRound,
} from "lucide-react";

import { AppNavbar } from "@/components/layout/app-navbar";

import {
  getLoggedInUser,
  getToken,
} from "@/lib/api/auth";

import type { User } from "@/lib/api/types";

export default function DashboardPage() {
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <Leaf className="animate-pulse" size={24} />
          </div>

          <p className="text-sm text-muted">
            Loading your EcoLens dashboard...
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-primary p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-white/75">
                Welcome back
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Hello, {user.name.split(" ")[0]} 👋
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                Scan something around you, understand
                what it is, and take the right
                sustainability action.
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Recycle size={32} />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            icon={<ScanLine size={21} />}
            title="Scan"
            description="Identify a product or waste item."
            href="/scan"
          />

          <DashboardCard
            icon={<Recycle size={21} />}
            title="My Impact"
            description="Track your sustainability impact."
            href="/impact"
          />

          <DashboardCard
            icon={<MapPin size={21} />}
            title="Find Nearby"
            description="Find collection and recycling points."
            href="/map"
          />

          <DashboardCard
            icon={<UserRound size={21} />}
            title="Profile"
            description="Manage your EcoLens account."
            href="/profile"
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Your account
                </p>

                <h2 className="mt-1 text-xl font-bold text-foreground">
                  Account information
                </h2>
              </div>

              <UserRound
                size={22}
                className="text-primary"
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoItem
                label="Name"
                value={user.name}
              />

              <InfoItem
                label="Email"
                value={user.email}
              />

              <InfoItem
                label="User ID"
                value={String(user.id)}
              />

              <InfoItem
                label="Account status"
                value="Active"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-cream p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Leaf size={21} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-foreground">
              Start your journey
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Your next step is simple: scan an item
              and let EcoLens help you decide what to
              do with it.
            </p>

            <button
              onClick={() => {
                window.location.href = "/scan";
              }}
              className="mt-6 flex items-center gap-2 font-semibold text-primary hover:text-primary-dark"
            >
              Start scanning
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

function DashboardCard({
  icon,
  title,
  description,
  href,
}: DashboardCardProps) {
  return (
    <button
      onClick={() => {
        window.location.href = href;
      }}
      className="group rounded-3xl border border-border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
          {icon}
        </div>

        <ArrowRight
          size={18}
          className="text-muted transition group-hover:translate-x-1 group-hover:text-primary"
        />
      </div>

      <h3 className="mt-5 font-bold text-foreground">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">
        {description}
      </p>
    </button>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>

      <p className="mt-1 break-all font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}
