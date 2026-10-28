import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin, useGSAP);

gsap.defaults({ ease: "power3.out", duration: 0.8 });
ScrollTrigger.config({ ignoreMobileResize: true });

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const MQ = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023px)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
};

export { gsap, ScrollTrigger, SplitText, MorphSVGPlugin, useGSAP };
