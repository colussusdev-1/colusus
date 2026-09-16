import {
    FaCircle,
    FaCalendarAlt,
    FaClock,
} from "react-icons/fa";

import logo from "../../../assets/logo.png";

import "./WebinarNavigation.css";


function WebinarNavigation({ webinar }) {

    const isLive = webinar?.status === "live";

    return (
        <nav className="webinar-navigation">

            <div className="webinar-navigation-inner">

                {/* LOGO */}
                <a
                    href="/"
                    className="webinar-navigation-logo"
                    aria-label="Colossus Migration & Tours"
                >
                    <img
                        src={logo}
                        alt="Colossus Migration & Tours"
                    />
                </a>


                {/* STATUS */}
                <div
                    className={`webinar-navigation-status ${isLive
                            ? "webinar-navigation-status-live"
                            : "webinar-navigation-status-upcoming"
                        }`}
                >
                    <span className="webinar-navigation-status-indicator">
                        <FaCircle />
                    </span>

                    <span>
                        {isLive
                            ? "LIVE NOW"
                            : "UPCOMING WEBINAR"}
                    </span>
                </div>


                {/* EVENT INFORMATION */}
                <div className="webinar-navigation-info">

                    <div className="webinar-navigation-info-item">

                        <FaCalendarAlt />

                        <div>
                            <span>DATE</span>

                            <strong>
                                {webinar?.date || "Coming Soon"}
                            </strong>
                        </div>

                    </div>


                    <span
                        className="webinar-navigation-divider"
                        aria-hidden="true"
                    />


                    <div className="webinar-navigation-info-item">

                        <FaClock />

                        <div>
                            <span>STARTS</span>

                            <strong>
                                {webinar?.time || "Coming Soon"}{" "}
                                {webinar?.timezone || ""}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

        </nav>
    );
}

export default WebinarNavigation;