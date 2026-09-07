import Container from "@/components/Container";

export default function LibraryPage() {
  return (
    <div className="py-12">
      <Container>
        <div className="flex flex-col gap-2">
          <div className="inline-flex w-fit items-center rounded border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
            LIBRARY
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            My Library
          </h1>
          <p className="text-sm text-zinc-400">
            Manage your personal watchlist, reading list, progress, and ratings.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-zinc-800 p-12 text-center">
          <p className="text-sm text-zinc-500">
            Personal library and watchlist tracking views will be integrated
            here.
          </p>
        </div>
      </Container>
    </div>
  );
}
