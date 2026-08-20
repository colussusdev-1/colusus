import {
    HiOutlineCheckCircle,
    HiOutlineDocumentText,
} from "react-icons/hi";

import "./OpportunityPreviewRequirements.css";


const OpportunityPreviewRequirements = ({
    opportunity,
}) => {

    if (!opportunity) {
        return null;
    }


    const {
        requirements = [],
    } = opportunity;


    const requirementItems =
        Array.isArray(requirements)
            ? requirements
            : [];


    return (

        <section
            className="opportunity-preview-requirements"
            aria-label="Pathway requirements"
        >

            {/* ======================================================
          HEADER
      ====================================================== */}

            <div className="opportunity-preview-requirements-header">

                <div className="opportunity-preview-requirements-icon">
                    <HiOutlineDocumentText />
                </div>


                <div>

                    <span>
                        REQUIREMENTS
                    </span>

                    <h3>
                        What you'll need
                    </h3>

                    <p>
                        Review the documents and requirements needed
                        for this migration pathway.
                    </p>

                </div>

            </div>


            {/* ======================================================
          REQUIREMENT LIST
      ====================================================== */}

            {requirementItems.length > 0 ? (

                <div className="opportunity-preview-requirements-list">

                    {requirementItems.map(
                        (requirement, index) => (

                            <div
                                key={`requirement-${index}`}
                                className="opportunity-preview-requirement-item"
                            >

                                <div className="opportunity-preview-requirement-check">

                                    <HiOutlineCheckCircle />

                                </div>


                                <div className="opportunity-preview-requirement-content">

                                    <span>
                                        Requirement{" "}
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <strong>
                                        {requirement}
                                    </strong>

                                </div>

                            </div>

                        )
                    )}

                </div>

            ) : (

                <div className="opportunity-preview-requirements-empty">

                    <HiOutlineDocumentText />

                    <div>

                        <strong>
                            Requirements will be provided during your application.
                        </strong>

                        <p>
                            You'll receive the specific document checklist
                            after starting this pathway.
                        </p>

                    </div>

                </div>

            )}

        </section>

    );
};


export default OpportunityPreviewRequirements;