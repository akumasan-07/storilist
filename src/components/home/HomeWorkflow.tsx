import { Search, BookmarkPlus, SlidersHorizontal, Star } from "lucide-react";
import Container from "@/components/Container";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Find Across Formats",
    description: "Search anime seasons, ongoing manga, cinema releases, TV shows, and novels in a single query.",
    icon: Search,
  },
  {
    step: "02",
    title: "Organize Your Shelves",
    description: "Add titles to Watching, Reading, Completed, or Planning shelves with custom tags and private status.",
    icon: BookmarkPlus,
  },
  {
    step: "03",
    title: "Update in One Tap",
    description: "Increment episodes or chapters with single-tap steppers right from your mobile or desktop view.",
    icon: SlidersHorizontal,
  },
  {
    step: "04",
    title: "Log Scores & Thoughts",
    description: "Keep private impressions, chapter notes, and volume ratings without social feed noise or pressure.",
    icon: Star,
  },
];

export default function HomeWorkflow() {
  return (
    <section className="relative">
      <Container>
        <div className="rounded-3xl border border-border bg-muted-surface/50 p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              How StoriList fits into your routine
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative flex flex-col rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs"
                >
                  {/* Step Number + Icon Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-subtle-foreground/40">
                      {step.step}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary-subtle-border bg-primary-subtle text-primary-subtle-foreground">
                      <StepIcon className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
