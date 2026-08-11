import Application from "./application.model.js";
import Opportunity from "../opportunities/opportunity.model.js";

/*
============================================================
CREATE APPLICATION
============================================================
*/

const createApplication = async (data) => {
  /*
    --------------------------------------------------------
    Validate Opportunity
    --------------------------------------------------------
    */

  const opportunity = await Opportunity.findOne({
    _id: data.opportunity,
    active: true,
  });

  if (!opportunity) {
    const error = new Error("The selected opportunity is no longer available.");

    error.statusCode = 404;

    throw error;
  }

  /*
    --------------------------------------------------------
    Create Application
    --------------------------------------------------------
    */

  const application = await Application.create({
    user: data.user,

    opportunity: opportunity._id,

    type: data.type,

    destinationCountry: data.destinationCountry || opportunity.countryName,

    priority: data.priority || "MEDIUM",

    notes: data.notes || "",
  });

  /*
    --------------------------------------------------------
    Return Application With Opportunity
    --------------------------------------------------------
    */

  return Application.findById(application._id).populate("opportunity");
};

/*
============================================================
GET USER APPLICATIONS
============================================================
*/

const getUserApplications = async (userId) => {
  const applications = await Application.find({
    user: userId,
  })
    .populate("opportunity")
    .sort({
      createdAt: -1,
    });

  return applications;
};

/*
============================================================
GET SINGLE APPLICATION
============================================================
*/

const getApplicationById = async (id, userId) => {
  return Application.findOne({
    _id: id,

    user: userId,
  }).populate("opportunity");
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  createApplication,

  getUserApplications,

  getApplicationById,
};
