import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    HiOutlineCreditCard,
    HiOutlineReceiptTax,
    HiOutlineRefresh,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineExclamationCircle,
    HiOutlineDocumentText,
} from "react-icons/hi";

import api from "../../../services/api";
import paymentService from "../../../services/payment.service";

import "./ClientFinance.css";


/* ============================================================
   HELPERS
   ============================================================ */

const formatCurrency = (amount, currency = "NGN") => {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: currency || "NGN",
        maximumFractionDigits: 0,
    }).format(value);
};


const formatDate = (date) => {
    if (!date) {
        return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(parsed);
};


const getArrayData = (response) => {
    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
};


const getApplicationId = (application) => {
    return (
        application?._id ||
        application?.id ||
        null
    );
};


const getApplicationReference = (application) => {
    return (
        application?.applicationReference ||
        application?.reference ||
        application?.applicationNumber ||
        "Application"
    );
};


const getOpportunityName = (application) => {
    const opportunity = application?.opportunity;

    if (typeof opportunity === "string") {
        return opportunity;
    }

    return (
        opportunity?.title ||
        opportunity?.name ||
        opportunity?.programName ||
        opportunity?.destination ||
        "Migration Application"
    );
};


/* ============================================================
   PAYMENT STAGE STATUS

   IMPORTANT:
   Application.paymentPlan is the source of truth.

   LOCKED + no invoice = LOCKED
   PENDING + invoice with balance = PAYABLE
   PAID = PAID

   A missing invoice can NEVER mean PAID.
   ============================================================ */

const getStageStatus = (stage, invoice) => {
    if (stage?.status === "PAID") {
        return "PAID";
    }

    if (stage?.status === "CANCELLED") {
        return "CANCELLED";
    }

    if (stage?.status === "LOCKED") {
        return "LOCKED";
    }

    if (
        stage?.status === "PENDING" &&
        invoice &&
        Number(invoice.balanceDue || 0) > 0
    ) {
        return "PAYABLE";
    }

    if (stage?.status === "PENDING") {
        return "PENDING";
    }

    return "UPCOMING";
};


const getStageAmount = (stage, invoice) => {
    if (invoice) {
        const balance = Number(
            invoice.balanceDue || 0,
        );

        if (balance > 0) {
            return balance;
        }

        return Number(
            invoice.total ||
            stage?.amount ||
            0,
        );
    }

    return Number(
        stage?.amount || 0,
    );
};


const getStageName = (stage, index) => {
    return (
        stage?.name ||
        stage?.title ||
        `Payment Stage ${stage?.stage || index + 1}`
    );
};


const getInvoiceTitle = (invoice) => {
    if (invoice?.items?.length) {
        const firstItem = invoice.items[0];

        if (firstItem?.description) {
            return firstItem.description;
        }

        if (firstItem?.name) {
            return firstItem.name;
        }
    }

    return invoice?.invoiceType || "Payment";
};


const isPayableStage = (stage) => {
    return stage?.resolvedStatus === "PAYABLE";
};


const isPaidStage = (stage) => {
    return stage?.resolvedStatus === "PAID";
};


const isLockedStage = (stage) => {
    return stage?.resolvedStatus === "LOCKED";
};


/* ============================================================
   COMPONENT
   ============================================================ */

const ClientFinance = () => {
    const [applications, setApplications] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [receipts, setReceipts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState(
        "overview",
    );

    const [payingInvoiceId, setPayingInvoiceId] =
        useState(null);

    const [paymentSuccess, setPaymentSuccess] =
        useState(false);

    const [paymentVerifying, setPaymentVerifying] =
        useState(false);


    /* ========================================================
       LOAD FINANCE DATA
       ======================================================== */

    const loadFinance = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                applicationsResponse,
                invoicesResponse,
                paymentsResponse,
                receiptsResponse,
            ] = await Promise.all([
                api.get("/applications"),
                api.get("/invoices/my"),
                api.get("/payments/my"),
                api.get("/receipts/my"),
            ]);

            setApplications(
                getArrayData(
                    applicationsResponse,
                ),
            );

            setInvoices(
                getArrayData(
                    invoicesResponse,
                ),
            );

            setPayments(
                getArrayData(
                    paymentsResponse,
                ),
            );

            setReceipts(
                getArrayData(
                    receiptsResponse,
                ),
            );
        } catch (err) {
            console.error(
                "CLIENT FINANCE LOAD ERROR",
                err,
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load your financial information.",
            );
        } finally {
            setLoading(false);
        }
    };


    /* ========================================================
       PAYSTACK RETURN / PAYMENT VERIFICATION
       ======================================================== */

    useEffect(() => {
        const handlePaymentReturn = async () => {
            const params = new URLSearchParams(
                window.location.search,
            );

            const reference =
                params.get("reference");

            /*
             * No Paystack reference means this is
             * a normal Finance page visit.
             */
            if (!reference) {
                await loadFinance();
                return;
            }

            try {
                setPaymentVerifying(true);
                setError("");
                setPaymentSuccess(false);

                console.log(
                    "VERIFYING PAYSTACK PAYMENT:",
                    reference,
                );

                /*
                 * The backend verifies the transaction
                 * directly against Paystack.
                 *
                 * The backend then completes:
                 *
                 * Payment
                 * Invoice
                 * Receipt
                 * Application payment stage
                 */
                await paymentService.verifyPayment(
                    reference,
                );

                console.log(
                    "PAYMENT VERIFIED SUCCESSFULLY:",
                    reference,
                );

                setPaymentSuccess(true);

                /*
                 * Reload all Finance data from the
                 * backend so the UI reflects the
                 * completed payment.
                 */
                await loadFinance();

                /*
                 * Remove the Paystack reference from
                 * the browser URL.
                 *
                 * This prevents a normal page refresh
                 * from repeatedly attempting to verify
                 * the same payment.
                 */
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname,
                );
            } catch (err) {
                console.error(
                    "PAYMENT RETURN VERIFICATION ERROR",
                    err,
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "We could not verify your payment. Please refresh and try again.",
                );

                /*
                 * Important:
                 *
                 * The Paystack webhook may have already
                 * completed the payment even if the
                 * browser verification failed.
                 *
                 * Therefore reload Finance anyway.
                 */
                try {
                    await loadFinance();
                } catch (reloadError) {
                    console.error(
                        "FINANCE RELOAD AFTER PAYMENT ERROR",
                        reloadError,
                    );
                }
            } finally {
                setPaymentVerifying(false);
                setPayingInvoiceId(null);
            }
        };

        handlePaymentReturn();
    }, []);


    /* ========================================================
       INVOICE MAP
       ======================================================== */

    const invoiceMap = useMemo(() => {
        const map = new Map();

        invoices.forEach((invoice) => {
            if (!invoice?._id) {
                return;
            }

            map.set(
                String(invoice._id),
                invoice,
            );
        });

        return map;
    }, [invoices]);


    /* ========================================================
       APPLICATION PAYMENT PLANS
       ======================================================== */

    const applicationPlans = useMemo(() => {
        return applications.map(
            (application) => {
                const paymentPlan =
                    Array.isArray(
                        application?.paymentPlan,
                    )
                        ? application.paymentPlan
                        : [];

                const stages = paymentPlan
                    .map((stage, index) => {
                        const invoiceId =
                            stage?.invoiceId?._id ||
                            stage?.invoiceId ||
                            null;

                        const invoice = invoiceId
                            ? invoiceMap.get(
                                String(invoiceId),
                            )
                            : null;

                        const resolvedStatus =
                            getStageStatus(
                                stage,
                                invoice,
                            );

                        return {
                            ...stage,
                            index,
                            invoice,
                            invoiceId,
                            resolvedStatus,
                        };
                    })
                    .sort(
                        (a, b) =>
                            Number(
                                a.stage ||
                                a.index + 1,
                            ) -
                            Number(
                                b.stage ||
                                b.index + 1,
                            ),
                    );

                const total = stages.reduce(
                    (sum, stage) =>
                        sum +
                        Number(
                            stage.amount ||
                            stage.invoice?.total ||
                            0,
                        ),
                    0,
                );

                const paid = stages.reduce(
                    (sum, stage) => {
                        if (
                            !isPaidStage(stage)
                        ) {
                            return sum;
                        }

                        return (
                            sum +
                            Number(
                                stage.invoice
                                    ?.amountPaid ||
                                stage.amount ||
                                0,
                            )
                        );
                    },
                    0,
                );

                const outstanding =
                    stages.reduce(
                        (sum, stage) => {
                            if (
                                isPaidStage(
                                    stage,
                                )
                            ) {
                                return sum;
                            }

                            if (
                                stage.invoice
                            ) {
                                return (
                                    sum +
                                    Number(
                                        stage.invoice
                                            .balanceDue ||
                                        0,
                                    )
                                );
                            }

                            return (
                                sum +
                                Number(
                                    stage.amount ||
                                    0,
                                )
                            );
                        },
                        0,
                    );

                const percentage =
                    total > 0
                        ? Math.min(
                            100,
                            Math.round(
                                (paid /
                                    total) *
                                100,
                            ),
                        )
                        : 0;

                const currentStage =
                    stages.find(
                        (stage) =>
                            isPayableStage(
                                stage,
                            ),
                    ) ||
                    stages.find(
                        (stage) =>
                            stage.status ===
                            "PENDING",
                    ) ||
                    null;

                const paidStages =
                    stages.filter(
                        (stage) =>
                            isPaidStage(
                                stage,
                            ),
                    );

                const payableStages =
                    stages.filter(
                        (stage) =>
                            isPayableStage(
                                stage,
                            ),
                    );

                const lockedStages =
                    stages.filter(
                        (stage) =>
                            isLockedStage(
                                stage,
                            ),
                    );

                return {
                    application,
                    applicationId:
                        getApplicationId(
                            application,
                        ),
                    applicationReference:
                        getApplicationReference(
                            application,
                        ),
                    opportunityName:
                        getOpportunityName(
                            application,
                        ),
                    stages,
                    total,
                    paid,
                    outstanding,
                    percentage,
                    currentStage,
                    paidStages,
                    payableStages,
                    lockedStages,
                };
            },
        );
    }, [
        applications,
        invoiceMap,
    ]);


    /* ========================================================
       OTHER OUTSTANDING INVOICES
       ======================================================== */

    const otherOutstanding = useMemo(() => {
        return invoices.filter(
            (invoice) => {
                if (
                    invoice?.invoiceType ===
                    "APPLICATION"
                ) {
                    return false;
                }

                return (
                    Number(
                        invoice?.balanceDue ||
                        0,
                    ) > 0 &&
                    [
                        "ISSUED",
                        "PARTIALLY_PAID",
                        "OVERDUE",
                    ].includes(
                        invoice?.status,
                    )
                );
            },
        );
    }, [invoices]);


    /* ========================================================
       GLOBAL SUMMARY
       ======================================================== */

    const summary = useMemo(() => {
        const applicationTotals =
            applicationPlans.reduce(
                (result, plan) => {
                    result.total +=
                        plan.total;

                    result.paid +=
                        plan.paid;

                    result.outstanding +=
                        plan.outstanding;

                    return result;
                },
                {
                    total: 0,
                    paid: 0,
                    outstanding: 0,
                },
            );

        const otherInvoiceTotal =
            otherOutstanding.reduce(
                (sum, invoice) =>
                    sum +
                    Number(
                        invoice.total || 0,
                    ),
                0,
            );

        const otherOutstandingAmount =
            otherOutstanding.reduce(
                (sum, invoice) =>
                    sum +
                    Number(
                        invoice.balanceDue ||
                        0,
                    ),
                0,
            );

        const totalInvoiced =
            applicationTotals.total +
            otherInvoiceTotal;

        const totalPaid =
            applicationTotals.paid;

        const outstanding =
            applicationTotals.outstanding +
            otherOutstandingAmount;

        const progress =
            totalInvoiced > 0
                ? Math.min(
                    100,
                    Math.round(
                        (totalPaid /
                            totalInvoiced) *
                        100,
                    ),
                )
                : 0;

        const successfulPayments =
            payments.filter(
                (payment) =>
                    payment.status ===
                    "SUCCESS",
            );

        const pendingPayments =
            payments.filter(
                (payment) =>
                    [
                        "PENDING",
                        "PROCESSING",
                    ].includes(
                        payment.status,
                    ),
            );

        const payableStages =
            applicationPlans.reduce(
                (count, plan) =>
                    count +
                    plan.payableStages.length,
                0,
            );

        return {
            totalInvoiced,
            totalPaid,
            outstanding,
            progress,
            paymentCount:
                successfulPayments.length,
            pendingCount:
                pendingPayments.length,
            payableStages,
        };
    }, [
        applicationPlans,
        otherOutstanding,
        payments,
    ]);


    /* ========================================================
       RECENT PAYMENTS
       ======================================================== */

    const recentPayments = useMemo(() => {
        return [...payments]
            .sort(
                (a, b) =>
                    new Date(
                        b.paidAt ||
                        b.createdAt ||
                        0,
                    ) -
                    new Date(
                        a.paidAt ||
                        a.createdAt ||
                        0,
                    ),
            )
            .slice(0, 10);
    }, [payments]);


    /* ========================================================
       RECEIPTS
       ======================================================== */

    const recentReceipts = useMemo(() => {
        return [...receipts]
            .sort(
                (a, b) =>
                    new Date(
                        b.issuedAt ||
                        b.createdAt ||
                        0,
                    ) -
                    new Date(
                        a.issuedAt ||
                        a.createdAt ||
                        0,
                    ),
            )
            .slice(0, 10);
    }, [receipts]);


    /* ========================================================
       PAY APPLICATION STAGE
       ======================================================== */

    const handlePay = async (stage) => {
        const invoice = stage?.invoice;

        if (!invoice?._id) {
            setError(
                "This payment stage is not ready for payment yet.",
            );

            return;
        }

        if (!isPayableStage(stage)) {
            setError(
                "This payment stage is not currently payable.",
            );

            return;
        }

        try {
            setError("");
            setPaymentSuccess(false);

            setPayingInvoiceId(
                invoice._id,
            );

            await paymentService.payInvoice({
                paymentType:
                    invoice.invoiceType,
                invoiceId:
                    invoice._id,
            });
        } catch (err) {
            console.error(
                "CLIENT PAYMENT ERROR",
                err,
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to start payment.",
            );

            setPayingInvoiceId(null);
        }
    };


    /* ========================================================
       PAY OTHER INVOICE
       ======================================================== */

    const handlePayOtherInvoice = async (
        invoice,
    ) => {
        if (!invoice?._id) {
            return;
        }

        try {
            setError("");
            setPaymentSuccess(false);

            setPayingInvoiceId(
                invoice._id,
            );

            await paymentService.payInvoice({
                paymentType:
                    invoice.invoiceType,
                invoiceId:
                    invoice._id,
            });
        } catch (err) {
            console.error(
                "CLIENT PAYMENT ERROR",
                err,
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to start payment.",
            );

            setPayingInvoiceId(null);
        }
    };


    /* ========================================================
       LOADING
       ======================================================== */

    if (loading) {
        return (
            <main className="client-finance">
                <div className="client-finance__loading">
                    <HiOutlineRefresh />

                    <span>
                        Loading your finance information...
                    </span>
                </div>
            </main>
        );
    }


    /* ========================================================
       RENDER
       ======================================================== */

    return (
        <main className="client-finance">

            {/* ==================================================
                PAYMENT VERIFICATION
                ================================================== */}

            {paymentVerifying && (
                <div className="client-finance__verification">
                    <HiOutlineRefresh />

                    <span>
                        Confirming your payment...
                    </span>
                </div>
            )}


            {/* ==================================================
                HEADER
                ================================================== */}

            <header className="client-finance__header">

                <div>

                    <span className="client-finance__eyebrow">
                        Finance
                    </span>

                    <h1>
                        Payments & Finance
                    </h1>

                    <p>
                        Manage your application
                        payments, payment stages and
                        receipts in one place.
                    </p>

                </div>

                <button
                    type="button"
                    className="client-finance__refresh"
                    onClick={loadFinance}
                    disabled={loading || paymentVerifying}
                >
                    <HiOutlineRefresh />
                    Refresh
                </button>

            </header>


            {/* ==================================================
                ERROR
                ================================================== */}

            {error && (
                <div className="client-finance__error">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={loadFinance}
                    >
                        Try again
                    </button>

                </div>
            )}


            {/* ==================================================
                PAYMENT SUCCESS
                ================================================== */}

            {paymentSuccess && (
                <div className="client-finance__success">

                    <HiOutlineCheckCircle />

                    <div>

                        <strong>
                            Payment successful
                        </strong>

                        <span>
                            Your payment has been
                            confirmed and your
                            application payment plan
                            has been updated.
                        </span>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setPaymentSuccess(false)
                        }
                    >
                        Dismiss
                    </button>

                </div>
            )}


            {/* ==================================================
                FINANCIAL OVERVIEW
                ================================================== */}

            <section className="client-finance__overview">

                <div className="client-finance__overview-main">

                    <div>

                        <span>
                            Total Application Cost
                        </span>

                        <strong>
                            {formatCurrency(
                                summary.totalInvoiced,
                            )}
                        </strong>

                    </div>


                    <div className="client-finance__progress-wrap">

                        <div className="client-finance__progress-info">

                            <span>
                                Payment progress
                            </span>

                            <strong>
                                {summary.progress}%
                            </strong>

                        </div>

                        <div className="client-finance__progress">

                            <div
                                style={{
                                    width: `${summary.progress}%`,
                                }}
                            />

                        </div>

                    </div>


                    <div className="client-finance__overview-values">

                        <div>

                            <span>
                                Paid
                            </span>

                            <strong>
                                {formatCurrency(
                                    summary.totalPaid,
                                )}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Remaining
                            </span>

                            <strong>
                                {formatCurrency(
                                    summary.outstanding,
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                <div className="client-finance__overview-stats">

                    <div>

                        <HiOutlineCheckCircle />

                        <span>
                            Payments Completed
                        </span>

                        <strong>
                            {summary.paymentCount}
                        </strong>

                    </div>

                    <div>

                        <HiOutlineClock />

                        <span>
                            Pending Payments
                        </span>

                        <strong>
                            {summary.pendingCount}
                        </strong>

                    </div>

                    <div>

                        <HiOutlineReceiptTax />

                        <span>
                            Receipts
                        </span>

                        <strong>
                            {receipts.length}
                        </strong>

                    </div>

                </div>

            </section>


            {/* ==================================================
                PAY NOW NOTICE
                ================================================== */}

            {summary.payableStages > 0 && (
                <section className="client-finance__payable-banner">

                    <div>

                        <HiOutlineExclamationCircle />

                        <div>

                            <strong>
                                Payment required
                            </strong>

                            <span>
                                You have{" "}
                                {summary.payableStages}{" "}
                                payment stage
                                {summary.payableStages !== 1
                                    ? "s"
                                    : ""}{" "}
                                currently available.
                            </span>

                        </div>

                    </div>

                </section>
            )}


            {/* ==================================================
                TABS
                ================================================== */}

            <nav className="client-finance__tabs">

                <button
                    type="button"
                    className={
                        activeTab === "overview"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("overview")
                    }
                >
                    Payment Plans
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "payments"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("payments")
                    }
                >
                    Payment History
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "receipts"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("receipts")
                    }
                >
                    Receipts
                </button>

            </nav>


            {/* ==================================================
                PAYMENT PLANS
                ================================================== */}

            {activeTab === "overview" && (

                <section className="client-finance__content">

                    {applicationPlans.length > 0 ? (

                        <div className="client-finance__plans">

                            {applicationPlans.map(
                                (plan) => (

                                    <article
                                        key={
                                            plan.applicationId
                                        }
                                        className="client-finance__plan"
                                    >

                                        {/* APPLICATION HEADER */}

                                        <div className="client-finance__plan-header">

                                            <div>

                                                <span>
                                                    APPLICATION
                                                </span>

                                                <h2>
                                                    {
                                                        plan.applicationReference
                                                    }
                                                </h2>

                                                <p>
                                                    {
                                                        plan.opportunityName
                                                    }
                                                </p>

                                            </div>

                                            <div className="client-finance__plan-progress">

                                                <strong>
                                                    {
                                                        plan.percentage
                                                    }%
                                                </strong>

                                                <span>
                                                    paid
                                                </span>

                                            </div>

                                        </div>


                                        {/* PROGRESS */}

                                        <div className="client-finance__plan-bar">

                                            <div
                                                style={{
                                                    width: `${plan.percentage}%`,
                                                }}
                                            />

                                        </div>


                                        {/* FINANCIAL VALUES */}

                                        <div className="client-finance__plan-summary">

                                            <div>

                                                <span>
                                                    Total
                                                </span>

                                                <strong>
                                                    {formatCurrency(
                                                        plan.total,
                                                    )}
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Paid
                                                </span>

                                                <strong>
                                                    {formatCurrency(
                                                        plan.paid,
                                                    )}
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Remaining
                                                </span>

                                                <strong>
                                                    {formatCurrency(
                                                        plan.outstanding,
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* CURRENT PAYMENT */}

                                        {plan.currentStage &&
                                            isPayableStage(
                                                plan.currentStage,
                                            ) && (

                                                <div className="client-finance__current-payment">

                                                    <div>

                                                        <span>
                                                            CURRENT PAYMENT
                                                        </span>

                                                        <strong>
                                                            {getStageName(
                                                                plan.currentStage,
                                                                plan.currentStage.index,
                                                            )}
                                                        </strong>

                                                        <small>
                                                            This payment is currently available.
                                                        </small>

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {formatCurrency(
                                                                getStageAmount(
                                                                    plan.currentStage,
                                                                    plan.currentStage.invoice,
                                                                ),
                                                                plan.currentStage
                                                                    .invoice
                                                                    ?.currency ||
                                                                "NGN",
                                                            )}
                                                        </strong>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handlePay(
                                                                    plan.currentStage,
                                                                )
                                                            }
                                                            disabled={
                                                                payingInvoiceId ===
                                                                plan
                                                                    .currentStage
                                                                    ?.invoice
                                                                    ?._id ||
                                                                paymentVerifying
                                                            }
                                                        >
                                                            {payingInvoiceId ===
                                                                plan
                                                                    .currentStage
                                                                    ?.invoice
                                                                    ?._id
                                                                ? "Opening..."
                                                                : "Pay Now"}
                                                        </button>

                                                    </div>

                                                </div>

                                            )}


                                        {/* PAYMENT STAGES */}

                                        <div className="client-finance__stages">

                                            <div className="client-finance__stages-title">

                                                <h3>
                                                    Payment Stages
                                                </h3>

                                                <span>
                                                    {
                                                        plan.stages.length
                                                    }{" "}
                                                    stage
                                                    {plan.stages.length !==
                                                        1
                                                        ? "s"
                                                        : ""}
                                                </span>

                                            </div>


                                            {plan.stages.map(
                                                (
                                                    stage,
                                                ) => {

                                                    const paid =
                                                        isPaidStage(
                                                            stage,
                                                        );

                                                    const payable =
                                                        isPayableStage(
                                                            stage,
                                                        );

                                                    const locked =
                                                        isLockedStage(
                                                            stage,
                                                        );

                                                    const invoice =
                                                        stage.invoice;

                                                    const amount =
                                                        getStageAmount(
                                                            stage,
                                                            invoice,
                                                        );

                                                    return (

                                                        <div
                                                            key={
                                                                `${plan.applicationId}-${stage.stage || stage.index}`
                                                            }
                                                            className={
                                                                `client-finance__stage ${paid
                                                                    ? "client-finance__stage--paid"
                                                                    : payable
                                                                        ? "client-finance__stage--due"
                                                                        : "client-finance__stage--upcoming"
                                                                }`
                                                            }
                                                        >

                                                            <div className="client-finance__stage-marker">

                                                                {paid ? (

                                                                    <HiOutlineCheckCircle />

                                                                ) : payable ? (

                                                                    <HiOutlineExclamationCircle />

                                                                ) : (

                                                                    <HiOutlineClock />

                                                                )}

                                                            </div>


                                                            <div className="client-finance__stage-info">

                                                                <strong>
                                                                    {
                                                                        getStageName(
                                                                            stage,
                                                                            stage.index,
                                                                        )
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    Stage{" "}
                                                                    {
                                                                        stage.stage ||
                                                                        stage.index +
                                                                        1
                                                                    }

                                                                    {invoice?.invoiceNumber
                                                                        ? ` • ${invoice.invoiceNumber}`
                                                                        : ""}
                                                                </span>


                                                                {paid && (

                                                                    <small>
                                                                        Payment completed
                                                                        {stage.paidAt
                                                                            ? ` • ${formatDate(
                                                                                stage.paidAt,
                                                                            )}`
                                                                            : ""}
                                                                    </small>

                                                                )}


                                                                {payable && (

                                                                    <small>
                                                                        Payment required
                                                                    </small>

                                                                )}


                                                                {locked && (

                                                                    <small>
                                                                        This payment becomes available after the previous stage is completed.
                                                                    </small>

                                                                )}


                                                                {!paid &&
                                                                    !payable &&
                                                                    !locked && (

                                                                        <small>
                                                                            Upcoming
                                                                        </small>

                                                                    )}

                                                            </div>


                                                            <div className="client-finance__stage-amount">

                                                                <strong>
                                                                    {formatCurrency(
                                                                        amount,
                                                                        invoice?.currency ||
                                                                        stage?.currency ||
                                                                        "NGN",
                                                                    )}
                                                                </strong>


                                                                {paid ? (

                                                                    <span className="client-finance__stage-status client-finance__stage-status--paid">
                                                                        Paid
                                                                    </span>

                                                                ) : payable ? (

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handlePay(
                                                                                stage,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            payingInvoiceId ===
                                                                            invoice?._id ||
                                                                            paymentVerifying
                                                                        }
                                                                    >
                                                                        {payingInvoiceId ===
                                                                            invoice?._id
                                                                            ? "Opening..."
                                                                            : "Pay Now"}
                                                                    </button>

                                                                ) : locked ? (

                                                                    <span className="client-finance__stage-status">
                                                                        Locked
                                                                    </span>

                                                                ) : (

                                                                    <span className="client-finance__stage-status">
                                                                        Upcoming
                                                                    </span>

                                                                )}

                                                            </div>

                                                        </div>

                                                    );

                                                },
                                            )}

                                        </div>

                                    </article>

                                ),
                            )}

                        </div>

                    ) : (

                        <div className="client-finance__empty">

                            <HiOutlineDocumentText />

                            <h3>
                                No applications yet
                            </h3>

                            <p>
                                Your payment plans will
                                appear here automatically
                                when you have an application.
                            </p>

                        </div>

                    )}


                    {/* ==================================================
                        OTHER OUTSTANDING PAYMENTS
                        ================================================== */}

                    {otherOutstanding.length > 0 && (

                        <div className="client-finance__section">

                            <div className="client-finance__section-header">

                                <div>

                                    <h2>
                                        Other Outstanding Payments
                                    </h2>

                                    <p>
                                        Payments outside your
                                        application payment
                                        plans.
                                    </p>

                                </div>

                            </div>


                            <div className="client-finance__invoice-list">

                                {otherOutstanding.map(
                                    (invoice) => (

                                        <article
                                            key={
                                                invoice._id
                                            }
                                            className="client-finance__invoice"
                                        >

                                            <div>

                                                <span className="client-finance__invoice-number">
                                                    {
                                                        invoice.invoiceNumber
                                                    }
                                                </span>

                                                <strong>
                                                    {
                                                        getInvoiceTitle(
                                                            invoice,
                                                        )
                                                    }
                                                </strong>

                                                <small>
                                                    {
                                                        invoice.invoiceType
                                                    }
                                                </small>

                                            </div>


                                            <div className="client-finance__invoice-right">

                                                <strong>
                                                    {formatCurrency(
                                                        invoice.balanceDue,
                                                        invoice.currency,
                                                    )}
                                                </strong>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handlePayOtherInvoice(
                                                            invoice,
                                                        )
                                                    }
                                                    disabled={
                                                        payingInvoiceId ===
                                                        invoice._id ||
                                                        paymentVerifying
                                                    }
                                                >
                                                    {payingInvoiceId ===
                                                        invoice._id
                                                        ? "Opening..."
                                                        : "Pay Now"}
                                                </button>

                                            </div>

                                        </article>

                                    ),
                                )}

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        RECENT PAYMENT ACTIVITY
                        ================================================== */}

                    {recentPayments.length > 0 && (

                        <div className="client-finance__section">

                            <div className="client-finance__section-header">

                                <div>

                                    <h2>
                                        Recent Payment Activity
                                    </h2>

                                    <p>
                                        Your latest transactions.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="client-finance__section-link"
                                    onClick={() =>
                                        setActiveTab(
                                            "payments",
                                        )
                                    }
                                >
                                    View all
                                </button>

                            </div>


                            <div className="client-finance__table-wrapper">

                                <table className="client-finance__table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Reference
                                            </th>

                                            <th>
                                                Type
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {recentPayments.map(
                                            (payment) => (

                                                <tr
                                                    key={
                                                        payment._id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            payment.reference ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            payment.paymentType ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            payment.amount,
                                                            payment.currency,
                                                        )}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                `client-finance__status client-finance__status--${String(
                                                                    payment.status ||
                                                                    "",
                                                                ).toLowerCase()}`
                                                            }
                                                        >
                                                            {
                                                                payment.status ||
                                                                "—"
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            payment.paidAt ||
                                                            payment.createdAt,
                                                        )}
                                                    </td>

                                                </tr>

                                            ),
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}

                </section>

            )}


            {/* ==================================================
                PAYMENT HISTORY
                ================================================== */}

            {activeTab === "payments" && (

                <section className="client-finance__section">

                    <div className="client-finance__section-header">

                        <div>

                            <h2>
                                Payment History
                            </h2>

                            <p>
                                All payments associated
                                with your account.
                            </p>

                        </div>

                    </div>


                    {payments.length === 0 ? (

                        <div className="client-finance__empty">

                            <HiOutlineCreditCard />

                            <h3>
                                No payments yet
                            </h3>

                            <p>
                                Your payment activity
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="client-finance__table-wrapper">

                            <table className="client-finance__table">

                                <thead>

                                    <tr>

                                        <th>
                                            Reference
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Provider
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {payments.map(
                                        (payment) => (

                                            <tr
                                                key={
                                                    payment._id
                                                }
                                            >

                                                <td>
                                                    {
                                                        payment.reference ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        payment.paymentType ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        payment.amount,
                                                        payment.currency,
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        payment.provider ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            `client-finance__status client-finance__status--${String(
                                                                payment.status ||
                                                                "",
                                                            ).toLowerCase()}`
                                                        }
                                                    >
                                                        {
                                                            payment.status ||
                                                            "—"
                                                        }
                                                    </span>

                                                </td>

                                                <td>
                                                    {formatDate(
                                                        payment.paidAt ||
                                                        payment.createdAt,
                                                    )}
                                                </td>

                                            </tr>

                                        ),
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            )}


            {/* ==================================================
                RECEIPTS
                ================================================== */}

            {activeTab === "receipts" && (

                <section className="client-finance__section">

                    <div className="client-finance__section-header">

                        <div>

                            <h2>
                                Receipts
                            </h2>

                            <p>
                                Your issued payment
                                receipts.
                            </p>

                        </div>

                    </div>


                    {recentReceipts.length === 0 ? (

                        <div className="client-finance__empty">

                            <HiOutlineReceiptTax />

                            <h3>
                                No receipts yet
                            </h3>

                            <p>
                                Receipts for successful
                                payments will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="client-finance__table-wrapper">

                            <table className="client-finance__table">

                                <thead>

                                    <tr>

                                        <th>
                                            Receipt
                                        </th>

                                        <th>
                                            Payment
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Issued
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {recentReceipts.map(
                                        (receipt) => (

                                            <tr
                                                key={
                                                    receipt._id
                                                }
                                            >

                                                <td>
                                                    {
                                                        receipt.receiptNumber ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        receipt.paymentReference ||
                                                        receipt.payment?.reference ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        receipt.paymentType ||
                                                        receipt.payment?.paymentType ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        receipt.amount,
                                                        receipt.currency,
                                                    )}
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            `client-finance__status client-finance__status--${String(
                                                                receipt.status ||
                                                                "",
                                                            ).toLowerCase()}`
                                                        }
                                                    >
                                                        {
                                                            receipt.status ||
                                                            "—"
                                                        }
                                                    </span>

                                                </td>

                                                <td>
                                                    {formatDate(
                                                        receipt.issuedAt ||
                                                        receipt.createdAt,
                                                    )}
                                                </td>

                                            </tr>

                                        ),
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            )}

        </main>
    );
};


export default ClientFinance;