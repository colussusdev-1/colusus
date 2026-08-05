import { useState } from "react";

import paymentService from "../../services/payment.service";

import ConsultationHero from "./Hero/ConsultationHero";
import ConsultationBenefits from "./Benefits/ConsultationBenefits";
import BookingForm from "./BookingForm/BookingForm";
import BookingSummary from "./Summary/BookingSummary";

import "./ConsultationBooking.css";

const ConsultationBooking = () => {

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [bookingData, setBookingData] = useState(null);

    const [processingPayment, setProcessingPayment] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Booking Review Completed
    |--------------------------------------------------------------------------
    */

    const handleFormComplete = (data) => {

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

    /*
    |--------------------------------------------------------------------------
    | Continue To Payment
    |--------------------------------------------------------------------------
    */

    const handlePayment = async () => {

        if (!bookingData) return;

        try {

            setProcessingPayment(true);

            await paymentService.pay(bookingData);

        }

        catch (error) {

            console.error(error);

            alert(

                error?.response?.data?.message ||

                "Unable to initialize payment."

            );

        }

        finally {

            setProcessingPayment(false);

        }

    };

    return (

        <main className="consultation-page">

            {/* Hero */}

            <ConsultationHero />

            {/* Benefits */}

            <ConsultationBenefits />

            {/* Booking Flow */}

            {

                !bookingData ? (

                    <BookingForm

                        onFormComplete={handleFormComplete}

                    />

                ) : (

                    <section id="booking-summary">

                        <BookingSummary

                            bookingData={bookingData}

                            onPayment={handlePayment}

                            loading={processingPayment}

                        />

                    </section>

                )

            }

        </main>

    );

};

export default ConsultationBooking;