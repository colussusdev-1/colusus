import { motion } from "framer-motion";

const FlightTrail = ({
    d,
    progress,
}) => {

    return (

        <motion.path
            d={d}
            className="flight-trail"
            style={{
                pathLength: progress,
            }}
        />

    );

};

export default FlightTrail;