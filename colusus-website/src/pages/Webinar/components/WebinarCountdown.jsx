import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FaCalendarAlt,
    FaClock,
    FaCircle,
} from "react-icons/fa";

import "./WebinarCountdown.css";


function getCountdown(targetDate) {

    const now = new Date();

    const target = new Date(targetDate);

    const difference =
        target.getTime() -
        now.getTime();


    if (difference <= 0) {

        return {
            total: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

    }


    const seconds =
        Math.floor(
            difference / 1000
        );


    const days =
        Math.floor(
            seconds /
            (60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (seconds %
                (60 * 60 * 24)) /
            (60 * 60)
        );


    const minutes =
        Math.floor(
            (seconds %
                (60 * 60)) /
            60
        );


    const remainingSeconds =
        seconds % 60;


    return {
        total: difference,

        days,

        hours,

        minutes,

        seconds: remainingSeconds,
    };

}


function WebinarCountdown({ webinar }) {

    const targetDate = useMemo(() => {

        const date =
            webinar?.date || "";

        const time =
            webinar?.time ||
            "12:00 PM";


        return new Date(
            `${date} ${time}`
        );

    }, [
        webinar?.date,
        webinar?.time,
    ]);


    const [
        countdown,
        setCountdown,
    ] = useState(() =>
        getCountdown(targetDate)
    );


    useEffect(() => {

        const updateCountdown = () => {

            setCountdown(
                getCountdown(targetDate)
            );

        };


        updateCountdown();


        const interval =
            window.setInterval(
                updateCountdown,
                1000
            );


        return () => {

            window.clearInterval(
                interval
            );

        };

    }, [
        targetDate,
    ]);


    const isLive =
        webinar?.status === "live" ||
        countdown.total <= 0;


    const formatNumber = (
        value
    ) => {

        return String(value)
            .padStart(2, "0");

    };


    /* =====================================================
       LIVE
    ===================================================== */

    if (isLive) {

        return (

            <section className="webinar-countdown-section">

                <div className="webinar-countdown-container">

                    <div className="webinar-countdown-live">

                        <div className="webinar-countdown-live-status">

                            <span className="webinar-countdown-live-dot">
                                <FaCircle />
                            </span>

                            <span>
                                LIVE NOW
                            </span>

                        </div>


                        <div className="webinar-countdown-live-copy">

                            <h2>
                                The webinar is live.
                            </h2>

                            <p>
                                Join the Ireland Nursing Webinar
                                below and watch the session in progress.
                            </p>

                        </div>


                        <a
                            href="#webinar-session"
                            className="webinar-countdown-live-button"
                        >
                            Watch now
                        </a>

                    </div>

                </div>

            </section>

        );

    }


    /* =====================================================
       UPCOMING
    ===================================================== */

    return (

        <section className="webinar-countdown-section">

            <div className="webinar-countdown-container">

                <div className="webinar-countdown">

                    {/* =================================================
                        LEFT — EVENT INFORMATION
                    ================================================= */}

                    <div className="webinar-countdown-info">

                        <span className="webinar-countdown-status">
                            Starting soon
                        </span>


                        <h2 className="webinar-countdown-title">
                            Join the webinar
                        </h2>


                        <p className="webinar-countdown-description">
                            Get ready for the Ireland Nursing Webinar.
                            We will begin shortly.
                        </p>


                        <div className="webinar-countdown-details">

                            <div className="webinar-countdown-detail">

                                <FaCalendarAlt />

                                <span>
                                    {webinar?.date}
                                </span>

                            </div>


                            <div className="webinar-countdown-detail">

                                <FaClock />

                                <span>
                                    {webinar?.time}{" "}
                                    {webinar?.timezone}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT — TIMER
                    ================================================= */}

                    <div className="webinar-countdown-timer">

                        <div className="webinar-countdown-unit">

                            <strong>
                                {formatNumber(
                                    countdown.days
                                )}
                            </strong>

                            <span>
                                Days
                            </span>

                        </div>


                        <span
                            className="webinar-countdown-separator"
                            aria-hidden="true"
                        >
                            :
                        </span>


                        <div className="webinar-countdown-unit">

                            <strong>
                                {formatNumber(
                                    countdown.hours
                                )}
                            </strong>

                            <span>
                                Hours
                            </span>

                        </div>


                        <span
                            className="webinar-countdown-separator"
                            aria-hidden="true"
                        >
                            :
                        </span>


                        <div className="webinar-countdown-unit">

                            <strong>
                                {formatNumber(
                                    countdown.minutes
                                )}
                            </strong>

                            <span>
                                Minutes
                            </span>

                        </div>


                        <span
                            className="webinar-countdown-separator"
                            aria-hidden="true"
                        >
                            :
                        </span>


                        <div className="webinar-countdown-unit">

                            <strong>
                                {formatNumber(
                                    countdown.seconds
                                )}
                            </strong>

                            <span>
                                Seconds
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}


export default WebinarCountdown;