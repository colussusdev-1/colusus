import { motion } from "framer-motion";
import { HiPaperAirplane } from "react-icons/hi";

const Plane = ({
    x,
    y,
    rotate,
    size = 70,
}) => {

    return (

        <motion.div
            className="plane"
            style={{
                x,
                y,
                rotate,
                width: size,
                height: size,
            }}
        >

            {/* Glow */}

            <span className="plane-glow" />

            {/* Plane */}

            <HiPaperAirplane className="plane-icon" />

            {/* Engine Light */}

            <span className="plane-engine" />

        </motion.div>

    );

};

export default Plane;