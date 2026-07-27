import "./CanadaOverview.css";

import { Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { HiOutlineArrowRight } from "react-icons/hi";

import { pathways } from "../../data/pathways";

import useRotatePathways from "./useRotatePathways";

const CanadaOverview = () => {

    const {
        featured,
        others,
    } = useRotatePathways(pathways);

    const FeaturedIcon = featured.icon;

    return (

        <div className="canada-overview">

            <div className="container">

                {/* ===========================
                    Header
                =========================== */}

                <div className="canada-overview-header">

                    <span className="canada-overview-tag">

                        CANADA IMMIGRATION PROGRAMS

                    </span>

                    <h2>

                        Find The Right

                        <span> Immigration Pathway.</span>

                    </h2>

                    <p>

                        Canada offers multiple immigration programs designed
                        for different goals and qualifications. Explore each
                        pathway and discover the option that best matches
                        your journey.

                    </p>

                </div>

                {/* ===========================
                    Layout
                =========================== */}

                <motion.div
                    layout
                    className="canada-pathways-layout"
                >

                    {/* ===========================
                        Featured Card
                    =========================== */}

                    <AnimatePresence mode="wait">

                        <motion.div

                            key={featured.id}

                            layout

                            initial={{
                                opacity: 0,
                                x: -60,
                                scale: .95,
                            }}

                            animate={{
                                opacity: 1,
                                x: 0,
                                scale: 1,
                            }}

                            exit={{
                                opacity: 0,
                                x: 60,
                                scale: .95,
                            }}

                            transition={{
                                duration: .55,
                                ease: "easeInOut",
                            }}

                        >

                            <Link

                                to={featured.path}

                                className="featured-pathway-card"

                                style={{
                                    "--featured-image": `url(${featured.image})`,
                                }}

                            >

                               

                                <div className="featured-icon">

                                    <FeaturedIcon />

                                </div>

                                <span className="featured-badge">

                                    {featured.badge}

                                </span>

                                <h3>

                                    {featured.title}

                                </h3>

                                <p>

                                    {featured.description}

                                </p>

                                <ul className="featured-services">

                                    {featured.services.map((service) => (

                                        <li key={service}>

                                            {service}

                                        </li>

                                    ))}

                                </ul>

                                <div className="featured-link">

                                    <span>

                                        Explore Program

                                    </span>

                                    <HiOutlineArrowRight />

                                </div>

                            </Link>

                        </motion.div>

                    </AnimatePresence>

                    {/* ===========================
                        Pathway Strips
                    =========================== */}

                    <div className="pathway-strip-group">

                        <AnimatePresence>

                            {others.map((item) => {

                                const Icon = item.icon;

                                return (

                                    <motion.div

                                        key={item.id}

                                        layout

                                        initial={{
                                            opacity: 0,
                                            y: 30,
                                        }}

                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}

                                        exit={{
                                            opacity: 0,
                                            y: -30,
                                        }}

                                        transition={{
                                            duration: .45,
                                            ease: "easeOut",
                                        }}

                                    >

                                        <Link

                                            to={item.path}

                                            className="pathway-strip"

                                        >

                                            <div className="strip-left">

                                                <div className="strip-icon">

                                                    <Icon />

                                                </div>

                                                <div className="strip-content">

                                                    <h4>

                                                        {item.title}

                                                    </h4>

                                                    <span>

                                                        {item.badge}

                                                    </span>

                                                </div>

                                            </div>

                                            <HiOutlineArrowRight />

                                            {/* Floating Strip Image */}

                                            <img
                                                src={item.image}
                                                alt=""
                                                className="strip-floating-image"
                                            />

                                        </Link>

                                    </motion.div>

                                );

                            })}

                        </AnimatePresence>

                    </div>

                </motion.div>

            </div>

        </div>

    );

};

export default CanadaOverview;