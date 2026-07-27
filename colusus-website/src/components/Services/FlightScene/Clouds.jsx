import { motion, useTransform } from "framer-motion";

const CLOUDS = [
    {
        id: 1,
        x: 90,
        y: 180,
        scale: 1.1,
        opacity: 0.28,
    },
    {
        id: 2,
        x: 380,
        y: 460,
        scale: 0.9,
        opacity: 0.22,
    },
    {
        id: 3,
        x: 120,
        y: 760,
        scale: 1.3,
        opacity: 0.24,
    },
    {
        id: 4,
        x: 400,
        y: 1080,
        scale: 1,
        opacity: 0.2,
    },
    {
        id: 5,
        x: 140,
        y: 1450,
        scale: 1.2,
        opacity: 0.25,
    },
];

const Clouds = ({ progress }) => {

    const drift = useTransform(
        progress,
        [0, 1],
        [0, -160]
    );

    return (

        <>
            {CLOUDS.map((cloud) => (

                <motion.g
                    key={cloud.id}
                    style={{
                        y: drift,
                    }}
                >

                    <ellipse
                        className="cloud"
                        cx={cloud.x}
                        cy={cloud.y}
                        rx={58 * cloud.scale}
                        ry={24 * cloud.scale}
                        opacity={cloud.opacity}
                    />

                    <ellipse
                        className="cloud"
                        cx={cloud.x - 32}
                        cy={cloud.y + 4}
                        rx={34 * cloud.scale}
                        ry={18 * cloud.scale}
                        opacity={cloud.opacity}
                    />

                    <ellipse
                        className="cloud"
                        cx={cloud.x + 30}
                        cy={cloud.y + 3}
                        rx={36 * cloud.scale}
                        ry={19 * cloud.scale}
                        opacity={cloud.opacity}
                    />

                </motion.g>

            ))}
        </>

    );

};

export default Clouds;