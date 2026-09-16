
import {
    FaEnvelope,
    FaMapMarkerAlt,
    FaGlobe,
    FaArrowUp,
} from "react-icons/fa";

import "./WebinarFooter.css";


function WebinarFooter({ webinar }) {

    const footer = webinar?.footer;


    if (!footer) {
        return null;
    }


    const handleBackToTop = (event) => {

        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    return (

        <footer className="webinar-footer">

            {/* ==================================================
                TOP ATMOSPHERE
            ================================================== */}

            <div
                className="webinar-footer-glow"
                aria-hidden="true"
            />


            <div className="webinar-container webinar-footer-inner">

                {/* ==================================================
                    BRAND
                ================================================== */}

                <div className="webinar-footer-brand">

                    <span className="webinar-footer-kicker">
                        COLLOSSUS MIGRATION & TOURS
                    </span>


                    <p className="webinar-footer-company">
                        {footer.companyName}
                    </p>


                    {footer.description && (

                        <p className="webinar-footer-description">
                            {footer.description}
                        </p>

                    )}

                </div>


                {/* ==================================================
                    CONTACT INFORMATION
                ================================================== */}

                <div className="webinar-footer-meta">

                    {footer.location && (

                        <div className="webinar-footer-meta-item">

                            <span className="webinar-footer-meta-icon">
                                <FaMapMarkerAlt />
                            </span>

                            <div>
                                <small>
                                    LOCATION
                                </small>

                                <span>
                                    {footer.location}
                                </span>
                            </div>

                        </div>

                    )}


                    {footer.email && (

                        <a
                            href={`mailto:${footer.email}`}
                            className="webinar-footer-meta-item"
                        >

                            <span className="webinar-footer-meta-icon">
                                <FaEnvelope />
                            </span>

                            <div>
                                <small>
                                    EMAIL
                                </small>

                                <span>
                                    {footer.email}
                                </span>
                            </div>

                        </a>

                    )}


                    {footer.website && (

                        <a
                            href={footer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="webinar-footer-meta-item"
                        >

                            <span className="webinar-footer-meta-icon">
                                <FaGlobe />
                            </span>

                            <div>
                                <small>
                                    WEBSITE
                                </small>

                                <span>
                                    Visit our website
                                </span>
                            </div>

                        </a>

                    )}

                </div>


                {/* ==================================================
                    FOOTER BOTTOM
                ================================================== */}

                <div className="webinar-footer-bottom">

                    <span className="webinar-footer-copyright">
                        © {new Date().getFullYear()}{" "}
                        {footer.companyName}.
                        All rights reserved.
                    </span>


                    <button
                        type="button"
                        className="webinar-footer-top"
                        onClick={handleBackToTop}
                        aria-label="Back to top"
                    >

                        <span>
                            Back to top
                        </span>

                        <FaArrowUp />

                    </button>

                </div>

            </div>

        </footer>

    );

}


export default WebinarFooter;
