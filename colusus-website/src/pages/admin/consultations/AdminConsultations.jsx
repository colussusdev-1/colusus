
import { useEffect, useMemo, useState } from "react";

import consultationService from "../../../services/consultation.service";

import "./AdminConsultations.css";

const AdminConsultations = () => {

    const [consultations, setConsultations] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [selectedConsultation, setSelectedConsultation] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Fetch Consultations
    |--------------------------------------------------------------------------
    */

    const fetchConsultations = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await consultationService.getAllConsultations();

            setConsultations(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch consultations:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to load consultations."
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        fetchConsultations();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Close Details
    |--------------------------------------------------------------------------
    */

    const closeDetails = () => {

        setSelectedConsultation(null);

    };


    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const statistics = useMemo(() => {

        const total =
            consultations.length;

        const confirmed =
            consultations.filter(
                (consultation) =>
                    consultation.paymentStatus === "PAID"
            ).length;

        const awaitingPayment =
            consultations.filter(
                (consultation) =>
                    consultation.paymentStatus !== "PAID"
            ).length;

        return {
            total,
            confirmed,
            awaitingPayment,
        };

    }, [consultations]);


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const filteredConsultations = useMemo(() => {

        const query =
            search.trim().toLowerCase();

        if (!query) {

            return consultations;

        }

        return consultations.filter(
            (consultation) => {

                return [

                    consultation.fullName,

                    consultation.email,

                    consultation.phone,

                    consultation.travelPackage,

                    consultation.visaClass,

                    consultation.consultationType,

                    consultation.paymentStatus,

                    consultation.bookingStatus,

                    ...(consultation.countries || []),

                ]
                    .filter(Boolean)
                    .some(
                        (value) =>
                            String(value)
                                .toLowerCase()
                                .includes(query)
                    );

            }
        );

    }, [consultations, search]);


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {

        if (!date) {

            return "—";

        }

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Format Date + Time
    |--------------------------------------------------------------------------
    */

    const formatDateTime = (date) => {

        if (!date) {

            return "—";

        }

        return new Date(date).toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Format Currency
    |--------------------------------------------------------------------------
    */

    const formatCurrency = (
        amount,
        currency = "NGN"
    ) => {

        if (
            amount === undefined ||
            amount === null
        ) {

            return "—";

        }

        return new Intl.NumberFormat(
            "en-NG",
            {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
            }
        ).format(amount);

    };


    /*
    |--------------------------------------------------------------------------
    | Format Consultation Type
    |--------------------------------------------------------------------------
    */

    const formatConsultationType = (type) => {

        if (!type) {

            return "—";

        }

        return type
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase()
            );

    };


    /*
    |--------------------------------------------------------------------------
    | Payment Status
    |--------------------------------------------------------------------------
    */

    const isPaid = (consultation) => {

        return (
            consultation?.paymentStatus === "PAID"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Payment Label
    |--------------------------------------------------------------------------
    */

    const getPaymentLabel = (consultation) => {

        return isPaid(consultation)
            ? "Paid"
            : "Awaiting Payment";

    };


    /*
    |--------------------------------------------------------------------------
    | Booking Label
    |--------------------------------------------------------------------------
    */

    const getBookingLabel = (consultation) => {

        return isPaid(consultation)
            ? "Confirmed"
            : "Awaiting Payment";

    };


    /*
    |--------------------------------------------------------------------------
    | Payment Class
    |--------------------------------------------------------------------------
    */

    const getPaymentClass = (consultation) => {

        return isPaid(consultation)
            ? "paid"
            : "pending";

    };


    /*
    |--------------------------------------------------------------------------
    | Prevent Background Scroll
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!selectedConsultation) {

            document.body.style.overflow = "";

            return;

        }

        document.body.style.overflow = "hidden";

        return () => {

            document.body.style.overflow = "";

        };

    }, [selectedConsultation]);


    /*
    |--------------------------------------------------------------------------
    | Escape Key
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (
                event.key === "Escape" &&
                selectedConsultation
            ) {

                closeDetails();

            }

        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [selectedConsultation]);


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <main className="adminConsultations">

            <div className="adminConsultations__container">


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <header className="adminConsultations__header">

                    <div>

                        <span className="adminConsultations__eyebrow">
                            Administration
                        </span>

                        <h1>
                            Consultations
                        </h1>

                        <p>
                            Review consultation requests
                            and confirmed bookings.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="adminConsultations__refresh"
                        onClick={fetchConsultations}
                        disabled={loading}
                    >

                        {loading
                            ? "Refreshing..."
                            : "Refresh"
                        }

                    </button>

                </header>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="adminConsultations__error">

                        {error}

                    </div>

                )}


                {/* =================================================
                    SUMMARY
                ================================================= */}

                {!loading && (

                    <section className="adminConsultations__summary">

                        <div className="adminConsultations__summaryItem">

                            <span>
                                Total
                            </span>

                            <strong>
                                {statistics.total}
                            </strong>

                        </div>


                        <div className="adminConsultations__summaryItem">

                            <span>
                                Confirmed
                            </span>

                            <strong>
                                {statistics.confirmed}
                            </strong>

                        </div>


                        <div className="adminConsultations__summaryItem">

                            <span>
                                Awaiting Payment
                            </span>

                            <strong>
                                {statistics.awaitingPayment}
                            </strong>

                        </div>

                    </section>

                )}


                {/* =================================================
                    SEARCH
                ================================================= */}

                {!loading &&
                    consultations.length > 0 && (

                        <div className="adminConsultations__toolbar">

                            <div className="adminConsultations__search">

                                <span className="adminConsultations__searchIcon">
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search by name, email, phone, country..."
                                />

                            </div>


                            <span className="adminConsultations__count">

                                {filteredConsultations.length}

                                {" "}

                                {filteredConsultations.length === 1
                                    ? "consultation"
                                    : "consultations"
                                }

                            </span>

                        </div>

                    )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="adminConsultations__message">

                        <div className="adminConsultations__spinner" />

                        <p>
                            Loading consultations...
                        </p>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    filteredConsultations.length === 0 && (

                        <div className="adminConsultations__message">

                            <div className="adminConsultations__emptyIcon">
                                —
                            </div>

                            <h2>

                                {search
                                    ? "No consultations found"
                                    : "No consultations yet"
                                }

                            </h2>

                            <p>

                                {search
                                    ? "Try searching with a different name, email, phone number or country."
                                    : "New consultation requests will appear here."
                                }

                            </p>

                        </div>

                    )}


                {/* =================================================
                    CONSULTATION LIST
                ================================================= */}

                {!loading &&
                    filteredConsultations.length > 0 && (

                        <section className="adminConsultations__list">

                            {filteredConsultations.map(
                                (consultation) => (

                                    <button
                                        type="button"
                                        key={consultation._id}
                                        className="adminConsultations__item"
                                        onClick={() =>
                                            setSelectedConsultation(
                                                consultation
                                            )
                                        }
                                    >

                                        {/* Client */}

                                        <div className="adminConsultations__client">

                                            <div className="adminConsultations__avatar">

                                                {consultation.fullName
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "?"}

                                            </div>


                                            <div>

                                                <h3>
                                                    {
                                                        consultation.fullName
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        consultation.email
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        {/* Consultation */}

                                        <div className="adminConsultations__itemInfo">

                                            <span>
                                                Consultation
                                            </span>

                                            <strong>
                                                {
                                                    formatConsultationType(
                                                        consultation.consultationType
                                                    )
                                                }
                                            </strong>

                                            <small>
                                                {
                                                    formatDate(
                                                        consultation.consultationDate
                                                    )
                                                }
                                            </small>

                                        </div>


                                        {/* Travel */}

                                        <div className="adminConsultations__itemInfo">

                                            <span>
                                                Travel
                                            </span>

                                            <strong>
                                                {
                                                    consultation.travelPackage ||
                                                    "—"
                                                }
                                            </strong>

                                            <small>

                                                {consultation.countries?.length
                                                    ? consultation.countries.join(
                                                        ", "
                                                    )
                                                    : "No country specified"
                                                }

                                            </small>

                                        </div>


                                        {/* Payment */}

                                        <div className="adminConsultations__payment">

                                            <span>
                                                Payment
                                            </span>

                                            <strong>
                                                {
                                                    formatCurrency(
                                                        consultation.amountPayable,
                                                        consultation.currency
                                                    )
                                                }
                                            </strong>

                                            <span
                                                className={`adminConsultations__paymentBadge adminConsultations__paymentBadge--${getPaymentClass(
                                                    consultation
                                                )}`}
                                            >

                                                {
                                                    getPaymentLabel(
                                                        consultation
                                                    )
                                                }

                                            </span>

                                        </div>


                                        <div className="adminConsultations__arrow">
                                            →
                                        </div>

                                    </button>

                                ))}

                        </section>

                    )}

            </div>


            {/* =====================================================
                CONSULTATION DETAILS
            ===================================================== */}

            {selectedConsultation && (

                <div
                    className="adminConsultations__overlay"
                    onClick={closeDetails}
                >

                    <aside
                        className="adminConsultations__details"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >


                        {/* =================================================
                            DETAILS HEADER
                        ================================================= */}

                        <header className="adminConsultations__detailsHeader">

                            <div>

                                <span className="adminConsultations__eyebrow">
                                    Consultation Request
                                </span>

                                <h2>
                                    {
                                        selectedConsultation.fullName
                                    }
                                </h2>

                                <p>
                                    Submitted{" "}
                                    {
                                        formatDateTime(
                                            selectedConsultation.createdAt
                                        )
                                    }
                                </p>

                            </div>


                            <button
                                type="button"
                                className="adminConsultations__close"
                                onClick={closeDetails}
                                aria-label="Close consultation details"
                            >
                                ×
                            </button>

                        </header>


                        <div className="adminConsultations__detailsBody">


                            {/* =================================================
                                CURRENT STATUS
                            ================================================= */}

                            <section className="adminConsultations__statusCard">

                                <div>

                                    <span>
                                        Consultation Status
                                    </span>

                                    <strong
                                        className={
                                            isPaid(
                                                selectedConsultation
                                            )
                                                ? "confirmed"
                                                : "awaiting"
                                        }
                                    >

                                        {getBookingLabel(
                                            selectedConsultation
                                        )}

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Payment
                                    </span>

                                    <strong
                                        className={
                                            isPaid(
                                                selectedConsultation
                                            )
                                                ? "confirmed"
                                                : "awaiting"
                                        }
                                    >

                                        {getPaymentLabel(
                                            selectedConsultation
                                        )}

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Amount
                                    </span>

                                    <strong>

                                        {
                                            formatCurrency(
                                                selectedConsultation.amountPayable,
                                                selectedConsultation.currency
                                            )
                                        }

                                    </strong>

                                </div>

                            </section>


                            {/* =================================================
                                CONTACT
                            ================================================= */}

                            <section>

                                <h3>
                                    Contact Information
                                </h3>

                                <div className="adminConsultations__detailGrid">

                                    <div>

                                        <span>
                                            Full Name
                                        </span>

                                        <strong>
                                            {
                                                selectedConsultation.fullName ||
                                                "—"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            {
                                                selectedConsultation.email ||
                                                "—"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Phone
                                        </span>

                                        <strong>
                                            {
                                                selectedConsultation.phone ||
                                                "—"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Age
                                        </span>

                                        <strong>
                                            {
                                                selectedConsultation.age ??
                                                "—"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Education
                                        </span>

                                        <strong>
                                            {
                                                selectedConsultation.education ||
                                                "—"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Marital Status
                                        </span>

                                        <strong>
                                            {
                                                selectedConsultation.maritalStatus ||
                                                "—"
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                TRAVEL
                            ================================================= */}

                            <section>

                                <h3>
                                    Travel Information
                                </h3>

                                <div className="adminConsultations__detailGrid">

                                    <div>

                                        <span>
                                            Travel Package
                                        </span>

                                        <strong>
                                            {
                                                selectedConsultation.travelPackage ||
                                                "—"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Country
                                        </span>

                                        <strong>
                                            {
                                                selectedConsultation.countries?.length
                                                    ? selectedConsultation.countries.join(
                                                        ", "
                                                    )
                                                    : "—"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Visa Class
                                        </span>

                                        <strong>
                                            {
                                                selectedConsultation.visaClass ||
                                                "—"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Intended Travel
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    selectedConsultation.intendedTravelDate
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                CONSULTATION
                            ================================================= */}

                            <section>

                                <h3>
                                    Consultation Information
                                </h3>

                                <div className="adminConsultations__detailGrid">

                                    <div>

                                        <span>
                                            Consultation Type
                                        </span>

                                        <strong>
                                            {
                                                formatConsultationType(
                                                    selectedConsultation.consultationType
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Consultation Date
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    selectedConsultation.consultationDate
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div className="adminConsultations__fullWidth">

                                        <span>
                                            Client Message
                                        </span>

                                        <strong className="adminConsultations__messageValue">

                                            {
                                                selectedConsultation.message ||
                                                "No message provided."
                                            }

                                        </strong>

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                PAYMENT
                            ================================================= */}

                            <section>

                                <h3>
                                    Payment Information
                                </h3>

                                <div className="adminConsultations__detailGrid">

                                    <div>

                                        <span>
                                            Consultation Fee
                                        </span>

                                        <strong>
                                            {
                                                formatCurrency(
                                                    selectedConsultation.consultationFee,
                                                    selectedConsultation.currency
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Amount Payable
                                        </span>

                                        <strong>
                                            {
                                                formatCurrency(
                                                    selectedConsultation.amountPayable,
                                                    selectedConsultation.currency
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Payment Status
                                        </span>

                                        <span
                                            className={`adminConsultations__paymentBadge adminConsultations__paymentBadge--${getPaymentClass(
                                                selectedConsultation
                                            )}`}
                                        >

                                            {
                                                getPaymentLabel(
                                                    selectedConsultation
                                                )
                                            }

                                        </span>

                                    </div>


                                    <div>

                                        <span>
                                            Payment Reference
                                        </span>

                                        <strong className="adminConsultations__reference">

                                            {
                                                selectedConsultation.paymentReference ||
                                                "No payment reference"
                                            }

                                        </strong>

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                BOOKING
                            ================================================= */}

                            <section>

                                <h3>
                                    Booking Information
                                </h3>

                                <div className="adminConsultations__detailGrid">

                                    <div>

                                        <span>
                                            Booking Status
                                        </span>

                                        <strong
                                            className={
                                                isPaid(
                                                    selectedConsultation
                                                )
                                                    ? "confirmed"
                                                    : "awaiting"
                                            }
                                        >

                                            {
                                                getBookingLabel(
                                                    selectedConsultation
                                                )
                                            }

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Booked At
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    selectedConsultation.bookedAt
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Created
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    selectedConsultation.createdAt
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Booking ID
                                        </span>

                                        <strong className="adminConsultations__reference">

                                            {
                                                selectedConsultation._id ||
                                                "—"
                                            }

                                        </strong>

                                    </div>

                                </div>

                            </section>

                        </div>

                    </aside>

                </div>

            )}

        </main>

    );

};

export default AdminConsultations;

