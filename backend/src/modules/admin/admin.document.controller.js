import adminDocumentService from "./admin.document.service.js";

/*
|--------------------------------------------------------------------------
| GET ALL DOCUMENTS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents
|
*/

export const getAllDocuments = async (req, res, next) => {
  try {
    const documents = await adminDocumentService.getAllDocuments();

    return res.status(200).json({
      success: true,

      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET DOCUMENTS FOR APPLICATION
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/application/:applicationId
|
| Used by:
|
| Admin Application Details
| → Documents tab
|
*/

export const getApplicationDocuments = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({
        success: false,

        message: "Application ID is required",
      });
    }

    const documents =
      await adminDocumentService.getApplicationDocuments(applicationId);

    return res.status(200).json({
      success: true,

      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE DOCUMENT
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/:id
|
*/

export const getDocumentById = async (req, res, next) => {
  try {
    const document = await adminDocumentService.getDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,

        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,

      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| VIEW DOCUMENT
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/:id/view
|
| Used by:
|
| Admin Documents
| → Preview / View Document
|
| The backend retrieves the Cloudinary raw file and streams it
| through the authenticated admin endpoint.
|
*/

export const viewDocument = async (req, res, next) => {
  try {
    const result = await adminDocumentService.getDocumentStream(req.params.id);

    if (!result?.stream) {
      const error = new Error("Document stream is unavailable.");

      error.statusCode = 404;

      throw error;
    }

    const fileName =
      result.document?.originalFileName ||
      result.document?.name ||
      result.document?.documentName ||
      "document";

    const safeFileName = String(fileName).replace(/"/g, "");

    res.setHeader(
      "Content-Type",
      result.contentType || "application/octet-stream",
    );

    res.setHeader("Content-Disposition", `inline; filename="${safeFileName}"`);

    if (result.contentLength) {
      res.setHeader("Content-Length", result.contentLength);
    }

    result.stream.on("error", (error) => {
      if (res.headersSent) {
        res.destroy(error);
        return;
      }

      next(error);
    });

    result.stream.pipe(res);
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE DOCUMENT STATUS
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/documents/:id/status
|
*/

export const updateDocumentStatus = async (req, res, next) => {
  try {
    const { status, reviewNote } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,

        message: "Document status is required",
      });
    }

    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,

        message: "Authenticated administrator not found",
      });
    }

    const document = await adminDocumentService.updateDocumentStatus(
      req.params.id,

      status,

      reviewNote,

      adminId,
    );

    if (!document) {
      return res.status(404).json({
        success: false,

        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Document status updated successfully",

      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET DOCUMENTS BY STATUS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/status/:status
|
*/

export const getDocumentsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;

    if (!status) {
      return res.status(400).json({
        success: false,

        message: "Document status is required",
      });
    }

    const documents = await adminDocumentService.getDocumentsByStatus(status);

    return res.status(200).json({
      success: true,

      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getAllDocuments,

  getApplicationDocuments,

  getDocumentById,

  viewDocument,

  updateDocumentStatus,

  getDocumentsByStatus,
};
