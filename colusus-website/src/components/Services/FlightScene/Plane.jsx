import { motion } from "framer-motion";
import { HiPaperAirplane } from "react-icons/hi";

const Plane = ({ x, y, rotate }) => {

    return (

        <motion.div
            className="plane"
            style={{
                x,
                y,
                rotate,
            }}
        >

            <span className="plane-glow"></span>

            <span className="plane-engine"></span>

            <HiPaperAirplane className="plane-icon" />

        </motion.div>

    );

};

export default Plane;