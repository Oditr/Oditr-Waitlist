import { useEffect, useRef, useState } from "react";

/**
 * Premium two-layer cursor:
 * - a small solid dot (8px) that tracks the mouse 1:1
 * - a larger outline ring (36px) that follows with a soft lag
 * Uses mix-blend-mode: difference for automatic inversion against the page.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(pointer: fine)").matches
      : false
  );
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      const t = e.target;
      if (
        t.closest(
          "a, button, [role=button], input, textarea, select, [data-cursor='hover']"
        )
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    rafId = requestAnimationFrame(tick);
    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`custom-cursor-ring ${hovering ? "is-hovering" : ""}`}
      />
      <div ref={dotRef} aria-hidden="true" className="custom-cursor-dot" />
    </>
  );
}
