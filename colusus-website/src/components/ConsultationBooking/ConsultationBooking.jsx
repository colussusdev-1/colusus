import { useState } from "react";

import paymentService from "../../services/payment.service";

import ConsultationHero from "./Hero/ConsultationHero";
import ConsultationBenefits from "./Benefits/ConsultationBenefits";
import BookingForm from "./BookingForm/BookingForm";
import BookingSummary from "./Summary/BookingSummary";

import "./ConsultationBooking.css";

const ConsultationBooking = () => {
    /* -------------------------------------------------------------------------- */
    /* STATE                                                                      */
    /* -------------------------------------------------------------------------- */

    const [bookingData, setBookingData] = useState(null);

    const [processingPayment, setProcessingPayment] = useState(false);

    const [paymentError, setPaymentError] = useState("");

    /* -------------------------------------------------------------------------- */
    /* BOOKING REVIEW COMPLETED                                                   */
    /* -------------------------------------------------------------------------- */

    const handleFormComplete = (data) => {
        if (!data) {
            setPaymentError("Your booking information could not be loaded.");
            return;
        }

        setPaymentError("");

        /*
         * Preserve all booking information, including:
         *
         * - Applicant details
         * - Consultation details
         * - Pricing
         * - Saved formSubmissionId
         *
         * The submission ID will be available to the payment flow.
         */

        setBookingData(data);

        setTimeout(() => {
            document
                .getElementById("booking-summary")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        }, 200);
    };

    /* -------------------------------------------------------------------------- */
    /* CONTINUE TO PAYMENT                                                        */
    /* -------------------------------------------------------------------------- */

    const handlePayment = async () => {
        if (!bookingData || processingPayment) {
            return;
        }

        setPaymentError("");

        /*
         * Prevent payment from proceeding without the saved consultation
         * submission. This ensures the request can be traced in Admin.
         */

        if (!bookingData.formSubmissionId) {
            setPaymentError(
                "Your consultation request has not been saved correctly. Please review your booking again.",
            );

            return;
        }

        try {
            setProcessingPayment(true);

            console.log("CONSULTATION PAYMENT REQUEST:", {
                formSubmissionId: bookingData.formSubmissionId,
                consultationType: bookingData.consultationType,
                consultationDate: bookingData.consultationDate,
                pricing: bookingData.pricing,
            });

            /*
             * The payment service remains responsible for:
             *
             * 1. Creating or retrieving the appropriate invoice.
             * 2. Initializing the Paystack transaction.
             * 3. Returning the Paystack authorization URL.
             * 4. Redirecting the visitor to Paystack.
             *
             * Do not create a payment directly from this component.
             */

            await paymentService.pay(bookingData);
        } catch (error) {
            console.error(
                "CONSULTATION PAYMENT INITIALIZATION ERROR:",
                error,
            );

            setPaymentError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to initialize your consultation payment. Please try again.",
            );
        } finally {
            setProcessingPayment(false);
        }
    };

    /* -------------------------------------------------------------------------- */
    /* RENDER                                                                     */
    /* -------------------------------------------------------------------------- */

    return (
        <main className="consultation-page">
            {/* HERO */}
            <ConsultationHero />

            {/* BENEFITS */}
            <ConsultationBenefits />

            {/* BOOKING FLOW */}
            {!bookingData ? (
                <BookingForm
                    onFormComplete={handleFormComplete}
                />
            ) : (
                <section
                    id="booking-summary"
                    className="consultation-page__summary"
                >
                    {paymentError && (
                        <div
                            className="consultation-page__payment-error"
                            role="alert"
                        >
                            <p>{paymentError}</p>
                        </div>
                    )}

                    <BookingSummary
                        bookingData={bookingData}
                        onPayment={handlePayment}
                        loading={processingPayment}
                    />
                </section>
            )}
        </main>
    );
};

export default ConsultationBooking;