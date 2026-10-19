import Link from "next/link";
import { Compass, Home } from "lucide-react";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/50 p-8 sm:p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-subtle-foreground">
            <Compass className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-foreground">Page Not Found</h1>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            The page or narrative work you are looking for doesn&apos;t exist, was removed, or may have had its link changed.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors"
            >
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Return Home</span>
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Compass className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Explore Catalog</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
