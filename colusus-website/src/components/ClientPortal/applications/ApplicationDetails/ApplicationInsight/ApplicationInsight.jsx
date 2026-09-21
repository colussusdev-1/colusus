import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineInformationCircle,
    HiOutlineRefresh,
} from "react-icons/hi";

import "./ApplicationInsight.css";


const normalizeStatus = (value) => {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");
};


const ApplicationInsight = ({
    application,
}) => {
    if (!application) {
        return null;
    }


    const status =
        normalizeStatus(
            application.status,
        );


    const currentStep =
        String(
            application.currentStep ||
            "DOCUMENTS",
        )
            .trim()
            .toUpperCase()
            .replace(/\s+/g, "_");


    let eyebrow =
        "WHERE YOU ARE";

    let title =
        "Your application has been created.";

    let description =
        "Your migration application is now available in your client portal. Follow the steps shown below to provide the information and documents required for your pathway.";

    let nextTitle =
        "What happens next";

    let nextDescription =
        "Complete the current step. Once it is complete, your application can move into the next stage.";

    let icon =
        HiOutlineInformationCircle;


    /* ============================================================
       DOCUMENT STAGE
    ============================================================ */

    if (
        currentStep === "DOCUMENTS" &&
        (
            status === "DRAFT" ||
            status === "IN_PROGRESS"
        )
    ) {
        title =
            "You're preparing your application documents.";

        description =
            "Your application has been created successfully. The next thing you need to do is provide the required documents for this migration pathway.";

        nextTitle =
            "What happens after you upload them";

        nextDescription =
            "Once your required documents are submitted, the Colusus team can review them and let you know if anything needs to be corrected or replaced.";

        icon =
            HiOutlineCheckCircle;
    }


    /* ============================================================
       REVIEW
    ============================================================ */

    else if (
        currentStep === "REVIEW"
    ) {
        title =
            "Your application is ready for review.";

        description =
            "The information and documents collected for your application can now be checked before the application moves into the next part of the migration process.";

        nextTitle =
            "What happens next";

        nextDescription =
            "Review the information carefully and make sure everything supplied is accurate and up to date.";

        icon =
            HiOutlineCheckCircle;
    }


    /* ============================================================
       UNDER REVIEW
    ============================================================ */

    else if (
        status === "UNDER_REVIEW"
    ) {
        eyebrow =
            "CURRENT STATUS";

        title =
            "The Colusus team is reviewing your application.";

        description =
            "Your submitted information is currently being assessed. At this point, there may be nothing you need to do.";

        nextTitle =
            "What you should do";

        nextDescription =
            "Keep an eye on your application and notifications. We'll contact you if additional information or documents are required.";

        icon =
            HiOutlineClock;
    }


    /* ============================================================
       DOCUMENT REQUEST
    ============================================================ */

    else if (
        status === "DOCUMENT_REQUEST"
    ) {
        eyebrow =
            "ACTION NEEDED";

        title =
            "Your application needs additional document attention.";

        description =
            "The migration team has identified a document requirement that needs to be addressed before your application can continue.";

        nextTitle =
            "What you should do";

        nextDescription =
            "Review the document section above, provide the requested document or replacement, and keep your application up to date.";

        icon =
            HiOutlineInformationCircle;
    }


    /* ============================================================
       PROCESSING
    ============================================================ */

    else if (
        status === "PROCESSING"
    ) {
        eyebrow =
            "CURRENT STATUS";

        title =
            "Your application is being processed.";

        description =
            "Your application has moved beyond the preparation and review stages and is currently being handled through the migration process.";

        nextTitle =
            "What you should do";

        nextDescription =
            "No immediate action is required unless the Colusus team sends you a request. Continue checking your application for updates.";

        icon =
            HiOutlineRefresh;
    }


    /* ============================================================
       APPROVED
    ============================================================ */

    else if (
        status === "APPROVED"
    ) {
        eyebrow =
            "APPLICATION OUTCOME";

        title =
            "Your application has been approved.";

        description =
            "Your application has reached an approved outcome. Review the latest application information and any instructions provided by the Colusus team.";

        nextTitle =
            "Your next step";

        nextDescription =
            "Check the latest application update for any actions that remain after approval.";

        icon =
            HiOutlineCheckCircle;
    }


    /* ============================================================
       REJECTED
    ============================================================ */

    else if (
        status === "REJECTED"
    ) {
        eyebrow =
            "APPLICATION OUTCOME";

        title =
            "Your application requires attention.";

        description =
            "The application has reached an outcome that requires you to review the information and latest activity carefully.";

        nextTitle =
            "What you should do";

        nextDescription =
            "Review the latest application update and contact the Colusus team if you need clarification about the outcome.";

        icon =
            HiOutlineInformationCircle;
    }


    const InsightIcon =
        icon;


    return (
        <section className="application-insight">

            <div className="application-insight-icon">
                <InsightIcon />
            </div>


            <div className="application-insight-content">

                <span className="application-insight-eyebrow">
                    {eyebrow}
                </span>

                <h2>
                    {title}
                </h2>

                <p>
                    {description}
                </p>


                <div className="application-insight-next">

                    <div className="application-insight-next-icon">
                        <HiOutlineArrowRight />
                    </div>

                    <div>
                        <strong>
                            {nextTitle}
                        </strong>

                        <p>
                            {nextDescription}
                        </p>
                    </div>

                </div>

            </div>

        </section>
    );
};


export default ApplicationInsight;