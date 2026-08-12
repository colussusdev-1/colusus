import Booking from "./booking.model.js";
import couponService from "../coupons/coupon.service.js";
import config from "../../config/environment.js";


/*
|--------------------------------------------------------------------------
| Create Booking
|--------------------------------------------------------------------------
*/

const createBooking = async (bookingData) => {

    /*
    |--------------------------------------------------------------------------
    | Calculate Booking Pricing
    |--------------------------------------------------------------------------
    */

    const pricing =
        await reviewBooking(
            bookingData
        );


    /*
    |--------------------------------------------------------------------------
    | Create Booking
    |--------------------------------------------------------------------------
    */

    const booking =
        await Booking.create({

            /*
            |--------------------------------------------------------------------------
            | Personal Information
            |--------------------------------------------------------------------------
            */

            fullName:
                bookingData.fullName,

            email:
                bookingData.email,

            phone:
                bookingData.phone,

            age:
                bookingData.age,

            education:
                bookingData.education,

            maritalStatus:
                bookingData.maritalStatus,


            /*
            |--------------------------------------------------------------------------
            | Travel Information
            |--------------------------------------------------------------------------
            */

            travelPackage:
                bookingData.travelPackage,

            countries:
                bookingData.countries || [],

            visaClass:
                bookingData.visaClass,

            intendedTravelDate:
                bookingData.intendedTravelDate,


            /*
            |--------------------------------------------------------------------------
            | Consultation Information
            |--------------------------------------------------------------------------
            */

            consultationDate:
                bookingData.consultationDate,

            consultationType:
                bookingData.consultationType,

            message:
                bookingData.message,


            /*
            |--------------------------------------------------------------------------
            | Coupon
            |--------------------------------------------------------------------------
            */

            couponCode:
                pricing.couponApplied
                    ? pricing.coupon
                    : null,

            couponApplied:
                pricing.couponApplied,

            discountAmount:
                pricing.discount,


            /*
            |--------------------------------------------------------------------------
            | Payment
            |--------------------------------------------------------------------------
            */

            consultationFee:
                pricing.consultationFee,

            amountPayable:
                pricing.amountPayable,

            currency:
                config.consultationCurrency,

            paymentStatus:
                pricing.paymentStatus,

            bookingStatus:
                pricing.bookingStatus,

        });


    /*
    |--------------------------------------------------------------------------
    | Return
    |--------------------------------------------------------------------------
    */

    return {
        booking,
    };

};


/*
|--------------------------------------------------------------------------
| Review Booking
|--------------------------------------------------------------------------
|
| This is the single source of truth for consultation pricing.
|
| Normal:
| ₦50,000 → UNPAID → AWAITING_PAYMENT
|
| Partial discount:
| ₦50,000 → e.g. ₦20,000 → UNPAID → AWAITING_PAYMENT
|
| Full discount:
| ₦50,000 → ₦0 → WAIVED → CONFIRMED
|
|--------------------------------------------------------------------------
*/

