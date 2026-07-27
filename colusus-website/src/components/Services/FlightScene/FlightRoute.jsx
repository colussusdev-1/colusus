import { motion } from "framer-motion";

const FlightRoute = ({ route, pathRef }) => {

    return (

        <>
            {/* Background Route */}

            <path
                ref={pathRef}
                className="flight-route"
                d={route}
            />

            {/* Animated Glow Route */}

            <motion.path
                className="flight-route-glow"
                d={route}

                initial={{
                    pathLength: 0,
                }}

                animate={{
                    pathLength: 1,
                }}

                transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                }}
            />
        </>

    );

};

export default FlightRoute;