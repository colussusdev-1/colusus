import "./JourneySelector.css";

import { Link } from "react-router-dom";

import {
    HiOutlineBriefcase,
    HiOutlineAcademicCap,
    HiOutlineGlobeAlt,
    HiOutlineHome,
    HiOutlineArrowRight,
} from "react-icons/hi2";

const pathways = [
    {
        title: "Work Abroad",
        subtitle: "International Employment",
        description:
            "Explore verified job opportunities and work visa pathways across multiple destinations.",

        icon: HiOutlineBriefcase,

        path: "/opportunities/work",

        color: "blue",
    },

    {
        title: "Study Abroad",
        subtitle: "Education Pathways",
        description:
            "Find universities, colleges and student visa opportunities worldwide.",

        icon: HiOutlineAcademicCap,

        path: "/opportunities/study",

        color: "green",
    },

    {
        title: "Visit & Tourism",
        subtitle: "Short-Term Travel",
        description:
            "Travel for tourism, business or family visits with expert guidance.",

        icon: HiOutlineGlobeAlt,

        path: "/opportunities/travel",

        color: "orange",
    },

    {
        title: "Permanent Residence",
        subtitle: "Long-Term Migration",
        description:
            "Build your future abroad through permanent residency pathways.",

        icon: HiOutlineHome,

        path: "/opportunities/permanent-residence",

        color: "purple",
    },
];

const JourneySelector = () => {
    return (
        <section className="journey-selector">

            <div className="container">

                <header className="journey-header">

                    <span>Your Next Step</span>

                    <h2>

                        What Brings You

                        <strong> Here Today?</strong>

                    </h2>

                    <p>

                        Choose the pathway that best matches your goal and
                        discover opportunities designed for your journey.

                    </p>

                </header>

                <div className="journey-grid">

                    {pathways.map((item) => {

                        const Icon = item.icon;

                        return (

                            <Link

                                key={item.title}

                                to={item.path}

                                className={`journey-card ${item.color}`}

                            >

                                <div className="journey-top">

                                    <div className="journey-icon">

                                        <Icon />

                                    </div>

                                    <HiOutlineArrowRight className="arrow" />

                                </div>

                                <span className="journey-subtitle">

                                    {item.subtitle}

                                </span>

                                <h3>{item.title}</h3>

                                <p>{item.description}</p>

                                <div className="journey-footer">

                                    Explore Opportunity

                                </div>

                            </Link>

                        );

                    })}

                </div>

            </div>

        </section>
    );
};

export default JourneySelector;