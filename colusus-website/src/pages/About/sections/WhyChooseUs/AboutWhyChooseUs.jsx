import "./AboutWhyChooseUs.css";

import {
    HiOutlineShieldCheck,
    HiOutlineGlobeAlt,
    HiOutlineAcademicCap,
    HiOutlineBriefcase,
    HiOutlineDocumentText,
    HiOutlineUserGroup,
    HiOutlineSparkles,
} from "react-icons/hi";

import whyBackground from "../../../../assets/about/why-background.png";


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
        icon: <HiOutlineUserGroup />,
    },

    {
        value: "15+",
        label: "Countries Served",
        icon: <HiOutlineGlobeAlt />,
    },

    {
        value: "24/7",
        label: "Expert Support",
        icon: <HiOutlineShieldCheck />,
    },

];


const AboutWhyChooseUs = () => {

    return (

        <section
            className="about-why"
            style={{
                "--why-background": `url(${whyBackground})`,
            }}
        >


            {/* =================================================
                BACKGROUND SYSTEM
            ================================================= */}

            <div className="about-why-background">

                <div className="about-why-background-image"></div>

                <div className="about-why-background-overlay"></div>

                <div className="about-why-blue-glow"></div>

                <span className="why-star star-one"></span>

                <span className="why-star star-two"></span>

                <span className="why-star star-three"></span>

                <span className="why-star star-four"></span>

                <span className="why-star star-five"></span>

            </div>


            {/* =================================================
                DECORATIVE ORBITS
            ================================================= */}

            <div className="why-orbit orbit-left"></div>

            <div className="why-orbit orbit-right"></div>


            <div className="container about-why-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="about-why-header">


                    <span className="about-why-tag">

                        <HiOutlineSparkles />

                        <span>
                            THE COLOSSUS DIFFERENCE
                        </span>

                    </span>


                    <h2>

                        Why Thousands

                        <br />

                        Trust

                        <span>
                            Colossus
                        </span>

                        <br />

                        <em>
                            Migration & Tours.
                        </em>

                    </h2>


                    <div className="about-why-title-line"></div>


                    <p>

                        We combine professional expertise, verified
                        processes and personalized support to make
                        international migration simpler, safer and
                        more successful.

                    </p>


                </div>


                {/* =================================================
                    SERVICE PILLS
                ================================================= */}

                <div className="about-why-pills">

                    {pills.map((item, index) => (

                        <div
                            key={item.text}
                            className="about-why-pill"
                            style={{
                                "--pill-delay": `${index * 80}ms`,
                            }}
                        >

                            <span className="about-why-pill-icon">

                                {item.icon}

                            </span>

                            <span className="about-why-pill-text">

                                {item.text}

                            </span>

                        </div>

                    ))}

                </div>


                {/* =================================================
                    STATS
                ================================================= */}

                <div className="about-why-stats">

                    {stats.map((item, index) => (

                        <div
                            key={item.label}
                            className="about-why-stat"
                            style={{
                                "--stat-delay": `${index * 120}ms`,
                            }}
                        >

                            <div className="about-why-stat-icon">

                                {item.icon}

                            </div>


                            <div className="about-why-stat-content">

                                <h3>

                                    {item.value}

                                </h3>

                                <span>

                                    {item.label}

                                </span>

                            </div>

                        </div>

                    ))}

                </div>


                {/* =================================================
                    QUOTE
                ================================================= */}

                <div className="about-why-quote">


                    <span className="about-why-quote-mark quote-left">

                        “

                    </span>


                    <p>

                        We don't simply process applications.
                        <strong>
                            We build pathways that change lives.
                        </strong>

                    </p>


                    <span className="about-why-quote-mark quote-right">

                        ”

                    </span>


                </div>


            </div>


            {/* =================================================
                BOTTOM LIGHT
            ================================================= */}

            <div className="about-why-bottom-glow"></div>


        </section>

    );

};


export default AboutWhyChooseUs;