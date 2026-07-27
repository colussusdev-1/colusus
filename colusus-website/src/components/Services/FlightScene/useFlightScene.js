import { useLayoutEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";

const useFlightScene = ({ sectionRef, cardRefs }) => {
  const pathRef = useRef(null);

  const [route, setRoute] = useState("");
  const [svgHeight, setSvgHeight] = useState(2000);

  /* =========================
     MOTION VALUES
  ========================= */

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotate = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 140, damping: 28 });
  const y = useSpring(rawY, { stiffness: 140, damping: 28 });
  const rotate = useSpring(rawRotate, { stiffness: 100, damping: 22 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* =========================
     BUILD STABLE PATH (NO DOM DRIFT)
  ========================= */

  useLayoutEffect(() => {
    const build = () => {
      if (!cardRefs.current?.length) return;

      const cards = cardRefs.current.filter(Boolean);
      if (!cards.length) return;

      const timeline = cards[0].parentElement;

      // 🔥 CRITICAL FIX: use scrollHeight NOT getBoundingClientRect
      const fullHeight = timeline.scrollHeight;

      const centerX = 250; // fixed SVG center

      const spacing = fullHeight / (cards.length - 1);

      const points = cards.map((_, index) => ({
        x: index % 2 === 0 ? centerX - 110 : centerX + 110,
        y: 80 + index * spacing,
      }));

      let d = `M ${points[0].x} ${points[0].y}`;

      for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i].x} ${points[i].y}`;
      }

      const last = points[points.length - 1];

      d += ` L ${last.x} ${last.y + 120}`;

      setRoute(d);
      setSvgHeight(fullHeight + 200);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(build);
    });

    window.addEventListener("resize", build);
    return () => window.removeEventListener("resize", build);
  }, [cardRefs]);

  /* =========================
     MOVE PLANE (FIXED)
  ========================= */

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!pathRef.current || !route) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    const safeProgress = Math.min(Math.max(progress, 0), 1);

    const current = path.getPointAtLength(safeProgress * length);
    const next = path.getPointAtLength(
      Math.min(safeProgress * length + 5, length),
    );

    rawX.set(current.x);
    rawY.set(current.y - 18);

    const angle =
      Math.atan2(next.y - current.y, next.x - current.x) * (180 / Math.PI);

    rawRotate.set(angle + 90);
  });

  return {
    route,
    svgHeight,
    progress: scrollYProgress,
    pathRef,
    x,
    y,
    rotate,
  };
};

export default useFlightScene;
