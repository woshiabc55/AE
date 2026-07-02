import Hero from "@/components/home/Hero";
import FeaturedMarquee from "@/components/home/FeaturedMarquee";
import CategoryCards from "@/components/home/CategoryCards";
import TagCloud from "@/components/home/TagCloud";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedMarquee />
      <CategoryCards />
      <TagCloud />
    </>
  );
}