const reviewBooking = async (
    bookingData
) => {

    /*
    |--------------------------------------------------------------------------
    | Base Consultation Fee
    |--------------------------------------------------------------------------
    */

    const consultationFee =
        config.consultationFee;


    /*
    |--------------------------------------------------------------------------
    | Default Pricing
    |--------------------------------------------------------------------------
    */

    let discount = 0;

    let amountPayable =
        consultationFee;

    let couponApplied = false;

    let coupon = null;


    /*
    |--------------------------------------------------------------------------
    | Coupon Processing
    |--------------------------------------------------------------------------
    */

    if (
        bookingData.couponCode
    ) {

        const result =
            await couponService.validateCoupon(
                bookingData.couponCode
            );


        /*
        |--------------------------------------------------------------------------
        | Valid Coupon
        |--------------------------------------------------------------------------
        */

        if (
            result.valid &&
            result.coupon
        ) {

            couponApplied = true;

            coupon =
                result.coupon.code;


            /*
            |--------------------------------------------------------------------------
            | Coupon Type
            |--------------------------------------------------------------------------
            */

            switch (
                result.coupon.discountType
            ) {

                /*
                |--------------------------------------------------------------------------
                | FULL DISCOUNT
                |--------------------------------------------------------------------------
                */

                case "FULL":

                    discount =
                        consultationFee;

                    amountPayable =
                        0;

                    break;


                /*
                |--------------------------------------------------------------------------
                | FIXED DISCOUNT
                |--------------------------------------------------------------------------
                */

                case "FIXED":

                    discount =
                        Math.max(
                            Number(
                                result.coupon.discountValue
                            ) || 0,
                            0
                        );


                    amountPayable =
                        Math.max(
                            consultationFee -
                            discount,
                            0
                        );

                    break;


                /*
                |--------------------------------------------------------------------------
                | PERCENTAGE DISCOUNT
                |--------------------------------------------------------------------------
                */

                case "PERCENTAGE":

                    const percentage =
                        Math.min(
                            Math.max(
                                Number(
                                    result.coupon.discountValue
                                ) || 0,
                                0
                            ),
                            100
                        );


                    discount =
                        Math.round(
                            (
                                consultationFee *
                                percentage
                            ) / 100
                        );


                    amountPayable =
                        Math.max(
                            consultationFee -
                            discount,
                            0
                        );

                    break;


                /*
                |--------------------------------------------------------------------------
                | Unknown Coupon Type
                |--------------------------------------------------------------------------
                */

                default:

                    couponApplied = false;

                    coupon = null;

                    discount = 0;

                    amountPayable =
                        consultationFee;

                    break;

            }

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Normalize Final Amount
    |--------------------------------------------------------------------------
    |
    | Never allow a negative payable amount.
    |
    |--------------------------------------------------------------------------
    */

    amountPayable =
        Math.max(
            Number(amountPayable) || 0,
            0
        );


    /*
    |--------------------------------------------------------------------------
    | Determine Payment State
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | amountPayable === 0
    |     → WAIVED
    |     → CONFIRMED
    |
    | amountPayable > 0
    |     → UNPAID
    |     → AWAITING_PAYMENT
    |
    |--------------------------------------------------------------------------
    */

    const paymentRequired =
        amountPayable > 0;


    const paymentStatus =
        paymentRequired
            ? "UNPAID"
            : "WAIVED";


    const bookingStatus =
        paymentRequired
            ? "AWAITING_PAYMENT"
            : "CONFIRMED";


    /*
    |--------------------------------------------------------------------------
    | Final Pricing
    |--------------------------------------------------------------------------
    */

    const pricing = {

        consultationFee,

        discount,

        amountPayable,

        paymentRequired,

        couponApplied,

        coupon,

        paymentStatus,

        bookingStatus,

    };


    /*
    |--------------------------------------------------------------------------
    | Debug
    |--------------------------------------------------------------------------
    */

    console.log(
        "BOOKING PRICING:",
        pricing
    );


    /*
    |--------------------------------------------------------------------------
    | Return
    |--------------------------------------------------------------------------
    */

    return pricing;

};


/*
|--------------------------------------------------------------------------
| Get All Bookings
|--------------------------------------------------------------------------
*/

const getAllBookings = async () => {

    const bookings =
        await Booking.find()
            .sort({
                createdAt: -1,
            });

    return bookings;

};


/*
|--------------------------------------------------------------------------
| Get Booking By ID
|--------------------------------------------------------------------------
*/

const getBookingById = async (
    bookingId
) => {

    const booking =
        await Booking.findById(
            bookingId
        );

    return booking;

};


/*
|--------------------------------------------------------------------------
| Update Booking Status
|--------------------------------------------------------------------------
*/

const updateBookingStatus = async (
    bookingId,
    bookingStatus
) => {

    const booking =
        await Booking.findByIdAndUpdate(

            bookingId,

            {
                bookingStatus,
            },

            {
                new: true,
                runValidators: true,
            }

        );

    return booking;

};


/*
|--------------------------------------------------------------------------
| Confirm Booking
|--------------------------------------------------------------------------
*/

const confirmBooking = async (
    bookingId,
    paymentReference = null,
    paymentStatus = "PAID"
) => {

    const booking =
        await Booking.findByIdAndUpdate(

            bookingId,

            {
                paymentStatus,

                paymentReference,

                bookingStatus:
                    "CONFIRMED",
            },

            {
                new: true,
                runValidators: true,
            }

        );

    return booking;

};


/*
|--------------------------------------------------------------------------
| Cancel Booking
|--------------------------------------------------------------------------
*/

const cancelBooking = async (
    bookingId
) => {

    const booking =
        await Booking.findByIdAndUpdate(

            bookingId,

            {
                bookingStatus:
                    "CANCELLED",
            },

            {
                new: true,
                runValidators: true,
            }

        );

    return booking;

};


/*
|--------------------------------------------------------------------------
| Update Payment Status
|--------------------------------------------------------------------------
*/

const updatePaymentStatus = async (
    bookingId,
    paymentStatus,
    paymentReference = null
) => {

    const bookingStatus =
        paymentStatus === "PAID" ||
        paymentStatus === "WAIVED"

            ? "CONFIRMED"

            : "AWAITING_PAYMENT";


    const booking =
        await Booking.findByIdAndUpdate(

            bookingId,

            {
                paymentStatus,

                paymentReference,

                bookingStatus,
            },

            {
                new: true,
                runValidators: true,
            }

        );

    return booking;

};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {

    createBooking,

    reviewBooking,

    getAllBookings,

    getBookingById,

    updateBookingStatus,

    updatePaymentStatus,

    confirmBooking,

    cancelBooking,

};