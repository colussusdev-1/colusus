import "./CanadaOverview.css";

import { Link } from "react-router-dom";

import {
    motion,
    AnimatePresence
} from "framer-motion";

import {
    HiOutlineArrowRight
} from "react-icons/hi";

import {
    pathways
} from "../../data/pathways";

import useRotatePathways from "./useRotatePathways";



const CanadaOverview = () => {


    const {
        featured,
        others,
    } = useRotatePathways(pathways);



    const FeaturedIcon = featured.icon;



    return (


        <section className="canada-overview">


            <div className="container">





                {/* HEADER */}

                <header className="canada-overview-header">


                    <span className="canada-overview-tag">

                        CANADA IMMIGRATION PATHWAYS

                    </span>




                    <h2>

                        Choose The Right

                        <span>
                            Pathway For Your Future.
                        </span>

                    </h2>




                    <p>

                        Every immigration journey is different.
                        We help you understand your options,
                        assess your eligibility and choose the
                        pathway that aligns with your goals.

                    </p>



                </header>







                {/* PATHWAYS LAYOUT */}


                <motion.div

                    layout

                    className="canada-pathways-layout"

                >







                    {/* FEATURED PATHWAY */}


                    <AnimatePresence mode="wait">


                        <motion.div


                            key={featured.id}


                            layout



                            initial={{
                                opacity: 0,
                                x: -60,
                                scale: .95
                            }}


                            animate={{
                                opacity: 1,
                                x: 0,
                                scale: 1
                            }}



                            exit={{
                                opacity: 0,
                                x: 60,
                                scale: .95
                            }}



                            transition={{
                                duration: .55,
                                ease: "easeInOut"
                            }}



                        >



                            <Link


                                to={featured.path}


                                className="featured-pathway-card"



                                style={{
                                    "--featured-image":
                                        `url(${featured.image})`
                                }}



                            >






                                <div className="featured-icon">


                                    <FeaturedIcon />


                                </div>






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


                                    {
                                        featured.services.map(
                                            service => (

                                                <li key={service}>

                                                    {service}

                                                </li>

                                            )
                                        )
                                    }


                                </ul>







                                <div className="featured-link">


                                    <span>

                                        Explore Pathway

                                    </span>



                                    <HiOutlineArrowRight />


                                </div>





                            </Link>



                        </motion.div>


                    </AnimatePresence>














                    {/* OTHER PATHWAYS */}


                    <div className="pathway-strip-group">



                        <AnimatePresence>


                            {
                                others.map((item) => {


                                    const Icon = item.icon;



                                    return (



                                        <motion.div


                                            key={item.id}


                                            layout



                                            initial={{
                                                opacity: 0,
                                                y: 30
                                            }}



                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}



                                            exit={{
                                                opacity: 0,
                                                y: -30
                                            }}



                                            transition={{
                                                duration: .45,
                                                ease: "easeOut"
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








                                                <img


                                                    src={item.image}


                                                    alt={`${item.title} Canada pathway`}


                                                    className="strip-floating-image"


                                                    loading="lazy"


                                                />





                                            </Link>






                                        </motion.div>


                                    );


                                })
                            }



                        </AnimatePresence>



                    </div>







                </motion.div>







            </div>



        </section>


    );


};



export default CanadaOverview;