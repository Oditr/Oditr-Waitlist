import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { Analytics } from "@vercel/analytics/react";
import Landing from "@/pages/Landing";
import CustomCursor from "@/components/CustomCursor";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Disable Lenis when the user has zoomed in so native panning works
    const handleZoom = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      if (vv.scale > 1.02) {
        lenis.stop();
        document.documentElement.classList.add("is-zoomed");
      } else {
        lenis.start();
        document.documentElement.classList.remove("is-zoomed");
      }
    };
    window.visualViewport?.addEventListener("resize", handleZoom);
    window.visualViewport?.addEventListener("scroll", handleZoom);
    handleZoom();

    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      // When zoomed in, fall back to native smooth scroll
      const zoomed = window.visualViewport && window.visualViewport.scale > 1.02;
      if (zoomed) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        lenis.scrollTo(target, {
          offset: -40,
          duration: 1.6,
          easing: (t) => 1 - Math.pow(1 - t, 4),
        });
      }
      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", href);
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.visualViewport?.removeEventListener("resize", handleZoom);
      window.visualViewport?.removeEventListener("scroll", handleZoom);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return (
    <div className="App bg-white text-[#0A0A0A]">
      <CustomCursor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </div>
  );
}

export default App;
