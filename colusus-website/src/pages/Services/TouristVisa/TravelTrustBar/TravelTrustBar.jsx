import "./TravelTrustBar.css";

import {
    HiOutlineShieldCheck,
    HiOutlineDocumentText,
    HiOutlineGlobeAlt,
    HiOutlineClock
} from "react-icons/hi";

const trustItems = [

    {
        icon: HiOutlineShieldCheck,
        title: "Professional Guidance",
        description:
            "Expert support throughout your visa application journey."
    },

    {
        icon: HiOutlineDocumentText,
        title: "Document Review",
        description:
            "Comprehensive checks before submission."
    },

    {
        icon: HiOutlineGlobeAlt,
        title: "Multiple Destinations",
        description:
            "Travel support for popular destinations worldwide."
    },

    {
        icon: HiOutlineClock,
        title: "Timely Updates",
        description:
            "Stay informed throughout every stage."
    }

];

const stats = [

    {
        value: "20+",
        label: "Destinations"
    },

    {
        value: "95%",
        label: "Application Accuracy"
    },

    {
        value: "Fast",
        label: "Consultation Response"
    }

];

const TravelTrustBar = () => {

    return (

        <section className="travel-trust">

            <div className="container">

                <div className="travel-trust-wrapper">

                    <div className="travel-trust-left">

                        <span className="travel-trust-tag">

                            WHY TRAVEL WITH US

                        </span>

                        <h2>

                            Travel Planning Backed By

                            <span> Professional Guidance.</span>

                        </h2>

                        <p>

                            Every successful trip begins with proper preparation.
                            Our specialists help reduce mistakes, improve
                            application quality and guide you from planning to
                            submission.

                        </p>

                    </div>

                    <div className="travel-trust-right">

                        {trustItems.map((item) => {

                            const Icon = item.icon;

                            return (

                                <div
                                    key={item.title}
                                    className="travel-trust-card"
                                >

                                    <div className="travel-trust-icon">

                                        <Icon />

                                    </div>

                                    <h3>

                                        {item.title}

                                    </h3>

                                    <p>

                                        {item.description}

                                    </p>

                                </div>

                            );

                        })}

                    </div>

                </div>

                <div className="travel-trust-stats">

                    {stats.map((item) => (

                        <div
                            key={item.label}
                            className="travel-stat"
                        >

                            <h3>

                                {item.value}

                            </h3>

                            <span>

                                {item.label}

                            </span>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

};

export default TravelTrustBar;