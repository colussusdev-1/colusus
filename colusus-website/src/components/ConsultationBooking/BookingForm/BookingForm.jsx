import { useEffect, useState } from "react";

import paymentService from "../../../services/payment.service";

import PersonalInfo from "./PersonalInfo";
import TravelInfo from "./TravelInfo";
import ConsultationInfo from "./ConsultationInfo";
import CouponSection from "./CouponSection";

import "./BookingForm.css";

const STORAGE_KEY = "consultation-booking";

const BookingForm = ({ onFormComplete }) => {

    /*
    |--------------------------------------------------------------------------
    | Form State
    |--------------------------------------------------------------------------
    */

    const [formData, setFormData] = useState({

        fullName: "",

        email: "",

        phone: "",

        age: "",

        education: "",

        maritalStatus: "",

        travelPackage: "",

        countries: "",

        visaClass: "",

        travelDate: "",

        consultationDate: "",

        consultationType: "",

        message: "",

        couponCode: "",

    });

    const [couponStatus, setCouponStatus] = useState(null);

    const [formError, setFormError] = useState("");

    const [loading, setLoading] = useState(false);

    const [loadingStep, setLoadingStep] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Restore Draft
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) return;

        try {

            setFormData(
                JSON.parse(saved)
            );

        }

        catch {

            localStorage.removeItem(
                STORAGE_KEY
            );

        }

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Auto Save Draft
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const timer = setTimeout(() => {

            localStorage.setItem(

                STORAGE_KEY,

                JSON.stringify(formData)

            );

        }, 700);

        return () => clearTimeout(timer);

    }, [formData]);

    /*
    |--------------------------------------------------------------------------
    | Update Field
    |--------------------------------------------------------------------------
    */

    const updateField = (field, value) => {

        setFormData(prev => ({

            ...prev,

            [field]: value,

        }));

    };

    /*
    |--------------------------------------------------------------------------
    | Coupon Feedback
    |--------------------------------------------------------------------------
    */

    const applyCoupon = () => {

        if (!formData.couponCode.trim()) {

            setCouponStatus({

                type: "error",

                message:
                    "Enter a coupon code or continue without one.",

            });

            return;

        }

        setCouponStatus({

            type: "success",

            message:
                "Coupon will be verified during booking review.",

        });

    };

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    const validateForm = () => {

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.fullName.trim()) {

            return "Full name is required.";

        }

        if (!emailRegex.test(formData.email.trim())) {

            return "Please enter a valid email address.";

        }

        if (!formData.phone.trim()) {

            return "Phone number is required.";

        }

        if (!formData.travelPackage) {

            return "Please select a travel package.";

        }

        if (!formData.consultationDate) {

            return "Please select a consultation date.";

        }

        if (!formData.consultationType) {

            return "Please select a consultation type.";

        }

        return null;

    };

    /*
    |--------------------------------------------------------------------------
    | Review Booking
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) return;

        setFormError("");

        const validationError = validateForm();

        if (validationError) {

            setFormError(validationError);

            setTimeout(() => {

                document
                    .querySelector(".consultationBookingForm__error")
                    ?.scrollIntoView({

                        behavior: "smooth",

                        block: "center",

                    });

            }, 100);

            return;

        }

        try {

            setLoading(true);

            /*
            |--------------------------------------------------------------------------
            | Consultation Type Mapping
            |--------------------------------------------------------------------------
            */



            /*
            |--------------------------------------------------------------------------
            | Build Payload
            |--------------------------------------------------------------------------
            */

            const payload = {

                fullName:
                    formData.fullName.trim(),

                email:
                    formData.email
                        .trim()
                        .toLowerCase(),

                phone:
                    formData.phone
                        .replace(/\s/g, "")
                        .trim(),

                age:
                    formData.age
                        ? Number(formData.age)
                        : null,

                education:
                    formData.education.trim(),

                maritalStatus:
                    formData.maritalStatus,

                travelPackage:
                    formData.travelPackage,

                countries:
                    formData.countries
                        .split(",")
                        .map(country => country.trim())
                        .filter(Boolean),

                visaClass:
                    formData.visaClass,

                intendedTravelDate:
                    formData.travelDate || null,

                consultationDate:
                    formData.consultationDate,

                consultationType:
                    formData.consultationType,

                message:
                    formData.message.trim(),

                couponCode:
                    formData.couponCode
                        .trim()
                        .toUpperCase() || null,

            };

            /*
            |--------------------------------------------------------------------------
            | Loading Experience
            |--------------------------------------------------------------------------
            */

            setLoadingStep(
                "Checking your information..."
            );

            await new Promise(resolve =>
                setTimeout(resolve, 300)
            );

            setLoadingStep(
                "Validating coupon..."
            );

            await new Promise(resolve =>
                setTimeout(resolve, 300)
            );

            setLoadingStep(
                "Calculating consultation fee..."
            );

            const pricing =
                await paymentService.reviewBooking(
                    payload
                );
            console.log("Payload:", payload);
            console.log("Consultation Type:", payload.consultationType);

            await new Promise(resolve =>
                setTimeout(resolve, 300)
            );

            setLoadingStep(
                "Preparing booking summary..."
            );

            await new Promise(resolve =>
                setTimeout(resolve, 300)
            );

            /*
            |--------------------------------------------------------------------------
            | Clear Saved Draft
            |--------------------------------------------------------------------------
            */

            localStorage.removeItem(
                STORAGE_KEY
            );

            /*
            |--------------------------------------------------------------------------
            | Continue To Booking Summary
            |--------------------------------------------------------------------------
            */

            onFormComplete({

                ...payload,

                pricing,

            });

        }

        catch (error) {

            console.error(error);

            setFormError(

                error?.response?.data?.message ||

                "Unable to review your booking. Please try again."

            );

            setTimeout(() => {

                document
                    .querySelector(".consultationBookingForm__error")
                    ?.scrollIntoView({

                        behavior: "smooth",

                        block: "center",

                    });

            }, 100);

        }

        finally {

            setLoading(false);

            setLoadingStep("");

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
                        Complete the form below to receive a personalised
                        migration consultation with our experts.
                    </p>

                </div>

                {formError && (

                    <div className="consultationBookingForm__error">

                        {formError}

                    </div>

                )}

                <form

                    className="consultationBookingForm__wrapper"

                    onSubmit={handleSubmit}

                >

                    <fieldset

                        disabled={loading}

                        className="consultationBookingForm__fieldset"

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

                        <div className="consultationBookingForm__review">

                            <div>

                                <span>

                                    Consultation Fee

                                </span>

                                <strong>

                                    ₦50,000

                                </strong>

                            </div>

                            <button

                                type="submit"

                                className="consultationBookingForm__submit"

                                disabled={loading}

                            >

                                {
                                    loading

                                        ? loadingStep || "Reviewing..."

                                        : (
                                            <>
                                                Review Booking

                                                <span>
                                                    →
                                                </span>
                                            </>
                                        )
                                }

                            </button>

                        </div>

                    </fieldset>

                </form>

            </div>

        </section>
    );

};

export default BookingForm;