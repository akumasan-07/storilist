import Link from "next/link";
import Image from "next/image";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-muted-surface py-8 text-sm text-subtle-foreground transition-colors">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-90"
              aria-label="StoriList home"
            >
              <Image
                src="/lettermark.png"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 rounded-md object-contain"
              />
              <span className="font-semibold text-foreground">StoriList</span>
            </Link>
            <span>—</span>
            <span>Anime, Comics, Movies, Series &amp; Novels in one place</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-subtle-foreground">
            <Link
              href="/about"
              className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              About &amp; Credits
            </Link>
            <span aria-hidden="true">&bull;</span>
            <p>&copy; {new Date().getFullYear()} StoriList. Personal Media Tracker.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
