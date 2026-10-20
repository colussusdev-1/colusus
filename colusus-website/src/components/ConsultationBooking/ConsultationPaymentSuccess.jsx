import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineArrowRight,
    HiOutlineShieldCheck,
    HiOutlineExclamationCircle,
    HiOutlineRefresh,
} from "react-icons/hi";

import api from "../../services/api";

import "./ConsultationPaymentSuccess.css";

export default function ConsultationPaymentSuccess() {
    const [searchParams] = useSearchParams();

    const reference =
        searchParams.get("reference") ||
        searchParams.get("trxref") ||
        "";

    const [state, setState] = useState({
        loading: true,
        verified: false,
        payment: null,
        error: "",
    });

    const verifyPayment = async () => {
        if (!reference) {
            setState({
                loading: false,
                verified: false,
                payment: null,
                error:
                    "We couldn't find a payment reference. Please check your payment confirmation or contact our support team.",
            });

            return;
        }

        setState((previous) => ({
            ...previous,
            loading: true,
            error: "",
        }));

        try {
            const response = await api.get(
                `/payments/verify-consultation/${encodeURIComponent(reference)}`
            );

            const responseData = response?.data || {};

            const result =
                responseData.data || responseData;

            const verified =
                result.verified === true ||
                result.status === "SUCCESS" ||
                result.payment?.status === "SUCCESS";

            setState({
                loading: false,
                verified,
                payment: result.payment || result,
                error: verified
                    ? ""
                    : "Your payment has not been confirmed yet. Please try verifying again.",
            });
        } catch (error) {
            console.error(
                "Consultation payment verification failed:",
                error
            );

            setState({
                loading: false,
                verified: false,
                payment: null,
                error:
                    error?.response?.data?.message ||
                    "We couldn't verify your payment right now. Your transaction may still be processing.",
            });
        }
    };

    useEffect(() => {
        verifyPayment();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reference]);

    const formatAmount = (amount, currency = "NGN") => {
        if (amount === undefined || amount === null) {
            return "—";
        }

        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(Number(amount));
    };

    const payment = state.payment;

    return (
        <main className="consultation-payment-page">
            <div className="consultation-payment-background">
                <span className="consultation-payment-orb consultation-payment-orb--one" />
                <span className="consultation-payment-orb consultation-payment-orb--two" />
            </div>

            <div className="consultation-payment-container">
                <Link
                    to="/"
                    className="consultation-payment-brand"
                >
                    <span className="consultation-payment-brand-mark">
                        C
                    </span>

                    <span>
                        COLOSSUS
                        <small>MIGRATION & TOURS</small>
                    </span>
                </Link>

                {state.loading ? (
                    <section className="consultation-payment-card">
                        <div className="consultation-payment-loader">
                            <span />
                        </div>

                        <span className="consultation-payment-eyebrow">
                            SECURE PAYMENT VERIFICATION
                        </span>

                        <h1>
                            Confirming your payment
                        </h1>

                        <p className="consultation-payment-description">
                            Please wait while we confirm your transaction
                            with our payment provider. This should only
                            take a moment.
                        </p>

                        <div className="consultation-payment-reference">
                            <span>Payment reference</span>
                            <strong>{reference || "Not available"}</strong>
                        </div>

                        <div className="consultation-payment-security">
                            <HiOutlineShieldCheck />

                            <span>
                                Your transaction is being checked securely.
                            </span>
                        </div>
                    </section>
                ) : state.verified ? (
                    <>
                        <section className="consultation-payment-card">
                            <div className="consultation-payment-success-icon">
                                <HiOutlineCheckCircle />
                            </div>

                            <span className="consultation-payment-eyebrow">
                                PAYMENT CONFIRMED
                            </span>

                            <h1>
                                You're one step closer to your journey.
                            </h1>

                            <p className="consultation-payment-description">
                                Your consultation payment has been
                                successfully verified. Thank you for
                                choosing Colossus Migration & Tours.
                            </p>

                            <div className="consultation-payment-amount">
                                <span>Amount paid</span>

                                <strong>
                                    {formatAmount(
                                        payment?.amount,
                                        payment?.currency || "NGN"
                                    )}
                                </strong>

                                <span className="consultation-payment-paid-badge">
                                    <HiOutlineCheckCircle />
                                    Payment successful
                                </span>
                            </div>

                            <div className="consultation-payment-reference">
                                <span>Transaction reference</span>

                                <strong>
                                    {payment?.reference || reference}
                                </strong>
                            </div>

                            <div className="consultation-payment-next">
                                <h2>
                                    What happens next?
                                </h2>

                                <div className="consultation-payment-step">
                                    <span className="consultation-payment-step-icon">
                                        <HiOutlineCheckCircle />
                                    </span>

                                    <div>
                                        <strong>
                                            1. Payment confirmed
                                        </strong>

                                        <p>
                                            Your payment has been verified
                                            and recorded.
                                        </p>
                                    </div>
                                </div>

                                <div className="consultation-payment-step">
                                    <span className="consultation-payment-step-icon">
                                        <HiOutlineClock />
                                    </span>

                                    <div>
                                        <strong>
                                            2. Consultation review
                                        </strong>

                                        <p>
                                            Our team will review your
                                            consultation request and the
                                            information you provided.
                                        </p>
                                    </div>
                                </div>

                                <div className="consultation-payment-step">
                                    <span className="consultation-payment-step-icon">
                                        <HiOutlinePhone />
                                    </span>

                                    <div>
                                        <strong>
                                            3. Our team contacts you
                                        </strong>

                                        <p>
                                            We'll contact you using the
                                            phone number or email address
                                            you provided to discuss the
                                            next steps.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="consultation-payment-notice">
                                <HiOutlineMail />

                                <p>
                                    Keep an eye on your email and phone
                                    for updates from our team.
                                </p>
                            </div>

                            <Link
                                to="/"
                                className="consultation-payment-primary-button"
                            >
                                <span>
                                    Return to homepage
                                </span>

                                <HiOutlineArrowRight />
                            </Link>

                            <p className="consultation-payment-footer-note">
                                Need help? Contact our team if you have
                                questions about your consultation.
                            </p>
                        </section>
                    </>
                ) : (
                    <section className="consultation-payment-card">
                        <div className="consultation-payment-error-icon">
                            <HiOutlineExclamationCircle />
                        </div>

                        <span className="consultation-payment-eyebrow">
                            VERIFICATION PENDING
                        </span>

                        <h1>
                            We haven't confirmed your payment yet.
                        </h1>

                        <p className="consultation-payment-description">
                            {state.error}
                        </p>

                        <div className="consultation-payment-reference">
                            <span>Payment reference</span>

                            <strong>
                                {reference || "Not available"}
                            </strong>
                        </div>

                        <div className="consultation-payment-warning">
                            If you have already been charged, please
                            don't immediately make another payment.
                            Verify this transaction again or contact
                            our team for assistance.
                        </div>

                        <button
                            type="button"
                            className="consultation-payment-primary-button"
                            onClick={verifyPayment}
                            disabled={state.loading}
                        >
                            <HiOutlineRefresh />

                            <span>
                                Try verification again
                            </span>
                        </button>

                        <Link
                            to="/contact"
                            className="consultation-payment-secondary-link"
                        >
                            Contact support
                        </Link>
                    </section>
                )}

                <footer className="consultation-payment-bottom">
                    <span>
                        COLOSSUS MIGRATION & TOURS
                    </span>

                    <span>
                        Your journey. Your future. Our guidance.
                    </span>
                </footer>
            </div>
        </main>
    );
}