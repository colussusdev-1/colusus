import documentService from "./document.service.js";

/*
============================================================
CREATE / UPLOAD DOCUMENT
============================================================
*/

export const createDocument = async (req, res, next) => {
  try {
    console.log("=================================");
    console.log("DOCUMENT UPLOAD");
    console.log("=================================");

    console.log("BODY:", req.body);

    console.log(
      "FILE:",
      req.file
        ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : null,
    );

    console.log("USER:", req.user?.id);

    console.log("=================================");

    const document = await documentService.createDocument({
      user: req.user.id,

      application: req.body.application,

      name: req.body.name,

      type: req.body.type,
    });

    res.status(201).json({
      success: true,

      message: "Document created successfully",

      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET ALL CLIENT DOCUMENTS
============================================================
*/

export const getDocuments = async (req, res, next) => {
  try {
    const documents = await documentService.getUserDocuments(req.user.id);

    res.status(200).json({
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
*/

export const getApplicationDocuments = async (req, res, next) => {
  try {
    const documents = await documentService.getApplicationDocuments(
      req.params.applicationId,
      req.user.id,
    );

    res.status(200).json({
      success: true,

      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
UPDATE DOCUMENT
============================================================
*/

export const updateDocumentStatus = async (req, res, next) => {
  try {
    const document = await documentService.updateDocumentStatus(
      req.params.id,
      req.user.id,
      req.body,
    );

    if (!document) {
      return res.status(404).json({
        success: false,

        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,

      message: "Document updated successfully",

      data: document,
    });
  } catch (error) {
    next(error);
  }
};
