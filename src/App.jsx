import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SmoothScroll from "./components/SmoothScroll";
import { TransitionProvider } from "./components/Transition";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Walkthrough from "./pages/Walkthrough";
import Solutions from "./pages/Solutions";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ConsoleGate from "./pages/ConsoleGate";

// The console pulls in livekit-client, so keep it out of the marketing bundle
// and warm it up once the first page is idle.
const loadConsole = () => import("./pages/Console");
const Console = lazy(loadConsole);

function usePrefetchConsole() {
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 2500));
    const id = idle(() => loadConsole());
    return () => (window.cancelIdleCallback || clearTimeout)(id);
  }, []);
}

export default function App() {
  const { pathname } = useLocation();
  const isConsole = pathname === "/console";
  usePrefetchConsole();

  return (
    <SmoothScroll>
      <TransitionProvider>
        <Loader />
        <Cursor />
        <Header variant={isConsole ? "console" : "default"} />
        <Suspense fallback={<div className="route-fallback" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/walkthrough" element={<Walkthrough />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/features" element={<Navigate to="/solutions" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/console" element={<ConsoleGate Console={Console} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer compact={isConsole} />
      </TransitionProvider>
    </SmoothScroll>
  );
}
