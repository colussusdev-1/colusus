import "./WhyGlobalWork.css";

import {
    HiOutlineGlobe,
    HiOutlineBadgeCheck,
    HiOutlineLightningBolt,
    HiOutlineOfficeBuilding,
} from "react-icons/hi";


const items = [

    {
        icon: HiOutlineGlobe,
        title: "Global Opportunities",
        text:
            "Access immigration and work pathways across multiple countries worldwide.",
        theme: "blue",
    },

    {
        icon: HiOutlineBadgeCheck,
        title: "Verified Pathways",
        text:
            "We only use approved, legal and recognized immigration programs.",
        theme: "green",
    },

    {
        icon: HiOutlineLightningBolt,
        title: "Faster Processing",
        text:
            "We guide you to avoid delays and improve application success speed.",
        theme: "orange",
    },

    {
        icon: HiOutlineOfficeBuilding,
        title: "Expert Guidance",
        text:
            "Get support from experienced migration and relocation consultants.",
        theme: "purple",
    },

];


const WhyGlobalWork = () => {

    return (

        <section className="why-global">

            <div className="container">


                {/* ==========================
                    HEADER
                =========================== */}

                <div className="why-global-header">

                    <span className="why-global-tag">

                        WHY GLOBAL WORK

                    </span>


                    <h2>

                        Your Gateway To

                        <span>
                            International Opportunities
                        </span>

                    </h2>


                    <p>

                        From finding the right migration pathway
                        to preparing your application, we help you
                        move confidently across borders.

                    </p>

                </div>



                {/* ==========================
                    FEATURE GRID
                =========================== */}

                <div className="why-grid">


                    {items.map((item) => {


                        const Icon = item.icon;


                        return (

                            <article

                                className={`why-card ${item.theme}`}

                                key={item.title}

                            >
                                <div className="why-card-files">

                                    <span></span>
                                    <span></span>
                                    <span></span>

                                </div>

                                <div className="why-icon">

                                    <Icon />

                                </div>



                                <div className="why-content">


                                    <h3>

                                        {item.title}

                                    </h3>



                                    <p>

                                        {item.text}

                                    </p>


                                </div>



                            </article>

                        );


                    })}


                </div>


            </div>


        </section>

    );

};


export default WhyGlobalWork;