import Container from "./Container";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-muted-surface py-8 text-sm text-subtle-foreground transition-colors">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">StoriList</span>
            <span>—</span>
            <span>Anime, Comics, Movies, Series &amp; Novels in one place</span>
          </div>
          <p className="text-xs text-subtle-foreground">
            &copy; {new Date().getFullYear()} StoriList. Personal Media Tracker.
          </p>
        </div>
      </Container>
    </footer>
  );
}
