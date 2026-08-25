import documentService from "./document.service.js";

/*
============================================================
CREATE / UPLOAD DOCUMENT
============================================================
|
| POST /api/v1/documents
|
| The upload service now returns:
|
| {
|   document,
|   application,
|   progress
| }
|
| This allows the client portal to immediately update:
|
| - document list
| - document progress
| - application status
| - journey step
| - application activity
|
============================================================
*/

export const createDocument = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------
    VALIDATE AUTHENTICATED USER
    ----------------------------------------------------------
    */

    const userId = req.user?.id;

    if (!userId) {
      const error = new Error("Authenticated user not found.");

      error.statusCode = 401;

      throw error;
    }

    /*
    ----------------------------------------------------------
    CREATE DOCUMENT
    ----------------------------------------------------------
    */

    const result = await documentService.createDocument({
      userId,

      applicationId: req.body?.application,

      name: req.body?.name,

      type: req.body?.type,

      file: req.file,
    });

    /*
    ----------------------------------------------------------
    SUCCESS
    ----------------------------------------------------------
    */

    return res.status(201).json({
      success: true,

      message: "Document uploaded successfully",

      data: {
        document: result.document,

        application: result.application,

        progress: result.progress,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET ALL CLIENT DOCUMENTS
============================================================
|
| GET /api/v1/documents
|
| Returns every document belonging to the
| authenticated client.
|
============================================================
*/

export const getDocuments = async (req, res, next) => {
  try {
    const documents = await documentService.getUserDocuments(req.user.id);

    return res.status(200).json({
      success: true,

      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET APPLICATION DOCUMENTS
============================================================
|
| GET /api/v1/documents/application/:applicationId
|
| Returns documents belonging to one application.
|
============================================================
*/

export const getApplicationDocuments = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const documents = await documentService.getApplicationDocuments(
      applicationId,

      req.user.id,
    );

    return res.status(200).json({
      success: true,

      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET SINGLE DOCUMENT
============================================================
|
| GET /api/v1/documents/:id
|
| Used by the client document viewer.
|
============================================================
*/

export const getDocument = async (req, res, next) => {
  try {
    const document = await documentService.getDocumentById(
      req.params.id,

      req.user.id,
    );

    return res.status(200).json({
      success: true,

      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
UPDATE CLIENT DOCUMENT
============================================================
|
| PATCH /api/v1/documents/:id
|
| IMPORTANT:
|
| The client cannot manipulate review statuses.
|
| The service only permits client-safe updates such as
| changing the document name.
|
| Review statuses are controlled by the staff workflow.
|
============================================================
*/

export const updateDocumentStatus = async (req, res, next) => {
  try {
    const document = await documentService.updateDocumentStatus(
      req.params.id,

      req.user.id,

      req.body,
    );

    /*
      --------------------------------------------------------
      DOCUMENT NOT FOUND
      --------------------------------------------------------
      */

    if (!document) {
      return res.status(404).json({
        success: false,

        message: "Document not found",
      });
    }

    /*
      --------------------------------------------------------
      SUCCESS
      --------------------------------------------------------
      */

    return res.status(200).json({
      success: true,

      message: "Document updated successfully",

      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
STAFF DOCUMENT REVIEW
============================================================
|
| This controller is ready for the admin/staff route.
|
| It uses the service method that:
|
| - updates document status
| - records reviewer
| - records review time
| - records review note
| - creates application activity
| - recalculates document progress
| - updates application journey/status
|
| Example body:
|
| {
|   status: "APPROVED",
|   reviewNote: "Document verified successfully."
| }
|
============================================================
*/

export const updateDocumentStatusByStaff = async (req, res, next) => {
  try {
    const result = await documentService.updateDocumentStatusByStaff(
      req.params.id,

      req.body,

      req.user?.id,
    );

    /*
      --------------------------------------------------------
      SUCCESS
      --------------------------------------------------------
      */

    return res.status(200).json({
      success: true,

      message: "Document review updated successfully",

      data: {
        document: result.document,

        application: result.application,

        progress: result.progress,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  createDocument,

  getDocuments,

  getApplicationDocuments,

  getDocument,

  updateDocumentStatus,

  updateDocumentStatusByStaff,
};
