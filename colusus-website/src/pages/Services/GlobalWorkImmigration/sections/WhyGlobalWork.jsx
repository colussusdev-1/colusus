import "./WhyGlobalWork.css";

import {
    HiOutlineGlobeAlt,
    HiOutlineBadgeCheck,
    HiOutlineLightningBolt,
    HiOutlineOfficeBuilding,
} from "react-icons/hi";


import globalWorkBackground
    from "../../../../assets/images/global-work/global-work-background.png";

import cardImage01
    from "../../../../assets/images/global-work/01.png";

import cardImage02
    from "../../../../assets/images/global-work/02.png";

import cardImage03
    from "../../../../assets/images/global-work/03.png";

import cardImage04
    from "../../../../assets/images/global-work/04.png";


const items = [

    {
        number: "01",

        icon: HiOutlineGlobeAlt,

        title:
            "Worldwide Career Pathways",

        text:
            "Discover verified international employment and relocation routes across leading global destinations.",

        theme: "blue",

        image: cardImage01,
    },


    {
        number: "02",

        icon: HiOutlineBadgeCheck,

        title:
            "Trusted Migration Support",

        text:
            "Every opportunity is carefully reviewed to help you avoid unreliable offers and migration risks.",

        theme: "green",

        image: cardImage02,
    },


    {
        number: "03",

        icon: HiOutlineLightningBolt,

        title:
            "End-To-End Guidance",

        text:
            "From eligibility assessment and documentation to application support, we simplify the entire journey.",

        theme: "orange",

        image: cardImage03,
    },


    {
        number: "04",

        icon: HiOutlineOfficeBuilding,

        title:
            "Relocation Assistance",

        text:
            "Receive professional support preparing for your transition and building your future abroad.",

        theme: "purple",

        image: cardImage04,
    },

];


const WhyGlobalWork = () => {

    return (

        <section
            className="why-global"
            aria-labelledby="why-global-title"

            style={{
                "--global-work-background":
                    `url(${globalWorkBackground})`,
            }}
        >


            {/* =================================================
                GLOBAL BACKGROUND
            ================================================= */}

            <div
                className="why-global-background"
                aria-hidden="true"
            >

                <div className="why-global-background-image"></div>

                <div className="why-global-background-depth"></div>

            </div>



            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="why-global-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="why-global-header">


                    <span className="why-global-tag">

                        <span className="why-global-tag-dot"></span>

                        GLOBAL WORK ADVANTAGE

                    </span>



                    <h2 id="why-global-title">


                        <span className="why-global-title-dark">

                            Building Your Pathway

                        </span>


                        <span className="why-global-title-blue">

                            To Global Success

                        </span>


                    </h2>



                    <div className="why-global-header-line"></div>



                    <p>

                        International relocation requires the right strategy,
                        preparation and trusted guidance. We help professionals
                        move confidently toward better opportunities worldwide.

                    </p>


                </header>



                {/* =================================================
                    CARDS
                ================================================= */}

                <div className="why-global-grid">


                    {items.map((item, index) => {


                        const Icon = item.icon;


                        return (


                            <article
                                key={item.number}

                                className={`
                                    why-global-card
                                    why-global-card-${item.theme}
                                `}

                                style={{
                                    "--card-index": index,

                                    "--card-image":
                                        `url(${item.image})`,
                                }}
                            >


                                {/* =================================================
                                    INDIVIDUAL CARD ARTWORK
                                ================================================= */}

                                <div
                                    className="why-global-card-image"
                                    aria-hidden="true"
                                ></div>


                                {/* =================================================
                                    IMAGE TRANSITION / READABILITY LAYER
                                ================================================= */}

                                <div
                                    className="why-global-card-image-overlay"
                                    aria-hidden="true"
                                ></div>



                                {/* =================================================
                                    CARD CONTENT
                                ================================================= */}

                                <div className="why-global-card-inner">


                                    {/* =================================================
                                        TOP
                                    ================================================= */}

                                    <div className="why-global-card-top">


                                        <span className="why-global-number">

                                            {item.number}

                                        </span>



                                        <div className="why-global-icon">

                                            <Icon />

                                        </div>


                                    </div>



                                    {/* =================================================
                                        CONTENT
                                    ================================================= */}

                                    <div className="why-global-card-content">


                                        <span className="why-global-card-label">

                                            {item.number === "01" &&
                                                "GLOBAL OPPORTUNITIES"
                                            }

                                            {item.number === "02" &&
                                                "TRUSTED GUIDANCE"
                                            }

                                            {item.number === "03" &&
                                                "FULL JOURNEY SUPPORT"
                                            }

                                            {item.number === "04" &&
                                                "RELOCATION SUPPORT"
                                            }

                                        </span>



                                        <h3>

                                            {item.title}

                                        </h3>



                                        <p>

                                            {item.text}

                                        </p>


                                    </div>



                                    {/* =================================================
                                        FOOTER
                                    ================================================= */}

                                    <div className="why-global-card-footer">


                                        <span className="why-global-card-line"></span>


                                        <span className="why-global-card-index">

                                            {item.number}

                                        </span>


                                    </div>


                                </div>



                                {/* =================================================
                                    CARD GLOW
                                ================================================= */}

                                <span
                                    className="why-global-card-glow"
                                    aria-hidden="true"
                                ></span>


                            </article>

                        );

                    })}


                </div>


            </div>



            {/* =================================================
                BOTTOM ATMOSPHERE
            ================================================= */}

            <div
                className="why-global-bottom-fade"
                aria-hidden="true"
            ></div>


        </section>

    );

};


export default WhyGlobalWork;