import { HiOutlineSparkles } from "react-icons/hi";

import "./OpportunityPreviewMedia.css";


const OpportunityPreviewMedia = ({
    image = "",
    flag = "",
    title = "Migration Pathway",
    countryName = "International",
}) => {

    return (
        <div className="opportunity-preview-media">

            {/* =====================================================
                IMAGE
            ===================================================== */}

            {image ? (

                <img
                    src={image}
                    alt={`${title} pathway`}
                    className="opportunity-preview-media-image"
                />

            ) : (

                <div className="opportunity-preview-media-fallback">

                    <HiOutlineSparkles />

                </div>

            )}


            {/* =====================================================
                IMAGE OVERLAY
            ===================================================== */}

            <div className="opportunity-preview-media-overlay" />


            {/* =====================================================
                COUNTRY INFORMATION
            ===================================================== */}

            <div className="opportunity-preview-media-country">

                {flag && (

                    <img
                        src={flag}
                        alt=""
                        className="opportunity-preview-media-flag"
                    />

                )}

                <span>
                    {countryName}
                </span>

            </div>

        </div>
    );
};


export default OpportunityPreviewMedia;