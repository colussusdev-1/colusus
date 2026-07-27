import "./AboutValues.css";

import {
    HiOutlineShieldCheck,
    HiOutlineSparkles,
    HiOutlineHeart,
    HiOutlineGlobeAlt,
    HiOutlineBadgeCheck,
} from "react-icons/hi";

const values = [

    {
        icon: <HiOutlineShieldCheck />,
        title: "Integrity",
        text: "Honest guidance with complete transparency throughout every migration journey.",
    },

    {
        icon: <HiOutlineSparkles />,
        title: "Excellence",
        text: "We pursue the highest standards in every application and every client experience.",
    },

    {
        icon: <HiOutlineHeart />,
        title: "Commitment",
        text: "Your goals become our mission from consultation to successful relocation.",
    },

    {
        icon: <HiOutlineGlobeAlt />,
        title: "Global Impact",
        text: "Helping people unlock opportunities across borders and build better futures.",
    },

    {
        icon: <HiOutlineBadgeCheck />,
        title: "Professionalism",
        text: "Experienced support delivered with precision, respect and accountability.",
    },

];

const AboutValues = () => {

    return (

        <section className="about-values">

            <div className="container">

                <div className="about-values-header">

                    <span className="about-values-tag">

                        OUR VALUES

                    </span>

                    <h2>

                        The Principles

                        <span> That Guide Everything We Do</span>

                    </h2>

                    <p>

                        Every decision we make is rooted in trust,
                        professionalism and an unwavering commitment
                        to helping our clients achieve their global ambitions.

                    </p>

                </div>

                <div className="about-values-grid">

                    {values.map((value, index) => (

                        <article
                            key={index}
                            className="about-value-card"
                        >

                            <div className="about-value-icon">

                                {value.icon}

                            </div>

                            <h3>

                                {value.title}

                            </h3>

                            <p>

                                {value.text}

                            </p>

                        </article>

                    ))}

                </div>

            </div>

        </section>

    );

};

export default AboutValues;