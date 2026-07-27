import {
    useState
} from "react";


import ConsultationHero from "./Hero/ConsultationHero";


import ConsultationBenefits from "./Benefits/ConsultationBenefits";


import BookingForm from "./BookingForm/BookingForm";


import BookingSummary from "./Summary/BookingSummary";


import "./ConsultationBooking.css";





const ConsultationBooking = () => {



    const [
        bookingData,
        setBookingData
    ] = useState(null);








    const handleFormComplete = (
        data
    )=>{


        setBookingData(data);



        setTimeout(()=>{


            document
            .getElementById(
                "booking-summary"
            )
            ?.scrollIntoView({

                behavior:"smooth",

                block:"start"

            });


        },150);



    };









    return (



        <main className="consultation-page">






            {/* HERO */}

            <ConsultationHero />









            {/* BENEFITS */}

            <ConsultationBenefits />









            {/* BOOKING / SUMMARY */}

            {
                !bookingData ?



                (

                    <BookingForm

                        onFormComplete={
                            handleFormComplete
                        }

                    />

                )



                :



                (

                    <section

                        id="booking-summary"

                    >


                        <BookingSummary

                            bookingData={
                                bookingData
                            }


                        />


                    </section>

                )

            }








        </main>


    );


};



export default ConsultationBooking;