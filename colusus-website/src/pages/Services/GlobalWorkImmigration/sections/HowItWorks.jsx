import "./HowItWorks.css";

import {
    HiOutlineSearch,
    HiOutlineClipboardCheck,
    HiOutlineDocumentText,
    HiOutlineGlobeAlt,
} from "react-icons/hi";


const steps = [

    {
        number: "01",
        icon: HiOutlineSearch,

        title: "Discover Your Opportunity",

        text:
            "We analyse your profile, experience and goals to identify the strongest international work and migration pathways available to you."
    },


    {
        number: "02",
        icon: HiOutlineClipboardCheck,

        title: "Eligibility & Strategy",

        text:
            "Our specialists evaluate your eligibility and create a personalised migration strategy designed around your career ambitions."
    },


    {
        number: "03",
        icon: HiOutlineDocumentText,

        title: "Application Preparation",

        text:
            "We help you prepare documentation, applications and requirements with accuracy to maximise your chances of success."
    },


    {
        number: "04",
        icon: HiOutlineGlobeAlt,

        title: "Approval & Global Transition",

        text:
            "From approval preparation to relocation guidance, we support you as you begin your journey into a new country."
    }

];



const HowItWorks = () => {


    return (

        <section className="how-it-works">


            <div className="how-container">


                <div className="how-header">


                    <span>
                        HOW IT WORKS
                    </span>



                    <h2>

                        Your Global Journey

                        <strong>
                            Simplified Step By Step
                        </strong>

                    </h2>



                    <p>

                        International relocation involves many decisions.
                        Our structured process gives you clarity, confidence
                        and professional guidance from start to finish.

                    </p>


                </div>





                <div className="steps-wrapper">


                    <div className="steps-line"></div>



                    {
                        steps.map((step) => {


                            const Icon = step.icon;


                            return (

                                <article
                                    className="step-card"
                                    key={step.number}
                                >


                                    <div className="step-marker">


                                        <div className="step-icon">

                                            <Icon />

                                        </div>



                                        <span>

                                            {step.number}

                                        </span>


                                    </div>





                                    <div className="step-content">


                                        <h3>

                                            {step.title}

                                        </h3>



                                        <p>

                                            {step.text}

                                        </p>


                                    </div>





                                    <div className="step-watermark">

                                        {step.number}

                                    </div>



                                </article>


                            )

                        })
                    }



                </div>


            </div>


        </section>

    );

};


export default HowItWorks;