import "./CanadaHero.css";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    HiOutlineArrowRight,
    HiOutlineBadgeCheck,
    HiOutlineGlobeAlt,
    HiOutlineOfficeBuilding,
} from "react-icons/hi";

import heroImage from "../../../../../assets/images/countries/canada.jpg";

const CanadaHero = () => {

    const [isMobile, setIsMobile] = useState(
        window.innerWidth <= 768
    );

    useEffect(() => {

        const handleResize = () => {

            setIsMobile(
                window.innerWidth <= 768
            );

        };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () =>
            window.removeEventListener(
                "resize",
                handleResize
            );

    }, []);

    return (

        <section className="canada-hero">

            <div className="container canada-hero-container">

                {/* LEFT */}

                <div className="canada-hero-content">

                    <span className="canada-hero-tag">

                        Canada Immigration

                    </span>

                    <h1 className="canada-hero-title">

                        Your Canadian Dream

                        <span>

                            Starts With The Right Strategy.

                        </span>

                    </h1>

                    <p className="canada-hero-description">

                        {
                            isMobile
                                ? "Work, study or immigrate to Canada with expert guidance tailored to your goals."
                                : "Whether you're planning to work, study, reunite with family or become a permanent resident, Colossus Migration & Tours guides you through every step of your Canadian immigration journey."
                        }

                    </p>

                    <div className="canada-hero-buttons">

                        <Link
                            to="/consultation"
                            className="canada-hero-btn"
                        >

                            <span>

                                Book Consultation

                            </span>

                            <HiOutlineArrowRight />

                        </Link>

                    </div>

                    <div className="canada-trust-row">

                        <div className="trust-pill">

                            <HiOutlineBadgeCheck />

                            <span>

                                Verified Pathways

                            </span>

                        </div>

                        <div className="trust-pill">

                            <HiOutlineOfficeBuilding />

                            <span>

                                Professional Guidance

                            </span>

                        </div>

                        <div className="trust-pill">

                            <HiOutlineGlobeAlt />

                            <span>

                                End-to-End Support

                            </span>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="canada-hero-image">

                    <img
                        src={heroImage}
                        alt="Canada Immigration"
                    />

                    <div className="floating-card top-right">

                        <strong>

                            Express Entry

                        </strong>

                        <span>

                            Fast-track immigration

                        </span>

                    </div>

                    <div className="floating-card left-middle">

                        <strong>

                            Work Permit

                        </strong>

                        <span>

                            Employer & Open Permit

                        </span>

                    </div>

                    <div className="floating-card bottom-right">

                        <strong>

                            Permanent Residence

                        </strong>

                        <span>

                            Your long-term pathway

                        </span>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default CanadaHero;