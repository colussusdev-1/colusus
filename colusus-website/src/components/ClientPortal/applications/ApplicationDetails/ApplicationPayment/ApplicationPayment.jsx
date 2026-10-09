
import {
    useMemo,
    useState,
} from "react";

import paymentService
    from "../../../../../services/payment.service";

import "./ApplicationPayment.css";


const ApplicationPayment = ({
    application,
    onPaymentStarted,
}) => {

    const [paying, setPaying] =
        useState(false);


    const [error, setError] =
        useState("");


    /* =========================================================
       FIND CURRENT PAYMENT STAGE
    =========================================================
    
       The backend controls the payment plan.

       We only identify the stage that is currently payable.

    ========================================================= */

    const currentStage = useMemo(() => {

        const paymentPlan =
            Array.isArray(
                application?.paymentPlan,
            )
                ? application.paymentPlan
                : [];


        if (!paymentPlan.length) {

            return null;

        }


        /*
         * Prefer the application's explicit
         * currentPaymentStage.
         */

        if (
            application?.currentPaymentStage !== null &&
            application?.currentPaymentStage !== undefined
        ) {

            const matchingStage =
                paymentPlan.find(
                    (stage) =>
                        String(stage?.stage) ===
                        String(
                            application.currentPaymentStage,
                        ),
                );


            if (matchingStage) {

                return matchingStage;

            }

        }


        /*
         * Fallback to the first PENDING stage.
         */

        return (
            paymentPlan.find(
                (stage) =>
                    stage?.status === "PENDING",
            ) || null
        );

    }, [
        application,
    ]);


    /* =========================================================
       PAYMENT REQUIRED
    ========================================================= */

    const paymentRequired =
        application?.paymentStatus ===
        "PAYMENT_PENDING" &&
        currentStage?.status === "PENDING" &&
        Boolean(
            currentStage?.invoiceId,
        );


    /* =========================================================
       FORMAT AMOUNT
    ========================================================= */

    const formattedAmount =
        useMemo(() => {

            const amount =
                Number(
                    currentStage?.amount,
                );


            if (!Number.isFinite(amount)) {

                return "Payment required";

            }


            const currency =
                currentStage?.currency ||
                "NGN";


            try {

                return new Intl.NumberFormat(
                    "en-NG",
                    {
                        style: "currency",
                        currency,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    },
                ).format(amount);

            } catch (error) {

                console.error(
                    "FAILED TO FORMAT PAYMENT AMOUNT:",
                    error,
                );


                return `${currency} ${amount}`;

            }

        }, [
            currentStage,
        ]);


    /* =========================================================
       HANDLE PAYMENT
    ========================================================= */

    const handlePayment = async () => {

        if (paying) {

            return;

        }


        /*
         * The invoice is required because the Finance backend
         * determines the authoritative payment amount.
         */

        if (!currentStage?.invoiceId) {

            setError(
                "No payment invoice is available for this stage.",
            );

            return;

        }


        try {

            setPaying(true);

            setError("");


            console.log(
                "INITIALIZING APPLICATION PAYMENT:",
                {
                    paymentType: "APPLICATION",
                    invoiceId:
                        currentStage.invoiceId,
                    stage:
                        currentStage.stage,
                    stageName:
                        currentStage.name,
                },
            );


            /*
             * IMPORTANT:
             *
             * payment.service.js handles:
             *
             * APPLICATION
             * + invoiceId
             *
             * The frontend does NOT send:
             *
             * - amount
             * - currency
             * - customer
             * - application amount
             *
             * Those values come from Finance.
             */

            const result =
                await paymentService.payApplication(
                    currentStage.invoiceId,
                );


            /*
             * Normally the browser has already been
             * redirected to Paystack at this point.
             *
             * This callback exists for parent-level
             * bookkeeping/logging.
             */

            if (onPaymentStarted) {

                onPaymentStarted(
                    result,
                );

            }

        } catch (error) {

            console.error(
                "APPLICATION PAYMENT INITIALIZATION FAILED:",
                error,
            );


            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to initialize payment. Please try again.",
            );


            setPaying(false);

        }

    };


    /* =========================================================
       NOTHING TO PAY
    =========================================================
    
       Do not render the payment card when:

       - there is no payment plan
       - application is not awaiting payment
       - current stage is not pending
       - current stage has no invoice

    ========================================================= */

    if (!paymentRequired) {

        return null;

    }


    /* =========================================================
       PAYMENT CARD
    ========================================================= */

    return (

        <section className="application-payment">


            {/* =================================================
                PAYMENT HEADER
            ================================================= */}

            <div className="application-payment-header">


                <div>

                    <span className="application-payment-eyebrow">
                        Payment required
                    </span>


                    <h2 className="application-payment-title">
                        Continue your application
                    </h2>


                    <p className="application-payment-description">
                        Complete this payment to unlock the next
                        stage of your migration application.
                    </p>

                </div>


                {/* =============================================
                    AMOUNT
                ============================================= */}

                <div className="application-payment-amount">

                    <span>
                        Amount due
                    </span>


                    <strong>
                        {formattedAmount}
                    </strong>

                </div>

            </div>


            {/* =================================================
                PAYMENT BODY
            ================================================= */}

            <div className="application-payment-body">


                {/* =============================================
                    CURRENT STAGE
                ============================================= */}

                <div className="application-payment-stage">

                    <span className="application-payment-stage-label">
                        Current payment stage
                    </span>


                    <strong>

                        {currentStage?.name ||
                            `Stage ${currentStage?.stage || ""
                            }`
                        }

                    </strong>

                </div>


                {/* =============================================
                    PAYMENT ACTION
                ============================================= */}

                <div className="application-payment-actions">


                    <button
                        type="button"
                        className="application-payment-button"
                        onClick={
                            handlePayment
                        }
                        disabled={
                            paying
                        }
                    >

                        {paying
                            ? "Redirecting to payment..."
                            : "Pay securely"
                        }

                    </button>


                    <p className="application-payment-secure">

                        You will be redirected to Paystack
                        to complete your payment securely.

                    </p>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="application-payment-error">

                    {error}

                </div>

            )}

        </section>

    );

};


export default ApplicationPayment;

