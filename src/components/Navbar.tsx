"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";
import { useClickOutside } from "@/hooks/useClickOutside";
import { logout } from "@/app/actions/auth";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "My Library", href: "/library" },
];

export interface NavbarProps {
  user?: {
    email?: string | null;
    username?: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close mobile menu on outside click or Escape key
  const mobileNavRef = useClickOutside<HTMLElement>(
    () => setMobileMenuOpen(false),
    mobileMenuOpen
  );

  // Close desktop account dropdown on outside click or Escape key
  const userMenuRef = useClickOutside<HTMLDivElement>(
    () => setUserMenuOpen(false),
    userMenuOpen
  );

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const emailLocalPart = user?.email ? user.email.split("@")[0] : null;
  const displayName = user?.username || emailLocalPart || "Account";

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors"
      ref={mobileNavRef}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Branding */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
            >
              <Image
                src="/lettermark.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-contain"
                priority
              />
              <span className="text-xl font-semibold tracking-tight text-foreground">
                Stori<span className="text-primary">List</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-muted font-semibold text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Desktop Auth / Profile */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    aria-label="User account menu"
                    aria-expanded={userMenuOpen}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <User className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <span className="max-w-[120px] truncate">{displayName}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-150 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                      <div className="px-3 py-2 text-xs border-b border-border mb-1">
                        <div className="font-semibold text-foreground truncate">
                          {displayName}
                        </div>
                        {user.email && (
                          <div className="text-muted-foreground truncate mt-0.5">
                            {user.email}
                          </div>
                        )}
                      </div>
                      <form action={logout}>
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          <span>Log out</span>
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-xl px-3.5 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-xl bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="border-t border-border py-3 md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center rounded-xl px-4 py-3 min-h-[44px] text-sm font-semibold transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Section */}
            {user ? (
              <div className="border-t border-border pt-3 mt-3 px-1">
                <div className="px-3 py-2 text-xs mb-1">
                  <div className="font-semibold text-foreground truncate">
                    {displayName}
                  </div>
                  {user.email && (
                    <div className="text-muted-foreground truncate mt-0.5">
                      {user.email}
                    </div>
                  )}
                </div>
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 min-h-[44px] text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>Log out</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="border-t border-border pt-3 mt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 min-h-[44px] text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 min-h-[44px] text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        )}
      </Container>
    </header>
  );
}
