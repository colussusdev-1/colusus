import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

const SVG_WIDTH = 500;
const SVG_HEIGHT = 1800;

const useFlightPath = (sectionRef) => {
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const progress = useTransform(
        scrollYProgress,
        [0, 1],
        [0, 1]
    );

    const [plane, setPlane] = useState({
        x: SVG_WIDTH / 2,
        y: 40,
        rotate: 90,
    });

    useMotionValueEvent(progress, "change", () => {
        // FlightPath.jsx will calculate the real position.
        // This hook only owns the shared progress value.
    });

    return {
        progress,
        plane,
        setPlane,
    };
};

export default useFlightPath;