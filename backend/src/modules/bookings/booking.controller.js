import bookingService from "./booking.service.js";

/*
|--------------------------------------------------------------------------
| Review Booking
|--------------------------------------------------------------------------
*/

export const reviewBooking = async (req, res, next) => {
  try {
    const review = await bookingService.reviewBooking(req.body);

    res.status(200).json({
      success: true,
      message: "Booking reviewed successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Create Booking
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Create Booking
|--------------------------------------------------------------------------
*/

export const createBooking = async (req, res, next) => {
  try {
    console.log("=================================");
    console.log("CREATE BOOKING REQUEST");
    console.log("=================================");
    console.log(req.body);

    const booking = await bookingService.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: booking,
    });
  } catch (error) {
    console.error("=================================");
    console.error("CREATE BOOKING ERROR");
    console.error("=================================");
    console.error(error);
    console.error(error.stack);

    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get All Bookings
|--------------------------------------------------------------------------
*/

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Booking By ID
|--------------------------------------------------------------------------
*/

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update Booking Status
|--------------------------------------------------------------------------
*/

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus } = req.body;

    if (!bookingStatus) {
      return res.status(400).json({
        success: false,
        message: "Booking status is required",
      });
    }

    const booking = await bookingService.updateBookingStatus(
      req.params.id,
      bookingStatus,
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update Payment Status
|--------------------------------------------------------------------------
*/

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentReference } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    const booking = await bookingService.updatePaymentStatus(
      req.params.id,
      paymentStatus,
      paymentReference,
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
