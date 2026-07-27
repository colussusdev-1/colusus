import "./TouristHeroVisual.css";

import {
    HiOutlineGlobeAlt,
    HiOutlineLocationMarker,
    HiOutlineBadgeCheck,
    HiOutlineDocumentText,
    HiOutlinePaperAirplane,
    HiOutlineSparkles,
} from "react-icons/hi";

const destinations = [
    "Canada",
    "United Kingdom",
    "Schengen Area",
    "Australia",
];

const TouristHeroVisual = () => {

    return (

        <div className="tvDash">

            <div className="tvDash__orb"></div>

            <div className="tvDash__card">

                <div className="tvDash__header">

                    <div className="tvDash__icon">

                        <HiOutlineGlobeAlt />

                    </div>

                    <div>

                        <h3>Travel Planner</h3>

                        <span>Your visa journey at a glance</span>

                    </div>

                </div>

                <div className="tvDash__destinations">

                    {destinations.map((country) => (

                        <div
                            key={country}
                            className="tvDash__destination"
                        >

                            <div>

                                <HiOutlineLocationMarker />

                                <span>{country}</span>

                            </div>

                            <HiOutlineBadgeCheck />

                        </div>

                    ))}

                </div>

                <div className="tvDash__progress">

                    <div className="tvDash__progressTop">

                        <span>Application Readiness</span>

                        <strong>95%</strong>

                    </div>

                    <div className="tvDash__bar">

                        <span></span>

                    </div>

                </div>

            </div>

            <div className="tvDashMini">

                <div className="tvDashMini__icon">

                    <HiOutlineDocumentText />

                </div>

                <div>

                    <h4>Documents Verified</h4>

                    <p>Your application is ready for consultant review.</p>

                </div>

            </div>

            <div className="tvDashFloat">

                <HiOutlineSparkles />

                <span>Visa Strategy Ready</span>

                <HiOutlinePaperAirplane />

            </div>

        </div>

    );

};

export default TouristHeroVisual;