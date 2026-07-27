import {
    useState
} from "react";


import PersonalInfo from "./PersonalInfo";
import TravelInfo from "./TravelInfo";
import ConsultationInfo from "./ConsultationInfo";
import CouponSection from "./CouponSection";


import "./BookingForm.css";





const BookingForm = ({
    onFormComplete
}) => {





    const [formData,setFormData] = useState({


        fullName:"",
        email:"",
        phone:"",

        age:"",
        education:"",

        maritalStatus:"",


        travelPackage:"",

        countries:"",

        visaClass:"",


        travelDate:"",


        consultationDate:"",

        consultationType:"",


        message:"",


        couponCode:""


    });







    const [
        couponStatus,
        setCouponStatus
    ] = useState(null);




    const [
        formError,
        setFormError
    ] = useState("");










    const updateField = (
        field,
        value
    )=>{


        setFormData(prev=>({


            ...prev,


            [field]:value


        }));


    };









    const applyCoupon = ()=>{


        if(
            formData.couponCode.trim()
        ){


            setCouponStatus({

                type:"success",

                message:
                "Coupon added. It will be verified during checkout."

            });


        }
        else{


            setCouponStatus({

                type:"error",

                message:
                "Please enter a coupon code."

            });


        }


    };









    const handleSubmit = (e)=>{


        e.preventDefault();


        setFormError("");





        if(
            !formData.fullName ||
            !formData.email ||
            !formData.phone
        ){


            setFormError(
                "Please complete your personal information before continuing."
            );


            return;


        }









        const bookingData = {




            personal:{


                fullName:
                formData.fullName,


                email:
                formData.email,


                phone:
                formData.phone,


                age:
                formData.age,


                education:
                formData.education,


                maritalStatus:
                formData.maritalStatus


            },









            travel:{


                package:
                formData.travelPackage,


                countries:
                formData.countries,


                visaClass:
                formData.visaClass,


                travelDate:
                formData.travelDate


            },









            consultation:{


                date:
                formData.consultationDate,


                type:
                formData.consultationType,


                message:
                formData.message


            },









            coupon:{


                code:
                formData.couponCode || null


            },









            payment:{


                amount:
                50000,


                currency:
                "NGN",


                status:
                "pending"


            }



        };









        console.log(
            "CONSULTATION BOOKING",
            bookingData
        );








        if(onFormComplete){


            onFormComplete(
                bookingData
            );


        }



    };









    return (



        <section

            id="consultation-form"

            className="consultationBookingForm"

        >



            <div className="container">







                <div className="consultationBookingForm__header">



                    <span>

                        Request Consultation

                    </span>







                    <h2>

                        Start Your Global Journey Today

                    </h2>







                    <p>

                        Submit your details and let our
                        migration experts create your pathway.

                    </p>





                </div>













                {
                    formError && (


                        <div className="consultationBookingForm__error">

                            {formError}

                        </div>


                    )
                }













                <form


                    className="consultationBookingForm__wrapper"


                    onSubmit={handleSubmit}


                >









                    <PersonalInfo

                        formData={formData}

                        updateField={updateField}

                    />











                    <TravelInfo

                        formData={formData}

                        updateField={updateField}

                    />











                    <ConsultationInfo

                        formData={formData}

                        updateField={updateField}

                    />











                    <CouponSection


                        formData={formData}


                        updateField={updateField}


                        couponStatus={couponStatus}


                        onApplyCoupon={applyCoupon}


                    />












                    <button


                        type="submit"


                        className="consultationBookingForm__submit"


                    >


                        Review Booking

                        <span>
                            →
                        </span>


                    </button>







                </form>







            </div>



        </section>


    );

};




export default BookingForm;