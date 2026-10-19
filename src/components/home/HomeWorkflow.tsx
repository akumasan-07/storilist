import { Search, BookmarkPlus, SlidersHorizontal, Star } from "lucide-react";
import Container from "@/components/Container";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Find Across Formats",
    description: "Search anime seasons, ongoing manga, cinema releases, TV shows, and novels in a single query.",
    icon: Search,
    detail: "No toggling between five niche databases.",
  },
  {
    step: "02",
    title: "Organize Your Shelves",
    description: "Add titles to Watching, Reading, Completed, or Planning shelves with custom tags and private status.",
    icon: BookmarkPlus,
    detail: "Keep current queues separate from backlogs.",
  },
  {
    step: "03",
    title: "Update in One Tap",
    description: "Increment episodes or chapters with single-tap steppers right from your mobile or desktop view.",
    icon: SlidersHorizontal,
    detail: "Designed for fast daily logging.",
  },
  {
    step: "04",
    title: "Log Scores & Thoughts",
    description: "Keep private impressions, chapter notes, and volume ratings without social feed noise or pressure.",
    icon: Star,
    detail: "Your media diary, permanently preserved.",
  },
];

export default function HomeWorkflow() {
  return (
    <section className="relative">
      <Container>
        <div className="rounded-3xl border border-border bg-muted-surface/50 p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              How StoriList fits into your routine.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Low friction by design so you spend time enjoying stories, not managing databases.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs"
                >
                  <div>
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

                  {/* Step Footnote */}
                  <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-medium text-subtle-foreground">
                    {step.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
