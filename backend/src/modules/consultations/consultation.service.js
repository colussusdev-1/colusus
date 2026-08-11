import Booking from "../bookings/booking.model.js";

/*
|--------------------------------------------------------------------------
| Get All Consultations
|--------------------------------------------------------------------------
*/

const getAllConsultations = async () => {
  const consultations = await Booking.find({}).sort({ createdAt: -1 });

  return consultations;
};

/*
|--------------------------------------------------------------------------
| Get Consultation By ID
|--------------------------------------------------------------------------
*/

const getConsultationById = async (consultationId) => {
  const consultation = await Booking.findById(consultationId);

  if (!consultation) {
    throw new Error("Consultation not found.");
  }

  return consultation;
};

export default {
  getAllConsultations,
  getConsultationById,
};
