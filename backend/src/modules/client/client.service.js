import User from "../users/user.model.js";
import Application from "../applications/application.model.js";
import Document from "../documents/document.model.js";
import Notification from "../notifications/notification.model.js";

import { buildApplicationTimeline } from "./client.helpers.js";

/*
|--------------------------------------------------------------------------
| Get Client Profile
|--------------------------------------------------------------------------
*/

const getClientProfile = async (userId) => {
  return await User.findById(userId).select("name email role");
};

/*
|--------------------------------------------------------------------------
| Get Client Applications
|--------------------------------------------------------------------------
*/

const getClientApplications = async (userId) => {
  return await Application.find({
    user: userId,
  })

    .sort({
      createdAt: -1,
    });
};

/*
|--------------------------------------------------------------------------
| Get Client Documents
|--------------------------------------------------------------------------
*/

const getClientDocuments = async (userId) => {
  return await Document.find({
    user: userId,
  })

    .populate(
      "application",

      "type destinationCountry status",
    )

    .sort({
      createdAt: -1,
    });
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

/*
|--------------------------------------------------------------------------
| Client Dashboard
|--------------------------------------------------------------------------
*/

const getClientDashboard = async (userId) => {
  const [
    profile,

    totalApplications,

    approvedApplications,

    totalDocuments,

    approvedDocuments,

    unreadNotifications,
  ] = await Promise.all([
    User.findById(userId)

      .select("name email role"),

    Application.countDocuments({
      user: userId,
    }),

    Application.countDocuments({
      user: userId,

      status: "APPROVED",
    }),

    Document.countDocuments({
      user: userId,
    }),

    Document.countDocuments({
      user: userId,

      status: "APPROVED",
    }),

    Notification.countDocuments({
      user: userId,

      read: false,
    }),
  ]);

  return {
    profile,

    applications: {
      total: totalApplications,

      active: totalApplications - approvedApplications,

      approved: approvedApplications,
    },

    documents: {
      total: totalDocuments,

      approved: approvedDocuments,

      pending: totalDocuments - approvedDocuments,
    },

    notifications: {
      unread: unreadNotifications,
    },
  };
};

/*
|--------------------------------------------------------------------------
| Get Application Timeline
|--------------------------------------------------------------------------
*/

const getApplicationTimeline = async (
  applicationId,

  userId,
) => {
  const application = await Application.findOne({
    _id: applicationId,

    user: userId,
  });

  if (!application) {
    return null;
  }

  return {
    application,

    timeline: buildApplicationTimeline(application.status),
  };
};

/*
|--------------------------------------------------------------------------
| Get Client Document Overview
|--------------------------------------------------------------------------
*/

const getClientDocumentOverview = async (userId) => {
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

  const total = documents.length;

  const approved = documents.filter(
    (document) => document.status === "APPROVED",
  ).length;

  const pending = documents.filter(
    (document) =>
      document.status === "UPLOADED" || document.status === "UNDER_REVIEW",
  ).length;

  const reupload = documents.filter(
    (document) => document.status === "REUPLOAD_REQUIRED",
  ).length;

  const formattedDocuments = documents.map((document) => ({
    _id: document._id,

    name: document.name,

    type: document.type,

    status: document.status,

    statusLabel:
      document.status === "APPROVED"
        ? "Approved"
        : document.status === "UNDER_REVIEW"
          ? "Under Review"
          : document.status === "UPLOADED"
            ? "Pending Review"
            : document.status === "REUPLOAD_REQUIRED"
              ? "Re-upload Required"
              : document.status,

    reviewNote: document.reviewNote,

    application: document.application,

    createdAt: document.createdAt,
  }));

  return {
    summary: {
      total,

      approved,

      pending,

      reupload,
    },

    documents: formattedDocuments,
  };
};

/*
|--------------------------------------------------------------------------
| Get Notification Unread Count
|--------------------------------------------------------------------------
*/

const getNotificationUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({
    user: userId,

    read: false,
  });

  return {
    count,
  };
};

/*
|--------------------------------------------------------------------------
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

const markAllNotificationsAsRead = async (userId) => {
  await Notification.updateMany(
    {
      user: userId,

      read: false,
    },

    {
      read: true,
    },
  );

  return true;
};

/*
|--------------------------------------------------------------------------
| Get Notification Summary
|--------------------------------------------------------------------------
*/

const getNotificationSummary = async (userId) => {
  const [total, unread, latest] = await Promise.all([
    Notification.countDocuments({
      user: userId,
    }),

    Notification.countDocuments({
      user: userId,

      read: false,
    }),

    Notification.find({
      user: userId,
    })

      .sort({
        createdAt: -1,
      })

      .limit(5),
  ]);

  return {
    total,

    unread,

    latest,
  };
};

/*
|--------------------------------------------------------------------------
| Get Client Activity Feed
|--------------------------------------------------------------------------
*/

const getClientActivityFeed = async (userId) => {
  const [applications, documents, notifications] = await Promise.all([
    Application.find({
      user: userId,
    })

      .sort({
        createdAt: -1,
      })

      .limit(10),

    Document.find({
      user: userId,
    })

      .sort({
        createdAt: -1,
      })

      .limit(10),

    Notification.find({
      user: userId,
    })

      .sort({
        createdAt: -1,
      })

      .limit(10),
  ]);

  const applicationActivities = applications.map((application) => ({
    type: "APPLICATION",

    title: "Application Update",

    message: `Your ${application.type.replace("_", " ")} application is ${application.status.toLowerCase()}.`,

    date: application.createdAt,

    metadata: {
      applicationId: application._id,

      status: application.status,
    },
  }));

  const documentActivities = documents.map((document) => ({
    type: "DOCUMENT",

    title: "Document Update",

    message: `Your ${document.name || "document"} status is ${document.status.toLowerCase()}.`,

    date: document.createdAt,

    metadata: {
      documentId: document._id,

      status: document.status,
    },
  }));

  const notificationActivities = notifications.map((notification) => ({
    type: "NOTIFICATION",

    title: notification.title,

    message: notification.message,

    date: notification.createdAt,

    metadata: notification.metadata,
  }));

  const activities = [
    ...applicationActivities,

    ...documentActivities,

    ...notificationActivities,
  ];

  activities.sort((a, b) => new Date(b.date) - new Date(a.date));

  return activities.slice(0, 20);
};

export default {
  getClientProfile,

  getClientApplications,

  getClientDocuments,

  getClientDocumentOverview,

  getClientProgress,

  getClientDashboard,

  getApplicationTimeline,

  getNotificationUnreadCount,

  markAllNotificationsAsRead,

  getNotificationSummary,
  getClientActivityFeed,
};