import { useEffect, useState } from "react";

import {
    FaCalendarAlt,
    FaClock,
    FaArrowDown,
    FaArrowRight,
    FaCircle,
    FaTimes,
} from "react-icons/fa";

import nursingImage from "../../../assets/images/opportunities/germany-nursing.jpg";
import globalWorkBackground from "../../../assets/images/global-work/01.png";

import "./WebinarHeader.css";


function WebinarHeader({ webinar }) {

    const [showWaitingPopup, setShowWaitingPopup] = useState(false);

    /* ==================================================
       SIX SECOND ENTRANCE COUNTDOWN
    ================================================== */

    const [secondsRemaining, setSecondsRemaining] = useState(6);


    /* ==================================================
       LIVE DATE + TIME
       Uses the viewer's own device timezone
    ================================================== */

    const [liveDateTime, setLiveDateTime] = useState(() => {
        const now = new Date();

        return {
            date: new Intl.DateTimeFormat(undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(now),

            time: new Intl.DateTimeFormat(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }).format(now),
        };
    });


    /* ==================================================
       UPDATE LIVE CLOCK EVERY SECOND
    ================================================== */

    useEffect(() => {

        const updateLiveDateTime = () => {

            const now = new Date();

            setLiveDateTime({
                date: new Intl.DateTimeFormat(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }).format(now),

                time: new Intl.DateTimeFormat(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }).format(now),
            });

        };


        updateLiveDateTime();


        const liveClock = setInterval(
            updateLiveDateTime,
            1000
        );


        return () => {
            clearInterval(liveClock);
        };

    }, []);


    /* ==================================================
       SHOW POPUP AFTER HERO HAS RENDERED
    ================================================== */

    useEffect(() => {

        const popupTimer = setTimeout(() => {

            setShowWaitingPopup(true);
            setSecondsRemaining(6);

        }, 1000);


        return () => {
            clearTimeout(popupTimer);
        };

    }, []);


    /* ==================================================
       SIX SECOND AUTO START
    ================================================== */

    useEffect(() => {

        if (!showWaitingPopup) {
            return;
        }


        if (secondsRemaining <= 0) {

            enterWebinar();

            return;
        }


        const timer = setTimeout(() => {

            setSecondsRemaining(
                (previous) => previous - 1
            );

        }, 1000);


        return () => {
            clearTimeout(timer);
        };

    }, [
        showWaitingPopup,
        secondsRemaining,
    ]);


    /* ==================================================
       ENTER WEBINAR
    ================================================== */

    const enterWebinar = () => {

        setShowWaitingPopup(false);


        setTimeout(() => {

            const session =
                document.getElementById("webinar-session");


            if (session) {

                session.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

            }

        }, 150);

    };


    return (
        <header
            className="webinar-header"
            style={{
                "--webinar-background-image":
                    `url(${globalWorkBackground})`,
            }}
        >

            {/* ==================================================
                HERO
            ================================================== */}

            <div
                className="webinar-header-content"
                id="webinar-hero"
            >

                {/* BACKGROUND */}

                <div
                    className="webinar-header-background"
                    aria-hidden="true"
                />

                <div
                    className="webinar-header-overlay"
                    aria-hidden="true"
                />

                <div
                    className="webinar-header-color-wash"
                    aria-hidden="true"
                />


                {/* NURSE */}

                <div
                    className="webinar-header-nurse"
                    aria-hidden="true"
                >

                    <div className="webinar-header-nurse-glow" />

                    <img
                        src={nursingImage}
                        alt=""
                    />

                </div>


                {/* HERO CONTENT */}

                <div className="webinar-header-hero">

                    <div className="webinar-header-copy">


                        {/* WELCOME */}

                        <div className="webinar-header-welcome">

                            <span className="webinar-header-welcome-dot">
                                <FaCircle />
                            </span>

                            <span>
                                YOU'RE WELCOME
                            </span>

                        </div>


                        {/* EYEBROW */}

                        <div className="webinar-header-eyebrow">

                            <span className="webinar-header-eyebrow-dot">
                                <FaCircle />
                            </span>

                            <span>
                                IRELAND NURSING OPPORTUNITY
                            </span>

                        </div>


                        {/* TITLE */}

                        <h1 className="webinar-header-title">

                            <span>
                                MIGRATE TO IRELAND
                            </span>

                            <span>
                                AS A NURSE
                            </span>

                            <span className="webinar-header-title-highlight">
                                IN 3 MONTHS
                            </span>

                            <span className="webinar-header-title-earn">

                                <span>
                                    AND EARN
                                </span>

                                <strong>
                                    €36K–€70K
                                </strong>

                                <small>
                                    ANNUALLY
                                </small>

                            </span>

                        </h1>


                        {/* DISCLAIMER */}

                        <p className="webinar-header-subtitle">

                            Depending on qualifications, eligibility,
                            role and employment circumstance.

                        </p>


                        {/* ==================================================
                            LIVE EVENT DETAILS
                        ================================================== */}

                        <div className="webinar-header-event-details">

                            {/* DATE */}

                            <div className="webinar-header-event-detail">

                                <span className="webinar-header-event-icon">
                                    <FaCalendarAlt />
                                </span>

                                <div>

                                    <span>
                                        LIVE DATE
                                    </span>

                                    <strong>
                                        {liveDateTime.date}
                                    </strong>

                                </div>

                            </div>


                            {/* TIME */}

                            <div className="webinar-header-event-detail">

                                <span className="webinar-header-event-icon">
                                    <FaClock />
                                </span>

                                <div>

                                    <span>
                                        LIVE TIME
                                    </span>

                                    <strong>
                                        {liveDateTime.time}
                                    </strong>

                                </div>

                            </div>


                            {/* FORMAT */}

                            <div className="webinar-header-event-detail">

                                <span className="webinar-header-event-duration">
                                    {webinar?.duration || "60 MINUTES"}
                                </span>

                                <div>

                                    <span>
                                        FORMAT
                                    </span>

                                    <strong>
                                        Live Webinar
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* JOIN CUE */}

                        <a
                            href="#webinar-session"
                            className="webinar-header-join"
                        >

                            <span className="webinar-header-join-line" />

                            <span className="webinar-header-join-text">
                                Join the session
                            </span>

                            <span className="webinar-header-join-arrow">
                                <FaArrowDown />
                            </span>

                        </a>

                    </div>

                </div>


                {/* IMAGE LABEL */}

                <div className="webinar-header-visual-label">

                    <span>
                        Colossus Migration & Tours
                    </span>

                    <span>
                        International Recruitment
                    </span>

                </div>

            </div>


            {/* ==================================================
                WAITING POPUP
            ================================================== */}

            {showWaitingPopup && (

                <div className="webinar-waiting-overlay">

                    <div
                        className="webinar-waiting-backdrop"
                        onClick={enterWebinar}
                    />


                    <div
                        className="webinar-waiting-popup"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="webinar-waiting-title"
                    >

                        {/* CLOSE */}

                        <button
                            type="button"
                            className="webinar-waiting-close"
                            onClick={enterWebinar}
                            aria-label="Enter webinar"
                        >

                            <FaTimes />

                        </button>


                        {/* STATUS */}

                        <div className="webinar-waiting-status">

                            <span className="webinar-waiting-status-dot">
                                <FaCircle />
                            </span>

                            <span>
                                LIVE SESSION
                            </span>

                        </div>


                        {/* TITLE */}

                        <h2
                            id="webinar-waiting-title"
                            className="webinar-waiting-title"
                        >
                            Join the webinar
                        </h2>


                        <p className="webinar-waiting-description">

                            You are entering the Ireland Nursing Webinar.
                            The live session is ready for you.

                        </p>


                        {/* ==================================================
                            LIVE DATE + TIME
                        ================================================== */}

                        <div className="webinar-waiting-event">

                            {/* DATE */}

                            <div className="webinar-waiting-event-item">

                                <FaCalendarAlt />

                                <div>

                                    <span>
                                        TODAY
                                    </span>

                                    <strong>
                                        {liveDateTime.date}
                                    </strong>

                                </div>

                            </div>


                            <div className="webinar-waiting-event-divider" />


                            {/* LIVE TIME */}

                            <div className="webinar-waiting-event-item">

                                <FaClock />

                                <div>

                                    <span>
                                        LIVE NOW
                                    </span>

                                    <strong>
                                        {liveDateTime.time}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            SIX SECOND COUNTDOWN
                        ================================================== */}

                        <div className="webinar-six-second-countdown">

                            <div
                                className="webinar-six-second-ring"
                                style={{
                                    "--countdown-progress":
                                        `${((6 - secondsRemaining) / 6) * 360}deg`,
                                }}
                            >

                                <div className="webinar-six-second-inner">

                                    <strong>
                                        {secondsRemaining}
                                    </strong>

                                    <span>
                                        SECONDS
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* MESSAGE */}

                        <p className="webinar-waiting-message">

                            Your webinar will open automatically in{" "}

                            <strong>
                                {secondsRemaining}
                            </strong>{" "}

                            {secondsRemaining === 1
                                ? "second"
                                : "seconds"}.

                        </p>


                        {/* CTA */}

                        <button
                            type="button"
                            className="webinar-waiting-join-button"
                            onClick={enterWebinar}
                        >

                            <span>
                                JOIN WEBINAR SESSION
                            </span>

                            <FaArrowRight />

                        </button>


                        {/* CONFIRMATION */}

                        <div className="webinar-waiting-confirmation">

                            <span>
                                Session ID:
                            </span>

                            <strong>
                                SESS-948201
                            </strong>

                            <span>
                                •
                            </span>

                            <span>
                                Live Session
                            </span>

                        </div>

                    </div>

                </div>

            )}

        </header>
    );
}


export default WebinarHeader;