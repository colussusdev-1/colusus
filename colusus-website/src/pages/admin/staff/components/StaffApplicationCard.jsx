import React, {
    useEffect,
    useState,
} from "react";

import {
    HiOutlineArrowRight,
    HiOutlineLocationMarker,
    HiOutlineCalendar,
    HiOutlineDocumentText,
} from "react-icons/hi";

import StaffStatusBadge from "./StaffStatusBadge";

import "./StaffApplicationCard.css";


/*
============================================================
COLOSSUS — STAFF APPLICATION CARD
============================================================

Kanban application card.

Supports:
- Opening an application
- Native HTML5 drag and drop
- Client profile image
- Initials fallback
- Application metadata
- Status display
- Keyboard accessibility
============================================================
*/


const StaffApplicationCard = ({
    application,
    onClick,
    onDragStart,
    onDragEnd,
}) => {

    const [imageError, setImageError] =
        useState(false);


    if (!application) {
        return null;
    }


    /*
    ============================================================
    CLIENT
    ============================================================
    */

    const client =
        application?.user ||
        application?.client ||
        {};


    const applicationId =
        application?._id ||
        application?.id;


    const clientName =
        client?.name ||
        client?.fullName ||
        [
            client?.firstName,
            client?.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        "Unknown Client";


    /*
    ============================================================
    APPLICATION REFERENCE
    ============================================================
    */

    const applicationReference =
        application?.applicationReference ||
        application?.reference ||
        application?.applicationNumber ||
        application?.number ||
        application?._id ||
        "Application";


    /*
    ============================================================
    DESTINATION
    ============================================================
    */

    const destination =
        application?.destinationCountry ||
        application
            ?.opportunitySnapshot
            ?.countryName ||
        application?.destination ||
        application?.country ||
        "—";


    /*
    ============================================================
    APPLICATION TYPE
    ============================================================
    */

    const rawApplicationType =
        application?.applicationType ||
        application?.type ||
        application
            ?.opportunitySnapshot
            ?.title ||
        application
            ?.opportunitySnapshot
            ?.name ||
        application?.opportunity?.title ||
        "Migration Application";


    const applicationType =
        String(rawApplicationType)
            .replace(/_/g, " ")
            .replace(/-/g, " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase(),
            );


    /*
    ============================================================
    STATUS
    ============================================================
    */

    const status =
        application?.status ||
        "DRAFT";


    /*
    ============================================================
    DATE
    ============================================================
    */

    const updatedAt =
        application?.updatedAt ||
        application?.createdAt;


    const formattedDate =
        updatedAt
            ? new Date(
                updatedAt,
            ).toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                },
            )
            : "—";


    /*
    ============================================================
    PROFILE IMAGE
    ============================================================
    */

    const profileImage =
        client?.profileImage ||
        client?.profilePicture ||
        client?.avatar ||
        client?.avatarUrl ||
        client?.photo ||
        client?.image ||
        null;


    /*
    ============================================================
    RESET IMAGE ERROR
    ============================================================
    */

    useEffect(() => {

        setImageError(false);

    }, [profileImage]);


    /*
    ============================================================
    INITIALS
    ============================================================
    */

    const initials =
        clientName
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(
                (part) =>
                    part
                        .charAt(0)
                        .toUpperCase(),
            )
            .join("") ||
        "C";


    /*
    ============================================================
    CLICK
    ============================================================
    */

    const handleClick = () => {

        if (!applicationId) {
            return;
        }

        if (onClick) {
            onClick(application);
        }
    };


    /*
    ============================================================
    KEYBOARD
    ============================================================
    */

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            handleClick();
        }
    };


    /*
    ============================================================
    DRAG START
    ============================================================
    */

    const handleDragStart = (event) => {

        if (!applicationId) {

            event.preventDefault();

            return;
        }


        event.dataTransfer.effectAllowed =
            "move";


        event.dataTransfer.setData(
            "text/plain",
            applicationId,
        );


        if (onDragStart) {

            onDragStart(
                application,
            );
        }
    };


    /*
    ============================================================
    DRAG END
    ============================================================
    */

    const handleDragEnd = () => {

        if (onDragEnd) {

            onDragEnd();
        }
    };


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (
        <article
            className="staffApplicationCard"
            role="button"
            tabIndex={0}
            aria-label={`Open application for ${clientName}`}
            draggable
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >

            {/* ==================================================
                CLIENT HEADER
            ================================================== */}

            <div className="staffApplicationCard__top">

                <div className="staffApplicationCard__client">

                    <div
                        className="staffApplicationCard__avatar"
                        aria-hidden="true"
                    >

                        {profileImage &&
                        !imageError ? (

                            <img
                                src={profileImage}
                                alt=""
                                draggable={false}
                                onError={() =>
                                    setImageError(
                                        true,
                                    )
                                }
                            />

                        ) : (

                            <span>
                                {initials}
                            </span>

                        )}

                    </div>


                    <div className="staffApplicationCard__clientInfo">

                        <strong
                            title={clientName}
                        >
                            {clientName}
                        </strong>


                        <span
                            title={
                                applicationReference
                            }
                        >
                            {applicationReference}
                        </span>

                    </div>

                </div>


                <div
                    className="staffApplicationCard__open"
                    aria-hidden="true"
                >
                    <HiOutlineArrowRight />
                </div>

            </div>


            {/* ==================================================
                DIVIDER
            ================================================== */}

            <div
                className="staffApplicationCard__divider"
                aria-hidden="true"
            />


            {/* ==================================================
                APPLICATION DETAILS
            ================================================== */}

            <div className="staffApplicationCard__application">

                <div className="staffApplicationCard__applicationType">

                    <HiOutlineDocumentText
                        aria-hidden="true"
                    />

                    <span
                        title={applicationType}
                    >
                        {applicationType}
                    </span>

                </div>


                <div className="staffApplicationCard__destination">

                    <HiOutlineLocationMarker
                        aria-hidden="true"
                    />

                    <span
                        title={destination}
                    >
                        {destination}
                    </span>

                </div>

            </div>


            {/* ==================================================
                LAST UPDATED
            ================================================== */}

            <div className="staffApplicationCard__meta">

                <span>
                    Last updated
                </span>


                <strong>

                    <HiOutlineCalendar
                        aria-hidden="true"
                    />

                    {formattedDate}

                </strong>

            </div>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="staffApplicationCard__footer">

                <StaffStatusBadge
                    status={status}
                />


                <span
                    className="staffApplicationCard__view"
                    aria-hidden="true"
                >

                    View

                    <HiOutlineArrowRight />

                </span>

            </div>

        </article>
    );
};


export default StaffApplicationCard;