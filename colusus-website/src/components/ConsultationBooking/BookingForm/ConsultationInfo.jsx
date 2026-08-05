import {
    HiOutlineCalendar,
    HiOutlineChatAlt2,
    HiOutlineVideoCamera,
    HiOutlinePhone,
    HiOutlineOfficeBuilding,
} from "react-icons/hi";

import "./ConsultationInfo.css";

const ConsultationInfo = ({
    formData,
    updateField,
}) => {

    /*
    |--------------------------------------------------------------------------
    | Consultation Types
    |--------------------------------------------------------------------------
    */

    const consultationTypes = [

        {
            label: "Online Meeting",
            value: "VIDEO",
            icon: <HiOutlineVideoCamera />,
        },

        {
            label: "Phone Consultation",
            value: "PHONE",
            icon: <HiOutlinePhone />,
        },

        {
            label: "Office Visit",
            value: "PHYSICAL",
            icon: <HiOutlineOfficeBuilding />,
        },

    ];

    return (

        <div className="consultationInfo">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="consultationInfo__header">

                <div className="consultationInfo__icon">
                    <HiOutlineChatAlt2 />
                </div>

                <div>

                    <h3>
                        Consultation Details
                    </h3>

                    <p>
                        Select your preferred consultation method
                        and booking date.
                    </p>

                </div>

            </div>

            {/* ==========================================
                FORM GRID
            ========================================== */}

            <div className="consultationInfo__grid">

                {/* ==========================================
                    CONSULTATION DATE
                ========================================== */}

                <div className="consultationInfo__field">

                    <label>
                        Consultation Date
                    </label>

                    <div className="consultationInfo__input">

                        <HiOutlineCalendar />

                        <input
                            type="date"
                            value={formData.consultationDate}
                            onChange={(e) =>
                                updateField(
                                    "consultationDate",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

                {/* ==========================================
                    CONSULTATION TYPE
                ========================================== */}

                <div className="consultationInfo__field">

                    <label>
                        Consultation Type
                    </label>

                    <div className="consultationInfo__types">

                        {consultationTypes.map((item) => (

                            <button
                                key={item.value}
                                type="button"
                                className={
                                    formData.consultationType === item.value
                                        ? "active"
                                        : ""
                                }
                                onClick={() => {
                                    console.log("Selected:", item.value);
                                    updateField("consultationType", item.value);
                                }}
                            >

                                {item.icon}

                                <span>
                                    {item.label}
                                </span>

                            </button>

                        ))}

                    </div>

                </div>

                {/* ==========================================
                    MESSAGE
                ========================================== */}

                <div className="consultationInfo__field">

                    <label>
                        Additional Information
                    </label>

                    <textarea
                        placeholder="Tell us about your migration goals, preferred destination, current situation or any questions you would like us to address during the consultation."
                        value={formData.message}
                        onChange={(e) =>
                            updateField(
                                "message",
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>

        </div>

    );

};

export default ConsultationInfo;