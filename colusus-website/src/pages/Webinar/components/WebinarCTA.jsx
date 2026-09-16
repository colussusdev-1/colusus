
import {
    FaWhatsapp,
    FaArrowRight,
} from "react-icons/fa";

import "./WebinarCTA.css";


function WebinarCTA({ webinar }) {

    const cta = webinar?.cta;


    if (!cta?.enabled) {
        return null;
    }


    const whatsappNumber =
        String(cta.whatsappNumber || "")
            .replace(/\D/g, "");


    const whatsappMessage =
        cta.whatsappMessage ||
        "Hello Colossus Migration & Tours, I just watched the Ireland Nursing Webinar and would like to speak with your team about my migration options.";


    const whatsappUrl =
        whatsappNumber
            ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  whatsappMessage
              )}`
            : "#";


    return (

        <div className="webinar-cta">

            {/* ==================================================
                BACKGROUND DETAIL
            ================================================== */}

            <div
                className="webinar-cta-orbit"
                aria-hidden="true"
            />

            <div
                className="webinar-cta-glow"
                aria-hidden="true"
            />


            {/* ==================================================
                CONTENT
            ================================================== */}

            <div className="webinar-cta-content">

                <div className="webinar-cta-eyebrow">

                  

                    <span>
                        READY TO TAKE THE NEXT STEP?
                    </span>

                </div>


                <h2 className="webinar-cta-title">

                    {cta.title ||
                        "Let's talk about your journey to Ireland."}

                </h2>


                {cta.description && (

                    <p className="webinar-cta-description">
                        {cta.description}
                    </p>

                )}


                {/* ==================================================
                    ACTION
                ================================================== */}

                {whatsappNumber && (

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="webinar-cta-button"
                    >

                        <span className="webinar-cta-button-icon">
                            <FaWhatsapp />
                        </span>


                        <span className="webinar-cta-button-copy">

                            <small>
                                TALK TO OUR TEAM
                            </small>

                            <strong>
                                {cta.buttonText ||
                                    "Speak With Our Team"}
                            </strong>

                        </span>


                        <span className="webinar-cta-button-arrow">
                            <FaArrowRight />
                        </span>

                    </a>

                )}


                <p className="webinar-cta-note">
                    Connect with Colossus Migration & Tours directly
                    for personalised guidance.
                </p>

            </div>

        </div>

    );

}


export default WebinarCTA;
