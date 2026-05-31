import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CodeDemoSection from "@/components/landing/CodeDemoSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <main className="bg-deep-black">
      <HeroSection />
      <FeaturesSection />
      <CodeDemoSection />
      <CTASection />
    </main>
  );
}
