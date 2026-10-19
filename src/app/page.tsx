import HomeHero from "@/components/home/HomeHero";
import HomePreview from "@/components/home/HomePreview";
import HomeCategories from "@/components/home/HomeCategories";
import HomeFeatured from "@/components/home/HomeFeatured";
import HomeWorkflow from "@/components/home/HomeWorkflow";
import HomeBenefits from "@/components/home/HomeBenefits";
import HomeCta from "@/components/home/HomeCta";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 sm:gap-28 py-6 sm:py-14 overflow-x-hidden">
      <HomeHero />
      <HomePreview />
      <HomeCategories />
      <HomeFeatured />
      <HomeWorkflow />
      <HomeBenefits />
      <HomeCta />
    </div>
  );
}
