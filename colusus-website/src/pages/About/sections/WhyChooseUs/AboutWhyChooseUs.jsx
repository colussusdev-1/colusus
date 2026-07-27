import "./AboutWhyChooseUs.css";

import {
    HiOutlineShieldCheck,
    HiOutlineGlobeAlt,
    HiOutlineAcademicCap,
    HiOutlineBriefcase,
    HiOutlineDocumentText,
    HiOutlineUserGroup,
} from "react-icons/hi";

const pills = [

    {
        icon: <HiOutlineShieldCheck />,
        text: "Trusted Guidance",
    },

    {
        icon: <HiOutlineGlobeAlt />,
        text: "Global Reach",
    },

    {
        icon: <HiOutlineAcademicCap />,
        text: "Study Abroad",
    },

    {
        icon: <HiOutlineBriefcase />,
        text: "Overseas Jobs",
    },

    {
        icon: <HiOutlineDocumentText />,
        text: "Visa Processing",
    },

    {
        icon: <HiOutlineUserGroup />,
        text: "Personalized Support",
    },

];

const stats = [

    {
        value: "500+",
        label: "Clients Assisted",
    },

    {
        value: "15+",
        label: "Countries",
    },

    {
        value: "24/7",
        label: "Expert Support",
    },

];

const AboutWhyChooseUs = () => {

    return (

        <section className="about-why">

            <div className="container">

                <div className="about-why-header">

                    <span className="about-why-tag">

                        THE COLOSSUS DIFFERENCE

                    </span>

                    <h2>

                        Why Thousands Trust

                        <span> Colossus Migration & Tours.</span>

                    </h2>

                    <p>

                        We combine transparent guidance, verified opportunities
                        and personalized support to make international migration
                        simpler, safer and more successful.

                    </p>

                </div>

                <div className="about-why-pills">

                    {pills.map((item) => (

                        <div
                            key={item.text}
                            className="about-why-pill"
                        >

                            {item.icon}

                            <span>

                                {item.text}

                            </span>

                        </div>

                    ))}

                </div>

                <div className="about-why-stats">

                    {stats.map((item) => (

                        <div
                            key={item.label}
                            className="about-why-stat"
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

                <div className="about-why-quote">

                    <p>

                        “We don't simply process applications.
                        We build pathways that change lives.”

                    </p>

                </div>

            </div>

        </section>

    );

};

export default AboutWhyChooseUs;