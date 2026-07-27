import { motion, useTransform } from "framer-motion";

const FlightTrail = ({ route, progress }) => {

    // Head of the trail follows the plane
    const pathLength = useTransform(
        progress,
        [0, 1],
        [0, 1]
    );

    // Keep about the last 18% of the path glowing
    const pathOffset = useTransform(
        progress,
        (value) => Math.max(0, value - 0.18)
    );

    return (
        <>
            {/* Outer glow */}

            <motion.path
                d={route}
                className="flight-trail-glow"
                style={{
                    pathLength,
                    pathOffset,
                }}
            />

            {/* Bright core */}

            <motion.path
                d={route}
                className="flight-trail"
                style={{
                    pathLength,
                    pathOffset,
                }}
            />
        </>
    );

};

export default FlightTrail;