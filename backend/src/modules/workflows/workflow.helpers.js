/*
|--------------------------------------------------------------------------
| Application Notification Messages
|--------------------------------------------------------------------------
*/

export const getApplicationNotificationData = (status) => {
  switch (status) {
    case "UNDER_REVIEW":
      return {
        title: "Application Under Review",

        message: "Your application is now under review.",

        type: "APPLICATION_STATUS_CHANGED",
      };

    case "APPROVED":
      return {
        title: "Application Approved",

        message: "Your application has been approved successfully.",

        type: "APPLICATION_STATUS_CHANGED",
      };

    case "REJECTED":
      return {
        title: "Application Rejected",

        message: "Your application requires attention.",

        type: "APPLICATION_STATUS_CHANGED",
      };

    default:
      return {
        title: "Application Updated",

        message: "Your application status has been updated.",

        type: "APPLICATION_STATUS_CHANGED",
      };
  }
};

/*
|--------------------------------------------------------------------------
| Document Notification Messages
|--------------------------------------------------------------------------
*/

export const getDocumentNotificationData = (status) => {
  switch (status) {
    case "APPROVED":
      return {
        title: "Document Approved",

        message: "Your document has been approved successfully.",

        type: "DOCUMENT_APPROVED",
      };

    case "REJECTED":
      return {
        title: "Document Rejected",

        message: "Your document requires attention.",

        type: "DOCUMENT_REJECTED",
      };

    case "REUPLOAD_REQUIRED":
      return {
        title: "Document Required",

        message: "Please upload the required document again.",

        type: "DOCUMENT_REUPLOAD",
      };

    default:
      return {
        title: "Document Updated",

        message: "Your document status has changed.",

        type: "GENERAL",
      };
  }
};
