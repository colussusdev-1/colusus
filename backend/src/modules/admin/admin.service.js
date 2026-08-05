import User from "../users/user.model.js";
import Application from "../applications/application.model.js";
import Document from "../documents/document.model.js";
import workflowService from "../workflows/workflow.service.js";

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

const getDashboardStats = async () => {
  const [
    totalClients,
    newClients,
    totalApplications,
    submittedApplications,
    underReviewApplications,
    approvedApplications,
    rejectedApplications,
    totalDocuments,
    pendingDocuments,
    approvedDocuments,
    rejectedDocuments,
    recentApplications,
  ] = await Promise.all([
    User.countDocuments({
      role: "CLIENT",
    }),

    User.countDocuments({
      role: "CLIENT",
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    }),

    Application.countDocuments(),

    Application.countDocuments({
      status: "SUBMITTED",
    }),

    Application.countDocuments({
      status: "UNDER_REVIEW",
    }),

    Application.countDocuments({
      status: "APPROVED",
    }),

    Application.countDocuments({
      status: "REJECTED",
    }),

    Document.countDocuments(),

    Document.countDocuments({
      status: {
        $in: ["UPLOADED", "UNDER_REVIEW"],
      },
    }),

    Document.countDocuments({
      status: "APPROVED",
    }),

    Document.countDocuments({
      status: "REJECTED",
    }),

    Application.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(5),
  ]);

  return {
    clients: {
      total: totalClients,
      newThisMonth: newClients,
    },

    applications: {
      total: totalApplications,

      submitted: submittedApplications,

      underReview: underReviewApplications,

      approved: approvedApplications,

      rejected: rejectedApplications,
    },

    documents: {
      total: totalDocuments,

      pendingReview: pendingDocuments,

      approved: approvedDocuments,

      rejected: rejectedDocuments,
    },

    recentApplications,
  };
};

/*
|--------------------------------------------------------------------------
| Get All Applications
|--------------------------------------------------------------------------
*/

const getAllApplications = async () => {
  return await Application.find()

    .populate("user", "name email")

    .sort({
      createdAt: -1,
    });
};

/*
|--------------------------------------------------------------------------
| Get Single Application
|--------------------------------------------------------------------------
*/

const getApplicationById = async (applicationId) => {
  return await Application.findById(applicationId)

    .populate("user", "name email");
};

/*
|--------------------------------------------------------------------------
| Update Application Status
|--------------------------------------------------------------------------
*/

const updateApplicationStatus = async (applicationId, status, notes = "") => {
  const application = await Application.findById(applicationId);

  if (!application) {
    return null;
  }

  const previousStatus = application.status;

  application.status = status;

  application.notes = notes;

  await application.save();

  /*
  Only trigger workflow
  when status actually changes
  */

  if (previousStatus !== status) {
    await workflowService.handleApplicationStatusChange({
      userId: application.user,

      applicationId: application._id,

      status: application.status,
    });
  }

  return await Application.findById(application._id)

    .populate("user", "name email");
};

export default {
  getDashboardStats,

  getAllApplications,

  getApplicationById,

  updateApplicationStatus,
};
