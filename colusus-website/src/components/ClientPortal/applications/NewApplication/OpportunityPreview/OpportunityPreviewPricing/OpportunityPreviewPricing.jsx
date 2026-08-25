import {
    HiOutlineCheckCircle,
    HiOutlineInformationCircle,
    HiOutlineShieldCheck,
    HiOutlineCreditCard,
} from "react-icons/hi";

import "./OpportunityPreviewPricing.css";


/* ============================================================
   FORMAT CURRENCY
============================================================ */

const formatCurrency = (
    amount,
    currency = "NGN",
) => {

    if (
        amount === null ||
        amount === undefined ||
        amount === ""
    ) {
        return "Not specified";
    }


    const numericAmount = Number(amount);


    if (
        Number.isNaN(numericAmount)
    ) {
        return String(amount);
    }


    try {

        return new Intl.NumberFormat(
            "en-NG",
            {
                style: "currency",
                currency: currency || "NGN",
                maximumFractionDigits: 0,
            },
        ).format(numericAmount);

    } catch {

        return `${currency || "NGN"} ${numericAmount.toLocaleString()}`;

    }
};


/* ============================================================
   FORMAT LABEL
============================================================ */

const formatLabel = (
    value,
) => {

    if (!value) {
        return "";
    }


    return String(value)
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (character) =>
            character.toUpperCase()
        );
};


/* ============================================================
   GET VALUE
============================================================ */

const getValue = (
    object,
    keys = [],
) => {

    if (!object) {
        return undefined;
    }


    for (const key of keys) {

        if (
            object[key] !== undefined &&
            object[key] !== null &&
            object[key] !== ""
        ) {

            return object[key];

        }

    }


    return undefined;
};


/* ============================================================
   NORMALIZE PRICING
============================================================ */

const normalizePricing = (
    opportunity,
) => {

    const pricing =
        opportunity?.pricing;


    /*
    ------------------------------------------------------------
    No pricing configured
    ------------------------------------------------------------
    */

    if (
        !pricing ||
        typeof pricing !== "object"
    ) {

        return {
            exists: false,

            currency:
                opportunity?.currency ||
                "NGN",

            total: null,

            paymentType: null,

            refundable: null,

            notes: "",

            items: [],

            included: [],

            excluded: [],
        };

    }


    const currency =
        getValue(
            pricing,
            [
                "currency",
                "currencyCode",
            ],
        ) ||
        opportunity?.currency ||
        "NGN";


    /*
    ------------------------------------------------------------
    TOTAL
    ------------------------------------------------------------
    */

    const total =
        getValue(
            pricing,
            [
                "total",
                "totalFee",
                "amount",
                "price",
                "cost",
            ],
        );


    /*
    ------------------------------------------------------------
    PAYMENT TYPE
    ------------------------------------------------------------
    */

    const paymentType =
        getValue(
            pricing,
            [
                "paymentType",
                "paymentMethod",
                "billingType",
            ],
        );


    /*
    ------------------------------------------------------------
    REFUNDABLE
    ------------------------------------------------------------
    */

    const refundable =
        getValue(
            pricing,
            [
                "refundable",
                "isRefundable",
            ],
        );


    /*
    ------------------------------------------------------------
    NOTES
    ------------------------------------------------------------
    */

    const notes =
        getValue(
            pricing,
            [
                "notes",
                "description",
                "pricingNotes",
            ],
        ) || "";


    /*
    ------------------------------------------------------------
    INCLUDED
    ------------------------------------------------------------
    */

    const included =
        Array.isArray(
            pricing.included,
        )
            ? pricing.included
            : Array.isArray(
                pricing.includes,
            )
                ? pricing.includes
                : [];


    /*
    ------------------------------------------------------------
    EXCLUDED
    ------------------------------------------------------------
    */

    const excluded =
        Array.isArray(
            pricing.excluded,
        )
            ? pricing.excluded
            : Array.isArray(
                pricing.excludes,
            )
                ? pricing.excludes
                : [];


    /*
    ------------------------------------------------------------
    PRICING ITEMS
    ------------------------------------------------------------

    Supports structures such as:

    pricing.items

    pricing.breakdown

    pricing.fees

    ------------------------------------------------------------
    */

    let items = [];


    const rawItems =
        Array.isArray(pricing.items)
            ? pricing.items
            : Array.isArray(pricing.breakdown)
                ? pricing.breakdown
                : Array.isArray(pricing.fees)
                    ? pricing.fees
                    : [];


    items =
        rawItems.map(
            (item, index) => {

                if (
                    typeof item === "string" ||
                    typeof item === "number"
                ) {

                    return {
                        id: `pricing-${index}`,

                        label: `Cost ${index + 1}`,

                        description: "",

                        amount: item,
                    };

                }


                return {

                    id:
                        item?._id ||
                        item?.id ||
                        `pricing-${index}`,

                    label:
                        item?.label ||
                        item?.name ||
                        item?.title ||
                        item?.type ||
                        `Cost ${index + 1}`,

                    description:
                        item?.description ||
                        "",

                    amount:
                        getValue(
                            item,
                            [
                                "amount",
                                "price",
                                "fee",
                                "cost",
                                "value",
                            ],
                        ),
                };

            },
        );


    return {

        exists: true,

        currency,

        total,

        paymentType,

        refundable,

        notes,

        items,

        included,

        excluded,
    };
};


