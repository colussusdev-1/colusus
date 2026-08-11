
import {
    HiOutlineCheckCircle,
    HiOutlineGlobeAlt,
    HiOutlineCalendar,
    HiOutlineCreditCard,
    HiOutlineShieldCheck,
    HiOutlineSparkles,
    HiOutlineTicket,
    HiOutlineReceiptTax,
    HiOutlineArrowRight,
} from "react-icons/hi";

import "./BookingSummary.css";


const BookingSummary = ({
    bookingData,
    onPayment,
    loading,
}) => {

    if (!bookingData) {
        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | Extract Booking Data
    |--------------------------------------------------------------------------
    */

    const {
        fullName,
        email,
        phone,

        age,
        education,
        maritalStatus,

        travelPackage,
        countries = [],
        visaClass,
        intendedTravelDate,

        consultationDate,
        consultationType,

        message,

        pricing = {},
    } = bookingData;


    /*
    |--------------------------------------------------------------------------
    | Pricing
    |--------------------------------------------------------------------------
    |
    | The backend is the source of truth for pricing.
    |
    | Do NOT hard-code the consultation fee here.
    |
    |--------------------------------------------------------------------------
    */

    const {
        consultationFee = 0,

        discount = 0,

        amountPayable = 0,

        paymentRequired = true,

        couponApplied = false,

        coupon = null,

    } = pricing;


    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-NG",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );

    };


    const formatCurrency = (value) => {

        const amount = Number(value);

        if (
            Number.isNaN(amount)
        ) {
            return "₦0";
        }

        return `₦${amount.toLocaleString(
            "en-NG"
        )}`;

    };


    /*
    |--------------------------------------------------------------------------
    | Consultation Type
    |--------------------------------------------------------------------------
    */

    const formatConsultationType = (type) => {

        if (!type) {
            return "-";
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
    | Payment Button
    |--------------------------------------------------------------------------
    */

    const handlePayment = () => {

        if (loading) {
            return;
        }

        if (typeof onPayment !== "function") {
            console.error(
                "BookingSummary: onPayment is not available."
            );

            return;
        }

        onPayment();

    };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <section className="bookingSummary">

            <div className="container">


                {/* =====================================================
                    SUCCESS HEADER
                ====================================================== */}

                <div className="bookingSummary__hero">

                    <div className="bookingSummary__successIcon">

                        <HiOutlineCheckCircle />

                    </div>


                    <span>
                        BOOKING REVIEW COMPLETE
                    </span>


                    <h2>
                        Everything Looks Great!
                    </h2>


                    <p>

                        We've reviewed your consultation request.
                        Please confirm your information before
                        proceeding to our secure checkout.

                    </p>

                </div>


                {/* =====================================================
                    MAIN LAYOUT
                ====================================================== */}

                <div className="bookingSummary__layout">


                    {/* =================================================
                        LEFT CONTENT
                    ================================================= */}

                    <div className="bookingSummary__content">


                        {/* =================================================
                            PERSONAL INFORMATION
                        ================================================= */}

                        <section className="summaryCard">

                            <div className="summaryCard__header">

                                <div className="summaryCard__icon">

                                    <HiOutlineCheckCircle />

                                </div>


                                <div>

                                    <span>
                                        STEP 01
                                    </span>

                                    <h3>
                                        Personal Information
                                    </h3>

                                </div>

                            </div>


                            <div className="summaryGrid">

                                <div>

                                    <label>
                                        Full Name
                                    </label>

                                    <strong>
                                        {fullName || "-"}
                                    </strong>

                                </div>


                                <div>

                                    <label>
                                        Email Address
                                    </label>

                                    <strong>
                                        {email || "-"}
                                    </strong>

                                </div>


                                <div>

                                    <label>
                                        Phone Number
                                    </label>

                                    <strong>
                                        {phone || "-"}
                                    </strong>

                                </div>


                                <div>

                                    <label>
                                        Age
                                    </label>

                                    <strong>
                                        {age ?? "-"}
                                    </strong>

                                </div>


                                <div>

                                    <label>
                                        Education
                                    </label>

                                    <strong>
                                        {education || "-"}
                                    </strong>

                                </div>


                                <div>

                                    <label>
                                        Marital Status
                                    </label>

                                    <strong>
                                        {maritalStatus || "-"}
                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            TRAVEL INFORMATION
                        ================================================= */}

                        <section className="summaryCard">

                            <div className="summaryCard__header">

                                <div className="summaryCard__icon">

                                    <HiOutlineGlobeAlt />

                                </div>


                                <div>

                                    <span>
                                        STEP 02
                                    </span>

                                    <h3>
                                        Travel Information
                                    </h3>

                                </div>

                            </div>


                            <div className="summaryGrid">

                                <div>

                                    <label>
                                        Travel Package
                                    </label>

                                    <strong>
                                        {travelPackage || "-"}
                                    </strong>

                                </div>


                                <div>

                                    <label>
                                        Visa Category
                                    </label>

                                    <strong>
                                        {visaClass || "-"}
                                    </strong>

                                </div>


                                <div>

                                    <label>
                                        Destination(s)
                                    </label>

                                    <strong>

                                        {
                                            countries.length
                                                ? countries.join(", ")
                                                : "-"
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <label>
                                        Intended Travel Date
                                    </label>

                                    <strong>

                                        {
                                            formatDate(
                                                intendedTravelDate
                                            )
                                        }

                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            CONSULTATION INFORMATION
                        ================================================= */}

                        <section className="summaryCard">

                            <div className="summaryCard__header">

                                <div className="summaryCard__icon">

                                    <HiOutlineCalendar />

                                </div>


                                <div>

                                    <span>
                                        STEP 03
                                    </span>

                                    <h3>
                                        Consultation
                                    </h3>

                                </div>

                            </div>


                            <div className="summaryGrid">

                                <div>

                                    <label>
                                        Consultation Date
                                    </label>

                                    <strong>

                                        {
                                            formatDate(
                                                consultationDate
                                            )
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <label>
                                        Consultation Type
                                    </label>

                                    <strong>

                                        {
                                            formatConsultationType(
                                                consultationType
                                            )
                                        }

                                    </strong>

                                </div>


                                <div
                                    style={{
                                        gridColumn:
                                            "1 / -1",
                                    }}
                                >

                                    <label>
                                        Additional Notes
                                    </label>

                                    <strong>

                                        {
                                            message ||
                                            "No additional notes provided."
                                        }

                                    </strong>

                                </div>

                            </div>

                        </section>

                    </div>


                    {/* =====================================================
                        CHECKOUT SIDEBAR
                    ====================================================== */}

                    <aside className="bookingSummary__sidebar">

                        <div className="checkoutCard">


                            {/* =================================================
                                CHECKOUT HEADER
                            ================================================= */}

                            <div className="checkoutCard__top">

                                <div className="checkoutCard__icon">

                                    <HiOutlineCreditCard />

                                </div>


                                <div>

                                    <span>
                                        SECURE CHECKOUT
                                    </span>

                                    <h3>
                                        Consultation Summary
                                    </h3>

                                </div>

                            </div>


                            {/* =================================================
                                PRICE BREAKDOWN
                            ================================================= */}

                            <div className="checkoutBreakdown">


                                {/* Consultation Fee */}

                                <div className="checkoutRow">

                                    <span>
                                        Consultation Fee
                                    </span>

                                    <strong>

                                        {
                                            formatCurrency(
                                                consultationFee
                                            )
                                        }

                                    </strong>

                                </div>


                                {/* Coupon */}

                                {
                                    couponApplied && (

                                        <div className="checkoutRow success">

                                            <span>

                                                <HiOutlineTicket />

                                                Coupon

                                            </span>

                                            <strong>

                                                {
                                                    coupon ||
                                                    "Applied"
                                                }

                                            </strong>

                                        </div>

                                    )
                                }


                                {/* Discount */}

                                {
                                    discount > 0 && (

                                        <div className="checkoutRow discount">

                                            <span>
                                                Discount
                                            </span>

                                            <strong>

                                                -
                                                {
                                                    formatCurrency(
                                                        discount
                                                    )
                                                }

                                            </strong>

                                        </div>

                                    )
                                }


                                <div className="checkoutDivider" />


                                {/* Total */}

                                <div className="checkoutRow total">

                                    <span>
                                        Total Payable
                                    </span>

                                    <strong>

                                        {
                                            paymentRequired
                                                ? formatCurrency(
                                                    amountPayable
                                                )
                                                : "FREE"
                                        }

                                    </strong>

                                </div>

                            </div>


                            {/* =================================================
                                PAYMENT FEATURES
                            ================================================= */}

                            <div className="checkoutFeatures">

                                <div>

                                    <HiOutlineShieldCheck />

                                    <span>
                                        Secure Paystack Payment
                                    </span>

                                </div>


                                <div>

                                    <HiOutlineSparkles />

                                    <span>
                                        Instant Booking Confirmation
                                    </span>

                                </div>


                                <div>

                                    <HiOutlineReceiptTax />

                                    <span>
                                        Receipt Sent By Email
                                    </span>

                                </div>

                            </div>


                            {/* =================================================
                                PAYMENT BUTTON
                            ================================================= */}

                            <button
                                type="button"
                                className="checkoutButton"
                                onClick={handlePayment}
                                disabled={loading}
                            >

                                {
                                    loading

                                        ? (
                                            <>
                                                Redirecting to Paystack...
                                            </>
                                        )

                                        : paymentRequired

                                            ? (
                                                <>
                                                    Continue To Secure Payment

                                                    <HiOutlineArrowRight />
                                                </>
                                            )

                                            : (
                                                <>
                                                    Complete Free Booking

                                                    <HiOutlineArrowRight />
                                                </>
                                            )
                                }

                            </button>


                            {/* =================================================
                                SECURITY NOTE
                            ================================================= */}

                            <small>

                                Payments are securely processed using
                                Paystack. Your personal information is
                                encrypted and protected.

                            </small>

                        </div>

                    </aside>

                </div>

            </div>

        </section>

    );

};


export default BookingSummary;

