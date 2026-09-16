
import {
    FaArrowRight,
    FaUserTie,
} from "react-icons/fa";

import "./WebinarHost.css";


function WebinarHost({ webinar }) {

    const host = webinar?.host;


    if (!host) {
        return null;
    }


    const hostImage =
        "https://i.ibb.co/PvfJWN0n/Colossus-Migration-Apostle-Anthony-Chiugo-Joshephat.png";


    return (

        <article className="webinar-host">

            {/* ==================================================
                HOST PORTRAIT
            ================================================== */}

            <div className="webinar-host-portrait">

                <div className="webinar-host-portrait-frame">

                    {hostImage ? (

                        <img
                            src={hostImage}
                            alt={host.name}
                            className="webinar-host-image"
                        />

                    ) : (

                        <div className="webinar-host-image-placeholder">
                            <FaUserTie />
                        </div>

                    )}

                </div>


                <div
                    className="webinar-host-portrait-accent"
                    aria-hidden="true"
                />

            </div>


            {/* ==================================================
                HOST INFORMATION
            ================================================== */}

            <div className="webinar-host-content">

                <div className="webinar-host-content-top">

                    <span className="webinar-host-label">
                        HOSTED BY
                    </span>

                    <span className="webinar-host-line" />

                </div>


                <h3 className="webinar-host-name">
                    {host.name}
                </h3>


                {host.role && (

                    <p className="webinar-host-role">
                        {host.role}
                    </p>

                )}


                {host.bio && (

                    <p className="webinar-host-bio">
                        {host.bio}
                    </p>

                )}


                <div className="webinar-host-footer">

                    <span>
                        Colossus Migration & Tours
                    </span>

                    <span
                        className="webinar-host-arrow"
                        aria-hidden="true"
                    >
                        <FaArrowRight />
                    </span>

                </div>

            </div>

        </article>

    );

}


export default WebinarHost;
