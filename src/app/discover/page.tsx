import Container from "@/components/Container";

export default function DiscoverPage() {
  return (
    <div className="py-12">
      <Container>
        <div className="flex flex-col gap-2">
          <div className="inline-flex w-fit items-center rounded border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
            DISCOVER
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Discover Media
          </h1>
          <p className="text-sm text-zinc-400">
            Search and explore anime, comics, movies, series, and novels.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-zinc-800 p-12 text-center">
          <p className="text-sm text-zinc-500">
            Media discovery and search interface will be integrated here.
          </p>
        </div>
      </Container>
    </div>
  );
}
