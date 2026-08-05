import adminDocumentService from "./admin.document.service.js";

/*
|--------------------------------------------------------------------------
| Get All Documents
|--------------------------------------------------------------------------
*/

export const getAllDocuments = async (req, res, next) => {
  try {
    const documents = await adminDocumentService.getAllDocuments();

    res.status(200).json({
      success: true,

      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Document
|--------------------------------------------------------------------------
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

    res.status(200).json({
      success: true,

      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update Document Status
|--------------------------------------------------------------------------
*/

export const updateDocumentStatus = async (req, res, next) => {
  try {
    const {
      status,

      reviewNote,
    } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,

        message: "Document status is required",
      });
    }

    const document = await adminDocumentService.updateDocumentStatus(
      req.params.id,

      status,

      reviewNote,

      req.user.id,
    );

    if (!document) {
      return res.status(404).json({
        success: false,

        message: "Document not found",
      });
    }

    res.status(200).json({
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
| Get Documents By Status
|--------------------------------------------------------------------------
*/

export const getDocumentsByStatus = async (req, res, next) => {
  try {
    const documents = await adminDocumentService.getDocumentsByStatus(
      req.params.status,
    );

    res.status(200).json({
      success: true,

      data: documents,
    });
  } catch (error) {
    next(error);
  }
};
