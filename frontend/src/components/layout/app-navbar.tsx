"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Home,
  Leaf,
  LogOut,
  MapPin,
  Menu,
  ScanLine,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  getLoggedInUser,
  logout,
} from "@/lib/api/auth";

import type { User } from "@/lib/api/types";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Scan",
    href: "/scan",
    icon: ScanLine,
  },
  {
    label: "My Impact",
    href: "/impact",
    icon: BarChart3,
  },
  {
    label: "Find Nearby",
    href: "/map",
    icon: MapPin,
  },
  {
    label: "Rewards",
    href: "/rewards",
    icon: Trophy,
  },
  {
    label: "Community",
    href: "/community",
    icon: Users,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound,
  },
];

export function AppNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getLoggedInUser();
      setUser(currentUser);
    }

    loadUser();
  }, []);

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
            <Leaf size={21} />
          </div>

          <div>
            <p className="font-bold leading-tight text-foreground">
              EcoLens AI
            </p>

            <p className="hidden text-[11px] text-muted sm:block">
              Scan · Understand · Act
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-primary-light hover:text-primary"
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <span className="max-w-28 truncate text-sm font-medium text-foreground">
                {user.name}
              </span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="rounded-xl p-2 text-muted transition hover:bg-danger/10 hover:text-danger"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={19} />
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl p-2 text-muted transition hover:bg-primary-light hover:text-primary lg:hidden"
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-card lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-primary-light hover:text-primary"
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-border" />

            {user && (
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-muted">
                    {user.email}
                  </p>
                </div>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-danger transition hover:bg-danger/10"
            >
              <LogOut size={19} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
