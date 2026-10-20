import { useEffect, useState } from "react";

import api from "../../../services/api";
import paymentService from "../../../services/payment.service";

import PersonalInfo from "./PersonalInfo";
import TravelInfo from "./TravelInfo";
import ConsultationInfo from "./ConsultationInfo";
import CouponSection from "./CouponSection";

import "./BookingForm.css";

const STORAGE_KEY = "consultation-booking";

const BookingForm = ({ onFormComplete }) => {
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
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return;

        try {
            const parsed = JSON.parse(saved);

            setFormData((previous) => ({
                ...previous,
                ...parsed,
            }));
        } catch {
            localStorage.removeItem(STORAGE_KEY);
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
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));

        setFormError("");
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    | Extract API Response Data
    |--------------------------------------------------------------------------
    |
    | Supports common API response formats:
    |
    | { data: { ... } }
    | { data: { data: { ... } } }
    | { submission: { ... } }
    |
    */

    const extractResponseData = (response) => {
        let result = response?.data ?? response;

        if (
            result?.success === false ||
            result?.status === "error"
        ) {
            throw new Error(
                result.message || "The request could not be completed."
            );
        }

        if (
            result?.data &&
            typeof result.data === "object"
        ) {
            result = result.data;
        }

        return result;
    };

    /*
    |--------------------------------------------------------------------------
    | Save Consultation Request
    |--------------------------------------------------------------------------
    */

    const saveConsultationRequest = async ({
        payload,
        pricing,
    }) => {
        setLoadingStep("Saving your consultation request...");

        const response = await api.post(
            "/form-submissions",
            {
                formKey: "consultation-request",
                formName: "Consultation Request",

                submissionData: {
                    ...payload,
                    pricing,
                    paymentStatus: "PENDING",
                },

                source: "website-consultation",
            }
        );

        const result = extractResponseData(response);

        /*
         * Handle supported backend response shapes.
         */
        const submission =
            result?.submission ||
            result?.formSubmission ||
            (
                result?._id
                    ? result
                    : null
            );

        const submissionId =
            submission?._id ||
            submission?.id ||
            result?.submissionId ||
            result?.formSubmissionId ||
            null;

        if (!submissionId) {
            console.error(
                "CONSULTATION SAVE RESPONSE:",
                response?.data
            );

            throw new Error(
                "The server received a response, but did not return the saved consultation request ID. Please check your backend response."
            );
        }

        return {
            formSubmissionId: String(submissionId),

            formSubmissionStatus:
                submission?.status || "NEW",
        };
    };

    /*
    |--------------------------------------------------------------------------
    | Scroll To Error
    |--------------------------------------------------------------------------
    */

    const scrollToError = () => {
        setTimeout(() => {
            document
                .querySelector(
                    ".consultationBookingForm__error"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
        }, 100);
    };

    /*
    |--------------------------------------------------------------------------
    | Review Booking, Save Request, Continue
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        setFormError("");

        const validationError = validateForm();

        if (validationError) {
            setFormError(validationError);
            scrollToError();
            return;
        }

        try {
            setLoading(true);

            /*
            |--------------------------------------------------------------------------
            | Build Payload
            |--------------------------------------------------------------------------
            */

            const payload = {
                fullName: formData.fullName.trim(),

                email: formData.email
                    .trim()
                    .toLowerCase(),

                phone: formData.phone
                    .replace(/\s/g, "")
                    .trim(),

                age: formData.age
                    ? Number(formData.age)
                    : null,

                education: formData.education.trim(),

                maritalStatus: formData.maritalStatus,

                travelPackage: formData.travelPackage,

                countries: formData.countries
                    .split(",")
                    .map((country) => country.trim())
                    .filter(Boolean),

                visaClass: formData.visaClass,

                intendedTravelDate:
                    formData.travelDate || null,

                consultationDate:
                    formData.consultationDate,

                consultationType:
                    formData.consultationType,

                message: formData.message.trim(),

                couponCode:
                    formData.couponCode
                        .trim()
                        .toUpperCase() || null,
            };

            console.log(
                "CONSULTATION BOOKING PAYLOAD:",
                payload
            );

            /*
            |--------------------------------------------------------------------------
            | Step 1: Review Pricing
            |--------------------------------------------------------------------------
            */

            setLoadingStep(
                "Calculating consultation fee..."
            );

            const pricingResponse =
                await paymentService.reviewBooking(payload);

            console.log(
                "BOOKING PRICING RESPONSE:",
                pricingResponse
            );

            /*
             * Depending on payment.service.js, reviewBooking may return
             * either the pricing object itself or a wrapped API response.
             */
            const pricing =
                pricingResponse?.pricing ||
                pricingResponse;

            if (
                !pricing ||
                typeof pricing !== "object"
            ) {
                throw new Error(
                    "We could not calculate your consultation fee. Please try again."
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Step 2: Save Consultation Request
            |--------------------------------------------------------------------------
            |
            | Save before opening the booking summary or initiating payment.
            | This allows the admin team to receive the enquiry even if the
            | customer has not completed payment yet.
            */

            const savedSubmission =
                await saveConsultationRequest({
                    payload,
                    pricing,
                });

            console.log(
                "SAVED CONSULTATION REQUEST:",
                savedSubmission
            );

            /*
            |--------------------------------------------------------------------------
            | Step 3: Continue To Summary
            |--------------------------------------------------------------------------
            */

            const completedBooking = {
                ...payload,

                pricing,

                formSubmissionId:
                    savedSubmission.formSubmissionId,

                formSubmissionStatus:
                    savedSubmission.formSubmissionStatus,
            };

            /*
             * Preserve the draft until the parent successfully receives
             * the data. The parent can clear it after its own transition.
             */
            if (typeof onFormComplete !== "function") {
                throw new Error(
                    "The booking summary handler is not configured."
                );
            }

            onFormComplete(completedBooking);

        } catch (error) {
            console.error(
                "CONSULTATION BOOKING ERROR:",
                error
            );

            const backendMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error;

            setFormError(
                backendMessage ||
                error?.message ||
                "Unable to save your consultation request. Please try again."
            );

            scrollToError();

        } finally {
            setLoading(false);
            setLoadingStep("");
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

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
                        Complete the form below to receive a
                        personalised migration consultation
                        with our experts.
                    </p>
                </div>

                {formError && (
                    <div
                        className="consultationBookingForm__error"
                        role="alert"
                    >
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
                                    Calculated at review
                                </strong>
                            </div>

                            <button
                                type="submit"
                                className="consultationBookingForm__submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span>
                                        {loadingStep || "Reviewing..."}
                                    </span>
                                ) : (
                                    <>
                                        Review Booking

                                        <span>
                                            →
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </section>
    );
};

export default BookingForm;