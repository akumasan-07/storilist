import Container from "./Container";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 py-8 text-sm text-zinc-500">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">StoriList</span>
            <span>—</span>
            <span>Anime, Comics, Movies, Series &amp; Novels in one place</span>
          </div>
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} StoriList. Personal Media Tracker.
          </p>
        </div>
      </Container>
    </footer>
  );
}
