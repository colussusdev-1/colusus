import consultationService from "./consultation.service.js";

/*
|--------------------------------------------------------------------------
| Get All Consultations
|--------------------------------------------------------------------------
*/

const getAllConsultations = async (req, res) => {
  try {
    const consultations = await consultationService.getAllConsultations();

    res.status(200).json({
      success: true,

      count: consultations.length,

      data: consultations,
    });
  } catch (error) {
    console.error("Get consultations error:", error);

    res.status(500).json({
      success: false,

      message: "Unable to retrieve consultations.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Consultation By ID
|--------------------------------------------------------------------------
*/

const getConsultationById = async (req, res) => {
  try {
    const consultation = await consultationService.getConsultationById(
      req.params.id,
    );

    res.status(200).json({
      success: true,

      data: consultation,
    });
  } catch (error) {
    console.error("Get consultation error:", error);

    res.status(404).json({
      success: false,

      message: error.message || "Consultation not found.",
    });
  }
};

export default {
  getAllConsultations,
  getConsultationById,
};
