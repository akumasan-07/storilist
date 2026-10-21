import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LibraryProvider } from "@/context/LibraryContext";

import { createClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoriList — Unified Media Tracking",
  description:
    "Track anime, comics, movies, series, and novels in one unified personal library.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  let username: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user: verifiedUser },
    } = await supabase.auth.getUser();
    user = verifiedUser;
    if (verifiedUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", verifiedUser.id)
        .maybeSingle();
      username = profile?.username ?? null;
    }
  } catch {
    user = null;
    username = null;
  }

  const userProp = user ? { email: user.email, username } : null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var t=s?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground transition-colors selection:bg-primary/30 selection:text-primary-subtle-foreground">
        <LibraryProvider isAuthenticated={Boolean(user)}>
          <Navbar user={userProp} />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </LibraryProvider>
      </body>
    </html>
  );
}
