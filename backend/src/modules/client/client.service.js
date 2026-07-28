import User from "../users/user.model.js";
import Application from "../applications/application.model.js";
import Document from "../documents/document.model.js";

/*
|--------------------------------------------------------------------------
| Get Client Profile
|--------------------------------------------------------------------------
*/

const getClientProfile = async (userId) => {
  const user = await User.findById(userId).select("name email role");

  return user;
};

/*
|--------------------------------------------------------------------------
| Get Client Applications
|--------------------------------------------------------------------------
*/

const getClientApplications = async (userId) => {
  const applications = await Application.find({
    user: userId,
  })

    .sort({
      createdAt: -1,
    });

  return applications;
};

/*
|--------------------------------------------------------------------------
| Get Client Documents
|--------------------------------------------------------------------------
*/

const getClientDocuments = async (userId) => {
  const documents = await Document.find({
    user: userId,
  })

    .populate(
      "application",

      "type destinationCountry status",
    )

    .sort({
      createdAt: -1,
    });

  return documents;
};

/*
|--------------------------------------------------------------------------
| Get Client Progress
|--------------------------------------------------------------------------
*/

const getClientProgress = async (userId) => {
  const applications = await Application.find({
    user: userId,
  });

  const documents = await Document.find({
    user: userId,
  });

  const totalDocuments = documents.length;

  const approvedDocuments = documents.filter(
    (doc) => doc.status === "APPROVED",
  ).length;

  const completionPercentage =
    totalDocuments === 0
      ? 0
      : Math.round((approvedDocuments / totalDocuments) * 100);

  return {
    applications,

    totalDocuments,

    approvedDocuments,

    completionPercentage,
  };
};

export default {
  getClientProfile,

  getClientApplications,

  getClientDocuments,

  getClientProgress,
};
