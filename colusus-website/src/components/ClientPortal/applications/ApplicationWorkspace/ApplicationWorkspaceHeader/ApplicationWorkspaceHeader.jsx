import {
    HiOutlineArrowLeft,
    HiOutlineCheckCircle,
    HiOutlineCloudUpload,
    HiOutlineLocationMarker,
    HiOutlineSave,
} from "react-icons/hi";

import "./ApplicationWorkspaceHeader.css";


const ApplicationWorkspaceHeader = ({
    application,
    onExit,
    onSave,
    saving = false,
}) => {

    if (!application) {
        return null;
    }


    /* ============================================================
       DATA
    ============================================================ */

    const snapshot =
        application?.opportunitySnapshot || {};

    const title =
        snapshot?.title ||
        application?.opportunity?.title ||
        "Migration Application";

    const country =
        snapshot?.countryName ||
        application?.opportunity?.countryName ||
        application?.destinationCountry ||
        "International";

    const category =
        snapshot?.category ||
        application?.opportunity?.category ||
        "Migration pathway";

    const status =
        application?.status ||
        "DRAFT";

    const applicationId =
        application?._id || "";


    /* ============================================================
       STATUS
    ============================================================ */

    const statusLabel = {

        DRAFT: "Draft",

        SUBMITTED: "Submitted",

        UNDER_REVIEW: "Under review",

        DOCUMENT_REQUEST: "Documents requested",

        PROCESSING: "Processing",

        APPROVED: "Approved",

        REJECTED: "Rejected",

    }[status] || "Draft";


    const isSaved =
        !saving;


    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <header className="application-workspace-header">

            <div className="application-workspace-header-inner">


                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="application-workspace-header-left">


                    {/* BACK */}
                    <button
                        type="button"
                        className="application-workspace-header-back"
                        onClick={onExit}
                        aria-label="Back to applications"
                    >

                        <HiOutlineArrowLeft />

                        <span>
                            Applications
                        </span>

                    </button>


                    <span className="application-workspace-header-divider" />


                    {/* PATHWAY IDENTITY */}
                    <div className="application-workspace-header-identity">

                        <div className="application-workspace-header-title-row">

                            <h1>
                                {title}
                            </h1>


                            <span
                                className={`application-workspace-status application-workspace-status-${status.toLowerCase()}`}
                            >

                                <span className="application-workspace-status-dot" />

                                {statusLabel}

                            </span>

                        </div>


                        <div className="application-workspace-header-meta">

                            <span>

                                <HiOutlineLocationMarker />

                                {country}

                            </span>


                            <span className="application-workspace-header-meta-separator">
                                ·
                            </span>


                            <span>
                                {category}
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT
                ================================================= */}

                <div className="application-workspace-header-right">


                    {/* APPLICATION ID */}

                    {applicationId && (

                        <div className="application-workspace-id">

                            <span>
                                APPLICATION
                            </span>

                            <strong>
                                #{applicationId.slice(-8).toUpperCase()}
                            </strong>

                        </div>

                    )}


                    {/* SAVE STATUS */}

                    <div className="application-workspace-save-state">

                        {saving ? (

                            <>
                                <HiOutlineCloudUpload />

                                <span>
                                    Saving...
                                </span>
                            </>

                        ) : (

                            <>
                                <HiOutlineCheckCircle />

                                <span>
                                    Saved
                                </span>
                            </>

                        )}

                    </div>


                    {/* SAVE BUTTON */}

                    <button
                        type="button"
                        className="application-workspace-save"
                        onClick={onSave}
                        disabled={saving}
                    >

                        <HiOutlineSave />

                        <span>
                            {saving
                                ? "Saving"
                                : "Save progress"}
                        </span>

                    </button>

                </div>

            </div>

        </header>

    );

};


export default ApplicationWorkspaceHeader;