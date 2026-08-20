import {
    HiOutlineCheckCircle,
    HiOutlineGift,
} from "react-icons/hi";

import "./OpportunityPreviewBenefits.css";


const OpportunityPreviewBenefits = ({
    opportunity,
}) => {

    if (!opportunity) {
        return null;
    }


    const {
        benefits = [],
        validity = "",
    } = opportunity;


    const benefitItems =
        Array.isArray(benefits)
            ? benefits
            : [];


    return (

        <section
            className="opportunity-preview-benefits"
            aria-label="Pathway benefits"
        >

            {/* ======================================================
          HEADER
      ====================================================== */}

            <div className="opportunity-preview-benefits-header">

                <div className="opportunity-preview-benefits-icon">
                    <HiOutlineGift />
                </div>


                <div>

                    <span>
                        BENEFITS
                    </span>

                    <h3>
                        What this pathway offers
                    </h3>

                    <p>
                        Understand the key benefits available through
                        this migration pathway.
                    </p>

                </div>

            </div>


            {/* ======================================================
          BENEFITS LIST
      ====================================================== */}

            {benefitItems.length > 0 ? (

                <div className="opportunity-preview-benefits-list">

                    {benefitItems.map(
                        (benefit, index) => (

                            <div
                                key={`benefit-${index}`}
                                className="opportunity-preview-benefit-item"
                            >

                                <div className="opportunity-preview-benefit-check">

                                    <HiOutlineCheckCircle />

                                </div>


                                <div className="opportunity-preview-benefit-content">

                                    <span>
                                        Benefit{" "}
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <strong>
                                        {benefit}
                                    </strong>

                                </div>

                            </div>

                        )
                    )}

                </div>

            ) : (

                <div className="opportunity-preview-benefits-empty">

                    <HiOutlineGift />

                    <div>

                        <strong>
                            Pathway benefits will be clarified during your application.
                        </strong>

                        <p>
                            Continue with the pathway to receive information
                            specific to your application and circumstances.
                        </p>

                    </div>

                </div>

            )}


            {/* ======================================================
          VALIDITY
      ====================================================== */}

            {validity && (

                <div className="opportunity-preview-benefits-validity">

                    <div className="opportunity-preview-benefits-validity-icon">
                        <HiOutlineCheckCircle />
                    </div>


                    <div>

                        <span>
                            PATHWAY VALIDITY
                        </span>

                        <strong>
                            {validity}
                        </strong>

                    </div>

                </div>

            )}

        </section>

    );
};


export default OpportunityPreviewBenefits;