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
    HiOutlineArrowRight
} from "react-icons/hi";

import {
    whyChooseCanada
} from "./whyChooseData";



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


        setActive(index);


    };





    return (

        <section className="why-canada">


            <div className="container">



                {/* =========================
                    HEADER
                ========================== */}


                <div className="why-canada-header">


                    <span className="why-canada-tag">

                        WHY CANADA?

                    </span>



                    <h2>

                        A Country Built For

                        <span>
                            Your Future.
                        </span>

                    </h2>



                    <p>

                        Canada offers more than immigration opportunities.
                        It provides a secure environment, thriving economy,
                        world-class education and an exceptional quality of
                        life for individuals and families.

                    </p>



                </div>






                {/* =========================
                    MAIN CONTENT
                ========================== */}



                <div className="why-canada-layout">





                    {/* FEATURE CARD */}



                    <AnimatePresence mode="wait">


                        <motion.div

                            key={featured.id}

                            className="why-feature-card"


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

                                duration: .45

                            }}

                        >



                            <div className="why-feature-glow"></div>





                            <div className="why-feature-icon">


                                <FeaturedIcon />


                            </div>





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


                                {
                                    featured.highlights.map((item) => (


                                        <div

                                            key={item}

                                            className="highlight-item"

                                        >


                                            <span></span>


                                            {item}



                                        </div>


                                    ))
                                }


                            </div>





                        </motion.div>



                    </AnimatePresence>









                    {/* RIGHT OPTIONS */}





                    <div className="why-small-grid">



                        {
                            others.map((item) => {


                                const Icon = item.icon;



                                return (


                                    <button


                                        key={item.id}



                                        className={

                                            `why-small-card ${featured.id === item.id

                                                ? "active"

                                                : ""

                                            }`

                                        }



                                        onClick={() => changeFeature(item.id)}



                                    >



                                        <div className="why-small-left">



                                            <div className="why-small-icon">


                                                <Icon />


                                            </div>





                                            <div>


                                                <h4>

                                                    {item.title}

                                                </h4>




                                                <span>

                                                    {item.badge}

                                                </span>



                                            </div>



                                        </div>





                                        <HiOutlineArrowRight />




                                    </button>



                                );


                            })
                        }



                    </div>





                </div>









                {/* =========================
                    TRUST STATS
                ========================== */}



                <div className="why-canada-stats">





                    <div className="stat-card">


                        <h3>

                            #1

                        </h3>


                        <span>

                            Top destination for newcomers

                        </span>


                    </div>







                    <div className="stat-card">


                        <h3>

                            100+

                        </h3>


                        <span>

                            Immigration pathways available

                        </span>


                    </div>







                    <div className="stat-card">


                        <h3>

                            High

                        </h3>


                        <span>

                            Global quality of life ranking

                        </span>


                    </div>





                </div>





            </div>



        </section>

    );

};



export default WhyChooseCanada;