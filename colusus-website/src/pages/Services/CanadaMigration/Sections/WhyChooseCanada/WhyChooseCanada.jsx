import "./WhyChooseCanada.css";

import {
    useState,
    useEffect
} from "react";

import {
    motion,
    AnimatePresence
} from "framer-motion";

import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineSparkles
} from "react-icons/hi";

import {
    whyChooseCanada
} from "./WhyChooseData";

import canadaBackground
    from "../../../../../assets/images/countries/canada-overview.png";


const WhyChooseCanada = () => {

    const [active, setActive] = useState(0);


    useEffect(() => {

        const interval = setInterval(() => {

            setActive((prev) =>
                (prev + 1) % whyChooseCanada.length
            );

        }, 5000);


        return () => clearInterval(interval);

    }, []);


    const featured = whyChooseCanada[active];


    const others = whyChooseCanada.filter(
        (_, index) => index !== active
    );


    const FeaturedIcon = featured.icon;


    const changeFeature = (id) => {

        const index = whyChooseCanada.findIndex(
            item => item.id === id
        );

        if (index !== -1) {
            setActive(index);
        }

    };


    return (

        <section
            className="why-canada"
            style={{
                "--why-canada-background":
                    `url(${canadaBackground})`
            }}
        >

            {/* =================================================
                BACKGROUND SYSTEM
            ================================================= */}

            <div
                className="why-canada-background"
                aria-hidden="true"
            >

                <div className="why-canada-background-image"></div>

                <div className="why-canada-background-fade"></div>

                <span className="canada-leaf leaf-one"></span>

                <span className="canada-leaf leaf-two"></span>

                <span className="canada-orbit orbit-one"></span>

                <span className="canada-orbit orbit-two"></span>

                <span className="canada-particle particle-one"></span>

                <span className="canada-particle particle-two"></span>

                <span className="canada-particle particle-three"></span>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="why-canada-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="why-canada-header">


                    <motion.span
                        className="why-canada-tag"
                        initial={{
                            opacity: 0,
                            y: -25
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}
                        viewport={{
                            once: true,
                            amount: .4
                        }}
                        transition={{
                            duration: .55,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                    >

                        <span className="why-canada-tag-maple">
                            ✦
                        </span>

                        WHY CANADA?

                    </motion.span>


                    <motion.h2
                        initial={{
                            opacity: 0,
                            y: 35
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}
                        viewport={{
                            once: true,
                            amount: .4
                        }}
                        transition={{
                            duration: .7,
                            delay: .08,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                    >

                        <span className="why-title-dark">
                            A Country Built For
                        </span>

                        <span className="why-title-blue">
                            Your Future.
                        </span>

                    </motion.h2>


                    <motion.div
                        className="why-canada-title-accent"
                        initial={{
                            opacity: 0,
                            scaleX: 0
                        }}
                        whileInView={{
                            opacity: 1,
                            scaleX: 1
                        }}
                        viewport={{
                            once: true
                        }}
                        transition={{
                            duration: .65,
                            delay: .2
                        }}
                    >

                        <span></span>

                        <b>✦</b>

                        <span></span>

                    </motion.div>


                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 20
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}
                        viewport={{
                            once: true,
                            amount: .4
                        }}
                        transition={{
                            duration: .65,
                            delay: .18
                        }}
                    >

                        Canada offers more than immigration opportunities.
                        It provides a secure environment, thriving economy,
                        world-class education and an exceptional quality of
                        life for individuals and families.

                    </motion.p>


                </header>



                {/* =================================================
                    MAIN EXPERIENCE
                ================================================= */}

                <div className="why-canada-layout">


                    {/* =================================================
                        FEATURED CARD
                    ================================================= */}

                    <div className="why-feature-column">


                        <AnimatePresence
                            mode="wait"
                        >

                            <motion.article
                                key={featured.id}
                                className="why-feature-card"

                                initial={{
                                    opacity: 0,
                                    x: -55,
                                    scale: .96
                                }}

                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    scale: 1
                                }}

                                exit={{
                                    opacity: 0,
                                    x: 55,
                                    scale: .96
                                }}

                                transition={{
                                    duration: .55,
                                    ease: [0.22, 1, 0.36, 1]
                                }}

                                style={{
                                    "--featured-image":
                                        `url(${featured.image})`
                                }}
                            >


                                {/* IMAGE */}

                                <div className="why-feature-image">

                                    <div className="why-feature-image-overlay"></div>


                                    <div className="why-feature-icon">

                                        <FeaturedIcon />

                                    </div>


                                    <div className="why-feature-floating-label">

                                        <HiOutlineSparkles />

                                        <span>
                                            Featured Benefit
                                        </span>

                                    </div>

                                </div>



                                {/* CONTENT */}

                                <div className="why-feature-content">


                                    <span className="why-feature-badge">

                                        {featured.badge}

                                    </span>


                                    <h3>

                                        {featured.title}

                                    </h3>


                                    <p>

                                        {featured.description}

                                    </p>


                                    <div className="why-highlights">


                                        {featured.highlights.map(
                                            (item, index) => (

                                                <motion.div
                                                    key={item}
                                                    className="highlight-item"

                                                    initial={{
                                                        opacity: 0,
                                                        x: -15
                                                    }}

                                                    animate={{
                                                        opacity: 1,
                                                        x: 0
                                                    }}

                                                    transition={{
                                                        delay:
                                                            .15 +
                                                            (index * .08),
                                                        duration: .4
                                                    }}
                                                >

                                                    <HiOutlineCheckCircle />

                                                    <span>
                                                        {item}
                                                    </span>

                                                </motion.div>

                                            )
                                        )}


                                    </div>


                                    <div className="why-feature-footer">

                                        <span>
                                            Why it matters
                                        </span>

                                        <span className="footer-line"></span>

                                        <HiOutlineArrowRight />

                                    </div>


                                </div>


                            </motion.article>

                        </AnimatePresence>


                    </div>



                    {/* =================================================
                        BENEFIT OPTIONS
                    ================================================= */}

                    <div className="why-small-grid">


                        {others.map((item, index) => {

                            const Icon = item.icon;


                            return (

                                <motion.button

                                    key={item.id}

                                    type="button"

                                    className={
                                        `why-small-card ${featured.id === item.id
                                            ? "active"
                                            : ""
                                        }`
                                    }

                                    onClick={() =>
                                        changeFeature(item.id)
                                    }

                                    initial={{
                                        opacity: 0,
                                        x: 45
                                    }}

                                    whileInView={{
                                        opacity: 1,
                                        x: 0
                                    }}

                                    viewport={{
                                        once: true,
                                        amount: .2
                                    }}

                                    transition={{
                                        duration: .55,
                                        delay: index * .08,
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                >


                                    <span className="small-card-progress"></span>


                                    <div className="why-small-left">


                                        <div className="why-small-icon">

                                            <Icon />

                                        </div>


                                        <div className="why-small-content">

                                            <h4>
                                                {item.title}
                                            </h4>

                                            <span>
                                                {item.badge}
                                            </span>

                                        </div>


                                    </div>


                                    <div className="why-small-arrow">

                                        <HiOutlineArrowRight />

                                    </div>


                                    <div className="why-small-image">

                                        <img
                                            src={item.image}
                                            alt=""
                                            loading="lazy"
                                        />

                                    </div>


                                </motion.button>

                            );

                        })}


                    </div>


                </div>



                {/* =================================================
                    STATS
                ================================================= */}

                <motion.div
                    className="why-canada-stats"

                    initial={{
                        opacity: 0,
                        y: 45
                    }}

                    whileInView={{
                        opacity: 1,
                        y: 0
                    }}

                    viewport={{
                        once: true,
                        amount: .25
                    }}

                    transition={{
                        duration: .7,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                >


                    <div className="stat-card">

                        <div className="stat-icon">
                            <span>♛</span>
                        </div>

                        <div>

                            <h3>
                                #1
                            </h3>

                            <span>
                                Top destination for newcomers
                            </span>

                        </div>

                    </div>



                    <div className="stat-card">

                        <div className="stat-icon">
                            <span>◎</span>
                        </div>

                        <div>

                            <h3>
                                100+
                            </h3>

                            <span>
                                Immigration pathways available
                            </span>

                        </div>

                    </div>



                    <div className="stat-card">

                        <div className="stat-icon">
                            <span>✦</span>
                        </div>

                        <div>

                            <h3>
                                High
                            </h3>

                            <span>
                                Global quality of life ranking
                            </span>

                        </div>

                    </div>


                </motion.div>


            </div>


            {/* =================================================
                BOTTOM ATMOSPHERE
            ================================================= */}

            <div
                className="why-canada-bottom-glow"
                aria-hidden="true"
            ></div>


        </section>

    );

};


export default WhyChooseCanada;