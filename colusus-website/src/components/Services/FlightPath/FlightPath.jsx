import { useRef } from "react";

import {
    useMotionValue,
    useMotionValueEvent,
    useScroll,
} from "framer-motion";

import "./FlightPath.css";

import Plane from "./Plane";
import FlightTrail from "./FlightTrail";

const ROUTE = `
M250 40
C420 180 80 320 250 470
C430 620 90 760 250 920
C430 1080 80 1220 250 1380
C430 1540 130 1680 250 1760
`;

const FlightPath = ({ sectionRef }) => {

    const pathRef = useRef(null);

    const planeX = useMotionValue(0);
    const planeY = useMotionValue(0);
    const planeRotate = useMotionValue(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    useMotionValueEvent(
        scrollYProgress,
        "change",
        (progress) => {

            if (!pathRef.current) return;

            const path = pathRef.current;

            const length = path.getTotalLength();

            const current = path.getPointAtLength(
                progress * length
            );

            const next = path.getPointAtLength(
                Math.min(progress * length + 3, length)
            );

            planeX.set(current.x);
            planeY.set(current.y);

            const angle =
                Math.atan2(
                    next.y - current.y,
                    next.x - current.x
                ) *
                (180 / Math.PI);

            planeRotate.set(angle + 90);

        }
    );

    return (

        <div className="flight-path">

            <svg
                className="flight-svg"
                viewBox="0 0 500 1800"
                preserveAspectRatio="none"
            >

                {/* Background Route */}

                <path
                    ref={pathRef}
                    className="flight-route"
                    d={ROUTE}
                />

                {/* Animated Trail */}

                <FlightTrail
                    d={ROUTE}
                    progress={scrollYProgress}
                />

            </svg>

            {/* Plane */}

            <Plane
                x={planeX}
                y={planeY}
                rotate={planeRotate}
            />

        </div>

    );

};

export default FlightPath;