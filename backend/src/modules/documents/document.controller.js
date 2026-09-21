import documentService from "./document.service.js";

/*
============================================================
colossus — DOCUMENT CONTROLLER
============================================================

The controller is responsible for:

- Reading authenticated user information
- Reading request parameters/body/files
- Calling documentService
- Returning HTTP responses

Business logic remains inside document.service.js.

NOTIFICATION EVENTS ARE INTENTIONALLY NOT CREATED HERE.

Notifications will be connected later through the dedicated
colossus notification event system.
============================================================
*/

/*
============================================================
CREATE / UPLOAD DOCUMENT
============================================================

POST /api/v1/documents

Body:

application
name
type

File:

file

Returns:

{
  document,
  application,
  progress
}

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

GET /api/v1/documents

Returns every document belonging to the authenticated user.

============================================================
*/

export const getDocuments = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error("Authenticated user not found.");

      error.statusCode = 401;

      throw error;
    }

    const documents = await documentService.getUserDocuments(userId);

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

GET /api/v1/documents/application/:applicationId

Returns documents belonging to the authenticated user's
application.

============================================================
*/

export const getApplicationDocuments = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error("Authenticated user not found.");

      error.statusCode = 401;

      throw error;
    }

    const { applicationId } = req.params;

    const documents = await documentService.getApplicationDocuments(
      applicationId,

      userId,
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

GET /api/v1/documents/:id

============================================================
*/

export const getDocument = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error("Authenticated user not found.");

      error.statusCode = 401;

      throw error;
    }

    const document = await documentService.getDocumentById(
      req.params.id,

      userId,
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

PATCH /api/v1/documents/:id

Clients may update client-safe fields such as:

- name

Clients cannot change review statuses.

============================================================
*/

export const updateDocumentStatus = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error("Authenticated user not found.");

      error.statusCode = 401;

      throw error;
    }

    const document = await documentService.updateDocumentStatus(
      req.params.id,

      userId,

      req.body,
    );

    /*
    ----------------------------------------------------------
    DOCUMENT NOT FOUND
    ----------------------------------------------------------
    */

    if (!document) {
      return res.status(404).json({
        success: false,

        message: "Document not found",
      });
    }

    /*
    ----------------------------------------------------------
    SUCCESS
    ----------------------------------------------------------
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

PATCH /api/v1/admin/documents/:id/status

Body:

{
  status: "APPROVED",
  reviewNote: "Document verified successfully."
}

The service handles:

- document status
- reviewer
- review time
- review note
- application activity
- document progress
- application journey/status

Notifications are intentionally handled separately later.

============================================================
*/

export const updateDocumentStatusByStaff = async (req, res, next) => {
  try {
    const staffUserId = req.user?.id;

    if (!staffUserId) {
      const error = new Error("Authenticated staff user not found.");

      error.statusCode = 401;

      throw error;
    }

    const result = await documentService.updateDocumentStatusByStaff(
      req.params.id,

      req.body,

      staffUserId,
    );

    /*
    ----------------------------------------------------------
    SUCCESS
    ----------------------------------------------------------
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
GET APPLICATION DOCUMENTS FOR ADMIN / STAFF
============================================================

GET /api/v1/admin/applications/:applicationId/documents

============================================================
*/

export const getApplicationDocumentsForStaff = async (
  req,

  res,

  next,
) => {
  try {
    const { applicationId } = req.params;

    const documents =
      await documentService.getApplicationDocumentsForStaff(applicationId);

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

  getApplicationDocumentsForStaff,
};
