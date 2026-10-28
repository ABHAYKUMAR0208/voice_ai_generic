import { useRef } from "react";
import { useReveal } from "../hooks/useMotion";
import { TRUST } from "../content/home";
import VelocityMarquee from "../components/VelocityMarquee";
import Hero from "../sections/home/Hero";
import Statement from "../sections/home/Statement";
import NightShift from "../sections/home/NightShift";
import FlowSteps from "../sections/home/FlowSteps";
import InsideTheCall from "../sections/home/InsideTheCall";
import UseCaseGallery from "../sections/home/UseCaseGallery";
import ConsoleTeaser from "../sections/home/ConsoleTeaser";
import Platform from "../sections/home/Platform";
import Stats from "../sections/home/Stats";
import Integrations from "../sections/home/Integrations";
import GoLive from "../sections/home/GoLive";
import Faq from "../sections/home/Faq";
import "../styles/home.css";

export default function Home() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <main id="main" ref={ref}>
      <Hero />
      <VelocityMarquee label={TRUST.label} items={TRUST.names} />
      <Statement />
      <NightShift />
      <FlowSteps />
      <InsideTheCall />
      <UseCaseGallery />
      <Integrations />
      <ConsoleTeaser />
      <Platform />
      <GoLive />
      <Stats />
      <Faq />
    </main>
  );
}
