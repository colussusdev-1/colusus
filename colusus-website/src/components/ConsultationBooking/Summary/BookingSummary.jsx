import {
    HiOutlineCheckCircle,
    HiOutlineGlobeAlt,
    HiOutlineCalendar,
    HiOutlineCreditCard
} from "react-icons/hi";


import "./BookingSummary.css";





const BookingSummary = ({
    bookingData,
    onPayment
}) => {



    if(!bookingData){
        return null;
    }





    const {

        personal = {},

        travel = {},

        consultation = {},

        coupon = {}

    } = bookingData;







    const consultationFee = coupon?.code
        ? 0
        : 50000;









    const formatDate = (date)=>{


        if(!date){
            return "Not selected";
        }


        return new Date(date)
        .toLocaleDateString(
            "en-NG",
            {
                day:"numeric",
                month:"long",
                year:"numeric"
            }
        );

    };










    return (



        <section className="bookingSummary">



            <div className="container">






                <div className="bookingSummary__header">


                    <span>

                        Review Your Consultation

                    </span>




                    <h2>

                        Your Global Journey Starts Here

                    </h2>




                    <p>

                        Confirm your details before completing
                        your secure consultation booking.

                    </p>



                </div>









                <div className="bookingSummary__grid">







                    <div className="bookingSummary__details">









                        <div className="summaryBox">


                            <div className="summaryBox__title">


                                <HiOutlineCheckCircle/>


                                Personal Information


                            </div>





                            <div className="summaryRow">

                                <span>
                                    Name
                                </span>

                                <strong>
                                    {personal.fullName || "-"}
                                </strong>

                            </div>





                            <div className="summaryRow">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {personal.email || "-"}
                                </strong>

                            </div>






                            <div className="summaryRow">

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {personal.phone || "-"}
                                </strong>

                            </div>



                        </div>









                        <div className="summaryBox">


                            <div className="summaryBox__title">


                                <HiOutlineGlobeAlt/>


                                Travel Information


                            </div>







                            <div className="summaryRow">

                                <span>
                                    Destination
                                </span>


                                <strong>
                                    {
                                        travel.countries || "-"
                                    }
                                </strong>


                            </div>






                            <div className="summaryRow">

                                <span>
                                    Visa Class
                                </span>


                                <strong>
                                    {
                                        travel.visaClass || "-"
                                    }
                                </strong>


                            </div>






                            <div className="summaryRow">

                                <span>
                                    Package
                                </span>


                                <strong>
                                    {
                                        travel.package || "-"
                                    }
                                </strong>


                            </div>






                            <div className="summaryRow">

                                <span>
                                    Travel Date
                                </span>


                                <strong>
                                    {
                                        formatDate(
                                            travel.travelDate
                                        )
                                    }
                                </strong>


                            </div>





                        </div>












                        <div className="summaryBox">



                            <div className="summaryBox__title">


                                <HiOutlineCalendar/>


                                Consultation Details


                            </div>








                            <div className="summaryRow">

                                <span>
                                    Date
                                </span>


                                <strong>
                                    {
                                        formatDate(
                                            consultation.date
                                        )
                                    }
                                </strong>


                            </div>







                            <div className="summaryRow">

                                <span>
                                    Type
                                </span>


                                <strong>
                                    {
                                        consultation.type || "-"
                                    }
                                </strong>


                            </div>





                        </div>






                    </div>












                    <aside className="bookingSummary__checkout">






                        <div className="checkoutCard">





                            <div className="checkoutCard__icon">


                                <HiOutlineCreditCard/>


                            </div>







                            <h3>

                                Migration Consultation

                            </h3>







                            <p>

                                Your consultation includes:

                            </p>








                            <ul>


                                <li>

                                    <HiOutlineCheckCircle/>

                                    Personal migration assessment

                                </li>



                                <li>

                                    <HiOutlineCheckCircle/>

                                    Visa pathway recommendations

                                </li>



                                <li>

                                    <HiOutlineCheckCircle/>

                                    Application guidance

                                </li>



                                <li>

                                    <HiOutlineCheckCircle/>

                                    Document review support

                                </li>



                            </ul>









                            <div className="checkoutPrice">


                                <span>

                                    Consultation Fee

                                </span>



                                <strong>

                                    {
                                        consultationFee === 0

                                        ?

                                        "FREE"

                                        :

                                        `₦${consultationFee.toLocaleString()}`
                                    }

                                </strong>


                            </div>









                            <button

                                className="checkoutButton"

                                onClick={onPayment}

                            >

                                Continue To Secure Payment


                            </button>








                            <small>

                                Secure payment powered by Paystack

                            </small>






                        </div>






                    </aside>







                </div>






            </div>




        </section>



    );

};



export default BookingSummary;