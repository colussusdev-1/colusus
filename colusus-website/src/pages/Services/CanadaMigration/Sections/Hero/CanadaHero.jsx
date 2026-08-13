import "./CanadaHero.css";

import { Link } from "react-router-dom";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    HiOutlineArrowRight,
    HiOutlineBadgeCheck,
    HiOutlineGlobeAlt,
    HiOutlineOfficeBuilding,
    HiOutlineAcademicCap,
    HiOutlineBriefcase,
    HiOutlineHome,
} from "react-icons/hi";

import heroImage from "../../../../../assets/images/countries/canada.jpg";
import canadaBackground from "../../../../../assets/images/countries/canada-background.png";


const pathways = [
    {
        icon: <HiOutlineGlobeAlt />,
        title: "Express Entry",
    },
    {
        icon: <HiOutlineBriefcase />,
        title: "Work Permit",
    },
    {
        icon: <HiOutlineAcademicCap />,
        title: "Study Permit",
    },
    {
        icon: <HiOutlineHome />,
        title: "Permanent Residence",
    },
];


/* =========================================================
   ANIMATION SYSTEM
========================================================= */

const heroContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.09,
            delayChildren: 0.15,
        },
    },
};


const leftReveal = {
    hidden: {
        opacity: 0,
        x: -55,
        y: 15,
        filter: "blur(8px)",
    },

    show: {
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",

        transition: {
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};


const titleLine = {
    hidden: {
        opacity: 0,
        y: 55,
        filter: "blur(7px)",
    },

    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",

        transition: {
            duration: 0.72,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};


const imageReveal = {
    hidden: {
        opacity: 0,
        x: 75,
        scale: 0.91,
        rotate: 1.5,
        filter: "blur(8px)",
    },

    show: {
        opacity: 1,
        x: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",

        transition: {
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};


const cardReveal = {
    hidden: {
        opacity: 0,
        x: 45,
        y: 35,
        scale: 0.92,
    },

    show: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,

        transition: {
            duration: 0.7,
            delay: 0.35,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};


const floatingReveal = {
    hidden: {
        opacity: 0,
        x: 35,
        y: 25,
        scale: 0.8,
    },

    show: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,

        transition: {
            duration: 0.65,
            delay: 0.65,
            type: "spring",
            stiffness: 120,
            damping: 14,
        },
    },
};


const pathwayContainer = {
    hidden: {},

    show: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.58,
        },
    },
};


const pathwayItem = {
    hidden: {
        opacity: 0,
        x: 22,
    },

    show: {
        opacity: 1,
        x: 0,

        transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};


const CanadaHero = () => {

    const shouldReduceMotion = useReducedMotion();


    /*
        Reduced-motion fallback.
        Keeps the component completely usable
        for accessibility.
    */

    const initialState = shouldReduceMotion
        ? false
        : "hidden";

    const animateState = shouldReduceMotion
        ? false
        : "show";


    return (

        <section
            className="canada-hero"

            style={{
                "--canada-background": `url(${canadaBackground})`,
            }}
        >


            {/* =================================================
                BACKGROUND
            ================================================= */}

            <motion.div
                className="canada-hero-background"
                aria-hidden="true"

                initial={
                    shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            scale: 1.04,
                        }
                }

                animate={
                    shouldReduceMotion
                        ? false
                        : {
                            opacity: 1,
                            scale: 1,
                        }
                }

                transition={{
                    duration: 1.5,
                    ease: [0.16, 1, 0.3, 1],
                }}
            >

                <div className="canada-hero-background-image"></div>

                <motion.div
                    className="canada-hero-background-glow"

                    animate={
                        shouldReduceMotion
                            ? {}
                            : {
                                scale: [1, 1.08, 1],
                                opacity: [0.55, 0.8, 0.55],
                            }
                    }

                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <motion.span
                    className="canada-background-dot canada-dot-one"

                    animate={
                        shouldReduceMotion
                            ? {}
                            : {
                                y: [0, -12, 0],
                                x: [0, 5, 0],
                                opacity: [0.35, 0.8, 0.35],
                            }
                    }

                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <motion.span
                    className="canada-background-dot canada-dot-two"

                    animate={
                        shouldReduceMotion
                            ? {}
                            : {
                                y: [0, 10, 0],
                                x: [0, -6, 0],
                                opacity: [0.3, 0.7, 0.3],
                            }
                    }

                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />

                <motion.span
                    className="canada-background-dot canada-dot-three"

                    animate={
                        shouldReduceMotion
                            ? {}
                            : {
                                y: [0, -8, 0],
                                opacity: [0.25, 0.65, 0.25],
                            }
                    }

                    transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />

            </motion.div>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <motion.div
                className="canada-hero-container"

                variants={heroContainer}

                initial={initialState}

                animate={animateState}
            >


                {/* =================================================
                    LEFT CONTENT
                ================================================= */}

                <motion.div
                    className="canada-hero-content"
                    variants={leftReveal}
                >


                    {/* EYEBROW */}

                    <motion.div
                        className="canada-hero-eyebrow"
                        variants={leftReveal}
                    >

                        <motion.span
                            className="canada-eyebrow-dot"

                            animate={
                                shouldReduceMotion
                                    ? {}
                                    : {
                                        scale: [1, 1.35, 1],
                                        opacity: [0.7, 1, 0.7],
                                    }
                            }

                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />

                        <span>
                            CANADA IMMIGRATION PATHWAY
                        </span>

                    </motion.div>


                    {/* TITLE */}

                    <h1 className="canada-hero-title">

                        <motion.span
                            className="canada-title-dark"
                            variants={titleLine}
                        >
                            Build Your
                        </motion.span>

                        <motion.span
                            className="canada-title-dark"
                            variants={titleLine}
                        >
                            Future
                        </motion.span>

                        <motion.span
                            className="canada-title-blue"
                            variants={titleLine}
                        >
                            In Canada
                        </motion.span>

                        <motion.span
                            className="canada-title-blue"
                            variants={titleLine}
                        >
                            With Confidence.
                        </motion.span>

                    </h1>


                    {/* ACCENT */}

                    <motion.div
                        className="canada-hero-title-accent"

                        initial={
                            shouldReduceMotion
                                ? false
                                : {
                                    opacity: 0,
                                    scaleX: 0,
                                    transformOrigin: "left",
                                }
                        }

                        animate={
                            shouldReduceMotion
                                ? false
                                : {
                                    opacity: 1,
                                    scaleX: 1,
                                }
                        }

                        transition={{
                            duration: 0.7,
                            delay: 0.75,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >

                        <span></span>

                    </motion.div>


                    {/* DESCRIPTION */}

                    <motion.p
                        className="canada-hero-description"
                        variants={leftReveal}
                    >

                        Explore the right immigration pathway based on
                        your goals, profile and eligibility. From Express
                        Entry and work permits to study routes and
                        permanent residence, we guide you through every
                        important step.

                    </motion.p>


                    {/* CTA */}

                    <motion.div
                        className="canada-hero-actions"

                        initial={
                            shouldReduceMotion
                                ? false
                                : {
                                    opacity: 0,
                                    y: 25,
                                    scale: 0.94,
                                }
                        }

                        animate={
                            shouldReduceMotion
                                ? false
                                : {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }
                        }

                        transition={{
                            delay: 0.82,
                            duration: 0.65,
                            type: "spring",
                            stiffness: 110,
                            damping: 15,
                        }}
                    >

                        <Link
                            to="/consultation"
                            className="canada-hero-btn"
                        >

                            <span>
                                Start Your Assessment
                            </span>

                            <motion.span
                                className="canada-btn-icon"

                                whileHover={
                                    shouldReduceMotion
                                        ? {}
                                        : {
                                            x: 4,
                                        }
                                }

                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15,
                                }}
                            >

                                <HiOutlineArrowRight />

                            </motion.span>

                        </Link>

                    </motion.div>


                    {/* TRUST */}

                    <motion.div
                        className="canada-trust-row"

                        variants={heroContainer}

                        initial={initialState}

                        animate={animateState}
                    >

                        <motion.div
                            className="canada-trust-item"
                            variants={leftReveal}
                            whileHover={
                                shouldReduceMotion
                                    ? {}
                                    : {
                                        y: -4,
                                    }
                            }
                        >

                            <span className="canada-trust-icon">
                                <HiOutlineBadgeCheck />
                            </span>

                            <span>
                                Profile Assessment
                            </span>

                        </motion.div>


                        <motion.div
                            className="canada-trust-item"
                            variants={leftReveal}
                            whileHover={
                                shouldReduceMotion
                                    ? {}
                                    : {
                                        y: -4,
                                    }
                            }
                        >

                            <span className="canada-trust-icon">
                                <HiOutlineOfficeBuilding />
                            </span>

                            <span>
                                Immigration Guidance
                            </span>

                        </motion.div>


                        <motion.div
                            className="canada-trust-item"
                            variants={leftReveal}
                            whileHover={
                                shouldReduceMotion
                                    ? {}
                                    : {
                                        y: -4,
                                    }
                            }
                        >

                            <span className="canada-trust-icon">
                                <HiOutlineGlobeAlt />
                            </span>

                            <span>
                                Complete Support
                            </span>

                        </motion.div>

                    </motion.div>


                    {/* META */}

                    <motion.div
                        className="canada-hero-meta"

                        initial={
                            shouldReduceMotion
                                ? false
                                : {
                                    opacity: 0,
                                    x: -25,
                                }
                        }

                        animate={
                            shouldReduceMotion
                                ? false
                                : {
                                    opacity: 1,
                                    x: 0,
                                }
                        }

                        transition={{
                            duration: 0.6,
                            delay: 1.1,
                        }}
                    >

                        <span className="canada-meta-line"></span>

                        <span>
                            Your pathway. Your future. Our guidance.
                        </span>

                    </motion.div>


                </motion.div>


                {/* =================================================
                    RIGHT VISUAL
                ================================================= */}

                <motion.div
                    className="canada-hero-visual"
                    variants={imageReveal}
                >


                    {/* HALO */}

                    <motion.div
                        className="canada-image-halo"

                        animate={
                            shouldReduceMotion
                                ? {}
                                : {
                                    scale: [1, 1.04, 1],
                                    opacity: [0.5, 0.75, 0.5],
                                }
                        }

                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />


                    {/* IMAGE FRAME */}

                    <motion.div
                        className="canada-image-frame"

                        whileHover={
                            shouldReduceMotion
                                ? {}
                                : {
                                    y: -7,
                                    scale: 1.01,
                                }
                        }

                        transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >

                        <div className="canada-image-inner">

                            <motion.img
                                src={heroImage}
                                alt="Vancouver, Canada"

                                initial={
                                    shouldReduceMotion
                                        ? false
                                        : {
                                            scale: 1.08,
                                        }
                                }

                                animate={
                                    shouldReduceMotion
                                        ? false
                                        : {
                                            scale: 1,
                                        }
                                }

                                transition={{
                                    duration: 1.4,
                                    delay: 0.15,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                            />

                        </div>


                        {/* LABEL */}

                        <motion.div
                            className="canada-image-label"

                            initial={
                                shouldReduceMotion
                                    ? false
                                    : {
                                        opacity: 0,
                                        y: -12,
                                    }
                            }

                            animate={
                                shouldReduceMotion
                                    ? false
                                    : {
                                        opacity: 1,
                                        y: 0,
                                    }
                            }

                            transition={{
                                delay: 0.9,
                                duration: 0.5,
                            }}
                        >

                            <span className="canada-image-label-dot"></span>

                            <span>
                                CANADA
                            </span>

                        </motion.div>


                        {/* NUMBER */}

                        <motion.div
                            className="canada-image-number"

                            initial={
                                shouldReduceMotion
                                    ? false
                                    : {
                                        opacity: 0,
                                        y: -15,
                                    }
                            }

                            animate={
                                shouldReduceMotion
                                    ? false
                                    : {
                                        opacity: 1,
                                        y: 0,
                                    }
                            }

                            transition={{
                                delay: 1,
                                duration: 0.5,
                            }}
                        >
                            01
                        </motion.div>

                    </motion.div>


                    {/* =================================================
                        PATHWAY CARD
                    ================================================= */}

                    <motion.div
                        className="canada-pathway-card"
                        variants={cardReveal}
                    >


                        <div className="canada-pathway-header">

                            <div>

                                <span className="canada-pathway-eyebrow">
                                    CANADA PATHWAYS
                                </span>

                                <h3>
                                    Choose The Right Route
                                </h3>

                            </div>


                            <motion.span
                                className="canada-pathway-globe"

                                animate={
                                    shouldReduceMotion
                                        ? {}
                                        : {
                                            rotate: [0, 8, -8, 0],
                                        }
                                }

                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >

                                <HiOutlineGlobeAlt />

                            </motion.span>

                        </div>


                        {/* PATHWAY ITEMS */}

                        <motion.div
                            className="canada-pathway-list"

                            variants={pathwayContainer}

                            initial={initialState}

                            animate={animateState}
                        >

                            {pathways.map((pathway, index) => (

                                <motion.div
                                    className="canada-pathway-item"

                                    key={pathway.title}

                                    variants={pathwayItem}

                                    whileHover={
                                        shouldReduceMotion
                                            ? {}
                                            : {
                                                x: 5,
                                            }
                                    }
                                >

                                    <span className="canada-pathway-item-icon">
                                        {pathway.icon}
                                    </span>

                                    <span className="canada-pathway-item-title">
                                        {pathway.title}
                                    </span>

                                    <span className="canada-pathway-item-number">
                                        0{index + 1}
                                    </span>

                                </motion.div>

                            ))}

                        </motion.div>


                        <div className="canada-pathway-footer">

                            <motion.span
                                className="canada-pathway-status"

                                animate={
                                    shouldReduceMotion
                                        ? {}
                                        : {
                                            scale: [1, 1.3, 1],
                                            opacity: [0.6, 1, 0.6],
                                        }
                                }

                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            <span>
                                Personalized pathway guidance
                            </span>

                        </div>


                    </motion.div>


                    {/* =================================================
                        FLOATING BADGE
                    ================================================= */}

                    <motion.div
                        className="canada-floating-badge"
                        variants={floatingReveal}

                        animate={
                            shouldReduceMotion
                                ? false
                                : {
                                    opacity: 1,
                                    x: 0,
                                    y: [0, -7, 0],
                                    scale: 1,
                                }
                        }

                        transition={
                            shouldReduceMotion
                                ? {}
                                : {
                                    opacity: {
                                        duration: 0.6,
                                        delay: 0.65,
                                    },

                                    x: {
                                        duration: 0.6,
                                        delay: 0.65,
                                    },

                                    scale: {
                                        duration: 0.6,
                                        delay: 0.65,
                                    },

                                    y: {
                                        duration: 4.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1.3,
                                    },
                                }
                        }
                    >

                        <span className="canada-floating-icon">

                            <HiOutlineBadgeCheck />

                        </span>

                        <div>

                            <strong>
                                Expert Guidance
                            </strong>

                            <span>
                                From application to arrival
                            </span>

                        </div>

                    </motion.div>


                </motion.div>


            </motion.div>


            {/* =================================================
                BOTTOM EDGE
            ================================================= */}

            <motion.div
                className="canada-hero-bottom"
                aria-hidden="true"

                initial={
                    shouldReduceMotion
                        ? false
                        : {
                            scaleX: 0,
                            opacity: 0,
                        }
                }

                animate={
                    shouldReduceMotion
                        ? false
                        : {
                            scaleX: 1,
                            opacity: 1,
                        }
                }

                transition={{
                    duration: 1,
                    delay: 1.15,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >

                <span></span>

            </motion.div>


        </section>

    );

};


export default CanadaHero;