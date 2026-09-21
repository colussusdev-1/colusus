/*
|--------------------------------------------------------------------------
| APPLICATION NOTIFICATION MESSAGES
|--------------------------------------------------------------------------
*/

export const getApplicationNotificationData = (
  status,
) => {
  switch (
    String(status || "")
      .trim()
      .toUpperCase()
  ) {
    /*
    |--------------------------------------------------------------------------
    | UNDER REVIEW
    |--------------------------------------------------------------------------
    */

    case "UNDER_REVIEW":
      return {
        title:
          "Application Under Review",

        message:
          "Your application is now under review.",

        type:
          "APPLICATION_STATUS_CHANGED",
      };


    /*
    |--------------------------------------------------------------------------
    | APPROVED
    |--------------------------------------------------------------------------
    */

    case "APPROVED":
      return {
        title:
          "Application Approved",

        message:
          "Your application has been approved successfully.",

        type:
          "APPLICATION_APPROVED",
      };


    /*
    |--------------------------------------------------------------------------
    | REJECTED
    |--------------------------------------------------------------------------
    */

    case "REJECTED":
      return {
        title:
          "Application Rejected",

        message:
          "Your application requires attention.",

        type:
          "APPLICATION_REJECTED",
      };


    /*
    |--------------------------------------------------------------------------
    | SUBMITTED
    |--------------------------------------------------------------------------
    */

    case "SUBMITTED":
      return {
        title:
          "Application Submitted",

        message:
          "Your application has been submitted successfully.",

        type:
          "APPLICATION_SUBMITTED",
      };


    /*
    |--------------------------------------------------------------------------
    | DEFAULT
    |--------------------------------------------------------------------------
    */

    default:
      return {
        title:
          "Application Updated",

        message:
          "Your application status has been updated.",

        type:
          "APPLICATION_UPDATED",
      };
  }
};


/*
|--------------------------------------------------------------------------
| DOCUMENT NOTIFICATION MESSAGES
|--------------------------------------------------------------------------
*/

export const getDocumentNotificationData = (
  status,
) => {
  switch (
    String(status || "")
      .trim()
      .toUpperCase()
  ) {
    /*
    |--------------------------------------------------------------------------
    | APPROVED
    |--------------------------------------------------------------------------
    */

    case "APPROVED":
      return {
        title:
          "Document Approved",

        message:
          "Your document has been approved successfully.",

        type:
          "DOCUMENT_APPROVED",
      };


    /*
    |--------------------------------------------------------------------------
    | REJECTED
    |--------------------------------------------------------------------------
    */

    case "REJECTED":
      return {
        title:
          "Document Rejected",

        message:
          "Your document requires attention.",

        type:
          "DOCUMENT_REJECTED",
      };


    /*
    |--------------------------------------------------------------------------
    | REUPLOAD REQUIRED
    |--------------------------------------------------------------------------
    */

    case "REUPLOAD_REQUIRED":
      return {
        title:
          "Document Re-upload Required",

        message:
          "Please upload the required document again.",

        type:
          "DOCUMENT_REUPLOAD_REQUIRED",
      };


    /*
    |--------------------------------------------------------------------------
    | UNDER REVIEW
    |--------------------------------------------------------------------------
    */

    case "UNDER_REVIEW":
      return {
        title:
          "Document Under Review",

        message:
          "Your document is now being reviewed by the colossus team.",

        type:
          "DOCUMENT_UPDATED",
      };


    /*
    |--------------------------------------------------------------------------
    | DEFAULT
    |--------------------------------------------------------------------------
    */

    default:
      return {
        title:
          "Document Updated",

        message:
          "Your document status has changed.",

        type:
          "DOCUMENT_UPDATED",
      };
  }
};