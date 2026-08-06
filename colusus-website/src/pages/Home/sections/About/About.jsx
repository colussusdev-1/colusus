import "./Home-about.css";

import { Link } from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
} from "react-icons/hi";

import aboutImage from "../../../../assets/images/about/about.jpg";

const About = () => {

    const trustPoints = [

        "Work Visa Pathways",

        "Study Opportunities",

        "Immigration Guidance",

        "Travel Support",

    ];

    return (

        <section className="home-about">

            <div className="container home-about-container">

                {/* IMAGE EXPERIENCE */}

                <div className="home-about-image">

                    <img
                        src={aboutImage}
                        alt="Colossus Migration and Tours helping clients explore international opportunities"
                    />

                    <div className="home-about-image-overlay"></div>

                    <div className="home-about-trust-card">

                        <span>

                            Trusted Support For

                        </span>

                        <p>

                            Professionals • Students • Families

                        </p>

                        <small>

                            Seeking opportunities abroad

                        </small>

                    </div>

                </div>

                {/* CONTENT */}

                <div className="home-about-content">

                    <span className="home-about-tag">

                        ABOUT COLOSSUS

                    </span>

                    <h2>

                        Trusted Pathways

                        <br />

                        To Canada

                        <span>

                            & Beyond

                        </span>

                    </h2>

                    <p>

                        Colossus Migration & Tours helps professionals,
                        students, families and entrepreneurs confidently
                        explore global opportunities through trusted
                        immigration pathways, overseas employment and
                        international education solutions.

                    </p>

                    <div className="home-about-trust-points">

                        {

                            trustPoints.map((item, index) => (

                                <div key={index}>

                                    <HiOutlineCheckCircle />

                                    <span>

                                        {item}

                                    </span>

                                </div>

                            ))

                        }

                    </div>

                    <div className="home-about-buttons">

                        <Link

                            to="/about"

                            className="home-about-contact-btn"

                        >

                            Learn More About Us

                            <HiOutlineArrowRight />

                        </Link>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default About;