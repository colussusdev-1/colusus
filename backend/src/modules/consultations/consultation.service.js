import Booking from "../bookings/booking.model.js";

/*
|--------------------------------------------------------------------------
| Get All Consultations
|--------------------------------------------------------------------------
|
| Retrieves all consultation bookings for administration.
|
|--------------------------------------------------------------------------
*/

const getAllConsultations = async () => {
  const consultations = await Booking.find().sort({
    createdAt: -1,
  });

  return consultations;
};

/*
|--------------------------------------------------------------------------
| Get Consultation By ID
|--------------------------------------------------------------------------
|
| Retrieves a single consultation booking.
|
|--------------------------------------------------------------------------
*/

const getConsultationById = async (consultationId) => {
  const consultation = await Booking.findById(consultationId);

  if (!consultation) {
    throw new Error("Consultation not found.");
  }

  return consultation;
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {
  getAllConsultations,

  getConsultationById,
};
