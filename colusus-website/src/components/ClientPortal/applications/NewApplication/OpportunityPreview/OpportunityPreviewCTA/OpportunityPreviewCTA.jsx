import {
    HiOutlineArrowRight,
    HiOutlineShieldCheck,
} from "react-icons/hi";

import "./OpportunityPreviewCTA.css";


const OpportunityPreviewCTA = ({
    onStartApplication,
    loading = false,
}) => {

    const handleStart = () => {

        if (loading) {
            return;
        }

        if (typeof onStartApplication === "function") {
            onStartApplication();
        }

    };


    return (

        <div className="opportunity-preview-cta">

            {/* ======================================================
          ICON
      ====================================================== */}

            <div className="opportunity-preview-cta-icon">

                <HiOutlineShieldCheck />

            </div>


            {/* ======================================================
          CONTENT
      ====================================================== */}

            <div className="opportunity-preview-cta-content">

                <strong>
                    Ready to start?
                </strong>

                <p>
                    Begin your application and take the first step
                    toward your migration journey.
                </p>

            </div>


            {/* ======================================================
          ACTION
      ====================================================== */}

            <button
                type="button"
                className="opportunity-preview-cta-button"
                onClick={handleStart}
                disabled={loading}
            >

                <span>
                    {loading
                        ? "Creating..."
                        : "Begin Application"
                    }
                </span>

                {!loading && (
                    <HiOutlineArrowRight />
                )}

            </button>

        </div>

    );
};


export default OpportunityPreviewCTA;