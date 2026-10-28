import { useRef } from "react";
import { PageHero } from "../components/ui";

export default function NotFound() {
  const ref = useRef(null);
  return (
    <main id="main" ref={ref}>
      <PageHero
        eyebrow="Error 404"
        accent="amber"
        title={["Your agent checked every line.", "This page isn't one of them."]}
        lead="The link you followed may be old, or the page has moved. Let's get you back home."
        primary={{ to: "/", label: "Back to home" }}
        secondary={{ to: "/console", label: "Try the live demo" }}
        watermark="404"
      />
    </main>
  );
}
