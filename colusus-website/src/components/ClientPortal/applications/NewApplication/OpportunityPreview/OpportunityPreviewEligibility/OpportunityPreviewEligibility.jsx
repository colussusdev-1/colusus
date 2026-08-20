import {
    HiOutlineCheckCircle,
    HiOutlineShieldCheck,
} from "react-icons/hi";

import "./OpportunityPreviewEligibility.css";


const OpportunityPreviewEligibility = ({
    opportunity,
}) => {

    if (!opportunity) {
        return null;
    }


    const {
        eligibility = [],
    } = opportunity;


    const eligibilityItems =
        Array.isArray(eligibility)
            ? eligibility
            : [];


    return (
        <section
            className="opportunity-preview-eligibility"
            aria-label="Pathway eligibility"
        >

            {/* ======================================================
          HEADER
      ====================================================== */}

            <div className="opportunity-preview-eligibility-header">

                <div className="opportunity-preview-eligibility-icon">
                    <HiOutlineShieldCheck />
                </div>

                <div>

                    <span>
                        ELIGIBILITY
                    </span>

                    <h3>
                        Can you qualify for this pathway?
                    </h3>

                    <p>
                        Review the key eligibility criteria before
                        starting your application.
                    </p>

                </div>

            </div>


            {/* ======================================================
          ELIGIBILITY LIST
      ====================================================== */}

            {eligibilityItems.length > 0 ? (

                <div className="opportunity-preview-eligibility-list">

                    {eligibilityItems.map(
                        (item, index) => (

                            <div
                                key={`eligibility-${index}`}
                                className="opportunity-preview-eligibility-item"
                            >

                                <div className="opportunity-preview-eligibility-item-icon">
                                    <HiOutlineCheckCircle />
                                </div>

                                <div className="opportunity-preview-eligibility-item-content">

                                    <span>
                                        Criterion {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <strong>
                                        {item}
                                    </strong>

                                </div>

                            </div>

                        )
                    )}

                </div>

            ) : (

                <div className="opportunity-preview-eligibility-empty">

                    <HiOutlineShieldCheck />

                    <div>

                        <strong>
                            Eligibility will be assessed during your application.
                        </strong>

                        <p>
                            Continue with your application to provide the
                            information required to determine your eligibility.
                        </p>

                    </div>

                </div>

            )}

        </section>
    );
};


export default OpportunityPreviewEligibility;