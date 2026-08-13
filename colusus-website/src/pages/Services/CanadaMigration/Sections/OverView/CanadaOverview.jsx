import "./CanadaOverview.css";

import { Link } from "react-router-dom";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import {
    HiOutlineArrowRight,
    HiOutlineSparkles,
} from "react-icons/hi";

import {
    pathways,
} from "../../data/pathways";

import useRotatePathways from "./useRotatePathways";

import overviewBackground
    from "../../../../../assets/images/countries/canada-overview-background.png";


const CanadaOverview = () => {

    const {
        featured,
        others,
    } = useRotatePathways(pathways);


    const FeaturedIcon = featured.icon;


    return (

        <section
            className="canada-overview"
            style={{
                "--canada-overview-background":
                    `url(${overviewBackground})`,
            }}
        >


            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div
                className="canada-overview-background"
                aria-hidden="true"
            >

                <div className="canada-overview-background-image"></div>

                <div className="canada-overview-background-glow"></div>

                <span className="canada-overview-orbit orbit-one"></span>

                <span className="canada-overview-orbit orbit-two"></span>

                <span className="canada-overview-orbit orbit-three"></span>

            </div>




            <div className="canada-overview-container">


                {/* =====================================================
                    HEADER
                ===================================================== */}

                <header className="canada-overview-header">


                    <motion.span
                        className="canada-overview-tag"
                        initial={{
                            opacity: 0,
                            y: -25,
                            scale: .92,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        viewport={{
                            once: true,
                            amount: .3,
                        }}
                        transition={{
                            duration: .6,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >

                        <HiOutlineSparkles />

                        CANADA IMMIGRATION PATHWAYS

                    </motion.span>




                    <motion.h2
                        initial={{
                            opacity: 0,
                            y: 35,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: .3,
                        }}
                        transition={{
                            duration: .75,
                            delay: .08,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >

                        Choose The Right

                        <span>
                            Pathway For Your Future.
                        </span>

                    </motion.h2>




                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: .3,
                        }}
                        transition={{
                            duration: .65,
                            delay: .16,
                            ease: "easeOut",
                        }}
                    >

                        Every immigration journey is different.
                        We help you understand your options,
                        assess your eligibility and choose the
                        pathway that aligns with your goals.

                    </motion.p>


                    <motion.div
                        className="canada-overview-header-line"
                        initial={{
                            opacity: 0,
                            scaleX: 0,
                        }}
                        whileInView={{
                            opacity: 1,
                            scaleX: 1,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            duration: .7,
                            delay: .25,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    />

                </header>




                {/* =====================================================
                    PATHWAYS
                ===================================================== */}

                <motion.div
                    layout
                    className="canada-pathways-layout"
                >


                    {/* =================================================
                        FEATURED PATHWAY
                    ================================================= */}

                    <AnimatePresence mode="wait">


                        <motion.div
                            key={featured.id}
                            className="canada-featured-wrapper"

                            initial={{
                                opacity: 0,
                                x: -80,
                                scale: .94,
                            }}

                            animate={{
                                opacity: 1,
                                x: 0,
                                scale: 1,
                            }}

                            exit={{
                                opacity: 0,
                                x: 80,
                                scale: .94,
                            }}

                            transition={{
                                duration: .65,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >


                            <Link
                                to={featured.path}
                                className="featured-pathway-card"

                                style={{
                                    "--featured-image":
                                        `url(${featured.image})`,
                                }}
                            >


                                {/* Image atmosphere */}

                                <div className="featured-image-layer"></div>

                                <div className="featured-image-wash"></div>




                                {/* Top */}

                                <div className="featured-card-top">


                                    <div className="featured-icon">

                                        <FeaturedIcon />

                                    </div>


                                    <span className="featured-card-index">
                                        01
                                    </span>

                                </div>




                                {/* Content */}

                                <div className="featured-card-content">


                                    <div className="featured-meta">


                                        <span className="featured-badge">
                                            {featured.badge}
                                        </span>


                                        <span className="featured-country">
                                            🇨🇦 Canada
                                        </span>


                                    </div>




                                    <h3>
                                        {featured.title}
                                    </h3>




                                    <p>
                                        {featured.description}
                                    </p>




                                    <ul className="featured-services">

                                        {featured.services.map(
                                            (service) => (

                                                <li key={service}>

                                                    <span className="service-dot"></span>

                                                    {service}

                                                </li>

                                            )
                                        )}

                                    </ul>


                                </div>




                                {/* Bottom CTA */}

                                <div className="featured-card-bottom">


                                    <span>
                                        Explore Pathway
                                    </span>


                                    <span className="featured-arrow">

                                        <HiOutlineArrowRight />

                                    </span>


                                </div>


                            </Link>


                        </motion.div>


                    </AnimatePresence>




                    {/* =================================================
                        OTHER PATHWAYS
                    ================================================= */}

                    <div className="pathway-strip-group">


                        <div className="pathway-group-heading">

                            <span>
                                OTHER PATHWAYS
                            </span>

                            <span className="pathway-heading-line"></span>

                            <span>
                                02 — 04
                            </span>

                        </div>




                        <AnimatePresence mode="popLayout">


                            {others.map(
                                (item, index) => {

                                    const Icon = item.icon;


                                    return (

                                        <motion.div
                                            key={item.id}
                                            className="pathway-strip-wrapper"

                                            layout

                                            initial={{
                                                opacity: 0,
                                                x: 70,
                                            }}

                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}

                                            exit={{
                                                opacity: 0,
                                                x: -70,
                                            }}

                                            transition={{
                                                duration: .5,
                                                delay: index * .08,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                        >


                                            <Link
                                                to={item.path}
                                                className="pathway-strip"
                                            >


                                                {/* Small image atmosphere */}

                                                <div
                                                    className="strip-image"
                                                    style={{
                                                        backgroundImage:
                                                            `url(${item.image})`,
                                                    }}
                                                />




                                                <div className="strip-overlay"></div>




                                                <div className="strip-left">


                                                    <div className="strip-icon">

                                                        <Icon />

                                                    </div>


                                                    <div className="strip-content">


                                                        <span className="strip-number">

                                                            0{index + 2}

                                                        </span>


                                                        <h4>
                                                            {item.title}
                                                        </h4>


                                                        <span className="strip-badge">
                                                            {item.badge}
                                                        </span>


                                                    </div>


                                                </div>




                                                <div className="strip-arrow">

                                                    <HiOutlineArrowRight />

                                                </div>


                                            </Link>


                                        </motion.div>

                                    );

                                }
                            )}


                        </AnimatePresence>


                    </div>


                </motion.div>


            </div>


        </section>

    );

};


export default CanadaOverview;