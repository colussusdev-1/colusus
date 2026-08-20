import { HiOutlineArrowLeft } from "react-icons/hi";

import "./OpportunityPreviewHeader.css";


const OpportunityPreviewHeader = ({
    onClose,
    loading = false,
}) => {

    return (
        <header className="opportunity-preview-header">

            {/* =====================================================
                BACK TO PATHWAYS
            ===================================================== */}

            <button
                type="button"
                className="opportunity-preview-header-back"
                onClick={onClose}
                disabled={loading}
                aria-label="Back to pathways"
            >

                <HiOutlineArrowLeft />

                <span>
                    Back to pathways
                </span>

            </button>


            {/* =====================================================
                HEADER CONTEXT
            ===================================================== */}

            <div className="opportunity-preview-header-context">

                <span>
                    PATHWAY OVERVIEW
                </span>

            </div>

        </header>
    );
};


export default OpportunityPreviewHeader;