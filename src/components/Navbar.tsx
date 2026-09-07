"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Container from "./Container";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "My Library", href: "/library" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Branding */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold tracking-tight text-white transition-opacity hover:opacity-90"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold shadow-sm shadow-indigo-500/30">
                SL
              </span>
              <span className="text-xl font-semibold tracking-tight text-zinc-100">
                Stori<span className="text-indigo-400">List</span>
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
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${active
                        ? "bg-zinc-800 text-white font-semibold"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Right Side Placeholder for future Auth / Profile */}
          <div className="hidden md:flex items-center gap-3" />

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="border-t border-zinc-800 py-3 md:hidden">
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-md px-3 py-2 text-base font-medium transition-colors ${active
                        ? "bg-zinc-800 text-white font-semibold"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}
