import documentService from "./document.service.js";

export const createDocument = async (req, res, next) => {
  try {
    const document = await documentService.createDocument({
      user: req.user.id,

      ...req.body,
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
