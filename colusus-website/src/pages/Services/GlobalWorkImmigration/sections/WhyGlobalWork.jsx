import "./WhyGlobalWork.css";

import {
    HiOutlineGlobeAlt,
    HiOutlineBadgeCheck,
    HiOutlineLightningBolt,
    HiOutlineOfficeBuilding,
} from "react-icons/hi";


const items = [

    {
        number: "01",
        icon: HiOutlineGlobeAlt,
        title: "Worldwide Career Pathways",
        text:
            "Discover verified international employment and relocation routes across leading global destinations.",
        theme: "blue",
    },


    {
        number: "02",
        icon: HiOutlineBadgeCheck,
        title: "Trusted Migration Support",
        text:
            "Every opportunity is carefully reviewed to help you avoid unreliable offers and migration risks.",
        theme: "green",
    },


    {
        number: "03",
        icon: HiOutlineLightningBolt,
        title: "End-To-End Guidance",
        text:
            "From eligibility assessment and documentation to application support, we simplify the entire journey.",
        theme: "orange",
    },


    {
        number: "04",
        icon: HiOutlineOfficeBuilding,
        title: "Relocation Assistance",
        text:
            "Receive professional support preparing for your transition and building your future abroad.",
        theme: "purple",
    },

];



const WhyGlobalWork = () => {


    return (

        <section className="why-global">


            <div className="why-background"></div>



            <div className="container">


                <header className="why-global-header">


                    <span className="why-global-tag">

                        GLOBAL WORK ADVANTAGE

                    </span>



                    <h2>

                        Building Your Pathway

                        <span>
                            To Global Success
                        </span>

                    </h2>



                    <p>

                        International relocation requires the right strategy,
                        preparation and trusted guidance. We help professionals
                        move confidently toward better opportunities worldwide.

                    </p>


                </header>





                <div className="why-grid">


                    {
                        items.map((item) => {


                            const Icon = item.icon;


                            return (

                                <article

                                    key={item.number}

                                    className={`why-card ${item.theme}`}

                                >


                                    <div className="card-top">


                                        <span className="why-number">

                                            {item.number}

                                        </span>



                                        <div className="why-icon">

                                            <Icon />

                                        </div>


                                    </div>



                                    <div className="why-content">


                                        <h3>

                                            {item.title}

                                        </h3>



                                        <p>

                                            {item.text}

                                        </p>


                                    </div>



                                    <div className="card-line"></div>



                                </article>

                            )


                        })
                    }


                </div>


            </div>


        </section>

    );

};


export default WhyGlobalWork;