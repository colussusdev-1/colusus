import "./HowItWorks.css";

import {
    HiOutlineCursorClick,
    HiOutlineClipboardCheck,
    HiOutlineDocumentText,
    HiOutlineGlobeAlt,
} from "react-icons/hi";

const steps = [

    {
        icon: HiOutlineCursorClick,
        title: "Choose Your Pathway",
        text: "Select the immigration or work program that matches your goal.",
    },

    {
        icon: HiOutlineClipboardCheck,
        title: "Eligibility Review",
        text: "We assess your profile and recommend the strongest option.",
    },

    {
        icon: HiOutlineDocumentText,
        title: "Documentation",
        text: "We prepare and organize all required application documents.",
    },

    {
        icon: HiOutlineGlobeAlt,
        title: "Application & Relocation",
        text: "We submit your application and guide you until approval.",
    },

];

const HowItWorks = () => {

    return (

        <div className="how-it-works">

            <div className="container">

                <div className="how-header">

                    <span>PROCESS</span>

                    <h2>
                        Simple Steps.
                        <span> Global Results.</span>
                    </h2>

                </div>

                <div className="steps-grid">

                    {steps.map((step, index) => {

                        const Icon = step.icon;

                        return (

                            <div className="step-card" key={step.title}>

                                <div className="step-number">
                                    {index + 1}
                                </div>

                                <Icon />

                                <h3>{step.title}</h3>

                                <p>{step.text}</p>

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>

    );
};

export default HowItWorks;