/* ============================================================
   NORMALIZE PAYMENT PLAN
============================================================ */

const normalizePaymentPlan = (
    opportunity,
) => {

    const paymentPlan =
        opportunity?.paymentPlan;


    if (
        !Array.isArray(paymentPlan)
    ) {

        return [];

    }


    return paymentPlan.map(
        (plan, index) => {

            if (
                typeof plan === "string" ||
                typeof plan === "number"
            ) {

                return {

                    id:
                        `payment-${index}`,

                    label:
                        `Payment ${index + 1}`,

                    description:
                        "",

                    amount:
                        plan,

                    percentage:
                        null,
                };

            }


            return {

                id:
                    plan?._id ||
                    plan?.id ||
                    `payment-${index}`,

                label:
                    plan?.label ||
                    plan?.name ||
                    plan?.title ||
                    `Payment ${index + 1}`,

                description:
                    plan?.description ||
                    "",

                amount:
                    getValue(
                        plan,
                        [
                            "amount",
                            "price",
                            "fee",
                            "cost",
                            "value",
                        ],
                    ),

                percentage:
                    getValue(
                        plan,
                        [
                            "percentage",
                            "percent",
                        ],
                    ),
            };

        },
    );
};


/* ============================================================
   COMPONENT
============================================================ */

const OpportunityPreviewPricing = ({
    opportunity,
}) => {

    const pricing =
        normalizePricing(
            opportunity,
        );


    const paymentPlan =
        normalizePaymentPlan(
            opportunity,
        );


    /*
    ------------------------------------------------------------
    NO PRICING
    ------------------------------------------------------------
    */

    if (!pricing.exists) {

        return (

            <section
                className="opportunity-preview-pricing"
                id="opportunity-preview-panel-pricing"
            >

                <div className="pricing-header">

                    <span className="pricing-eyebrow">
                        PATHWAY PRICING
                    </span>

                    <h2>
                        Pathway pricing
                    </h2>

                    <p>
                        Pricing information for this pathway
                        has not been configured yet.
                    </p>

                </div>


                <div className="pricing-notice">

                    <HiOutlineInformationCircle />

                    <div>

                        <strong>
                            Pricing not yet available
                        </strong>

                        <p>
                            Your Colusus team will provide
                            the applicable pathway costs
                            before payment is required.
                        </p>

                    </div>

                </div>

            </section>

        );

    }


    return (

        <section
            className="opportunity-preview-pricing"
            id="opportunity-preview-panel-pricing"
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="pricing-header">

                <span className="pricing-eyebrow">
                    PATHWAY PRICING
                </span>

                <h2>
                    Understand the cost
                </h2>

                <p>
                    Review the costs associated with this
                    pathway before beginning your application.
                </p>

            </div>


            {/* ==================================================
                TOTAL
            ================================================== */}

            {pricing.total !== null &&
                pricing.total !== undefined && (

                    <div className="pricing-breakdown">

                        <div className="pricing-total">

                            <div>

                                <span>
                                    Estimated pathway cost
                                </span>

                                <small>
                                    Based on the pricing configured
                                    for this pathway
                                </small>

                            </div>

                            <strong>

                                {formatCurrency(
                                    pricing.total,
                                    pricing.currency,
                                )}

                            </strong>

                        </div>


                        {/* ==========================================
                            PRICING ITEMS
                        ========================================== */}

                        {pricing.items.length > 0 && (

                            <>

                                {pricing.items.map(
                                    (item) => (

                                        <div
                                            key={item.id}
                                            className="pricing-row"
                                        >

                                            <div className="pricing-row-information">

                                                <strong>
                                                    {formatLabel(
                                                        item.label
                                                    )}
                                                </strong>

                                                {item.description && (

                                                    <span>
                                                        {item.description}
                                                    </span>

                                                )}

                                            </div>


                                            <strong className="pricing-row-amount">

                                                {formatCurrency(
                                                    item.amount,
                                                    pricing.currency,
                                                )}

                                            </strong>

                                        </div>

                                    ),
                                )}

                            </>

                        )}

                    </div>

                )}


            {/* ==================================================
                PAYMENT PLAN
            ================================================== */}

            {paymentPlan.length > 0 && (

                <div className="pricing-payment-plan">

                    <div className="pricing-section-heading">

                        <div className="pricing-section-icon">

                            <HiOutlineCreditCard />

                        </div>

                        <div>

                            <span>
                                PAYMENT PLAN
                            </span>

                            <h3>
                                How payment works
                            </h3>

                        </div>

                    </div>


                    <div className="pricing-payment-list">

                        {paymentPlan.map(
                            (plan, index) => (

                                <div
                                    key={plan.id}
                                    className="pricing-payment-card"
                                >

                                    <div className="pricing-payment-number">
                                        {index + 1}
                                    </div>


                                    <div className="pricing-payment-information">

                                        <strong>
                                            {formatLabel(
                                                plan.label
                                            )}
                                        </strong>

                                        {plan.description && (

                                            <span>
                                                {plan.description}
                                            </span>

                                        )}

                                    </div>


                                    <div className="pricing-payment-amount">

                                        {plan.percentage !== null &&
                                            plan.percentage !== undefined && (

                                                <small>
                                                    {plan.percentage}%
                                                </small>

                                            )}

                                        {plan.amount !== null &&
                                            plan.amount !== undefined && (

                                                <strong>
                                                    {formatCurrency(
                                                        plan.amount,
                                                        pricing.currency,
                                                    )}
                                                </strong>

                                            )}

                                    </div>

                                </div>

                            ),
                        )}

                    </div>

                </div>

            )}


            {/* ==================================================
                PAYMENT / REFUND
            ================================================== */}

            {(pricing.paymentType ||
                pricing.refundable !== null) && (

                    <div className="pricing-meta">

                        {pricing.paymentType && (

                            <div className="pricing-meta-card">

                                <div className="pricing-meta-icon">

                                    <HiOutlineShieldCheck />

                                </div>

                                <div>

                                    <span>
                                        Payment
                                    </span>

                                    <strong>
                                        {formatLabel(
                                            pricing.paymentType
                                        )}
                                    </strong>

                                </div>

                            </div>

                        )}


                        {pricing.refundable !== null && (

                            <div className="pricing-meta-card">

                                <div className="pricing-meta-icon">

                                    <HiOutlineInformationCircle />

                                </div>

                                <div>

                                    <span>
                                        Refund policy
                                    </span>

                                    <strong>
                                        {pricing.refundable
                                            ? "Refundable"
                                            : "Non-refundable"}
                                    </strong>

                                </div>

                            </div>

                        )}

                    </div>

                )}


            {/* ==================================================
                INCLUDED
            ================================================== */}

            {pricing.included.length > 0 && (

                <div className="pricing-included">

                    <h3>
                        What's included
                    </h3>


                    <div>

                        {pricing.included.map(
                            (item, index) => (

                                <div
                                    key={`${item}-${index}`}
                                    className="pricing-included-item"
                                >

                                    <HiOutlineCheckCircle />

                                    <span>
                                        {item}
                                    </span>

                                </div>

                            ),
                        )}

                    </div>

                </div>

            )}


            {/* ==================================================
                EXCLUDED
            ================================================== */}

            {pricing.excluded.length > 0 && (

                <div className="pricing-excluded">

                    <h3>
                        Not included
                    </h3>


                    <div>

                        {pricing.excluded.map(
                            (item, index) => (

                                <div
                                    key={`${item}-${index}`}
                                    className="pricing-excluded-item"
                                >

                                    <span>
                                        {item}
                                    </span>

                                </div>

                            ),
                        )}

                    </div>

                </div>

            )}


            {/* ==================================================
                NOTES
            ================================================== */}

            <div className="pricing-notice">

                <HiOutlineInformationCircle />

                <div>

                    <strong>
                        Important pricing information
                    </strong>

                    <p>

                        {pricing.notes ||
                            "Government and third-party fees may change. Final costs will be confirmed before payment."}

                    </p>

                </div>

            </div>

        </section>

    );
};


export default OpportunityPreviewPricing;