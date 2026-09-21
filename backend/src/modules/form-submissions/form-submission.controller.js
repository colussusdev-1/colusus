import formSubmissionService from "./form-submission.service.js";

const createSubmission = async (req, res, next) => {
  try {
    const submission = await formSubmissionService.createSubmission(req.body);

    return res.status(201).json({
      success: true,
      message: "Form submission received successfully.",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

const getForms = async (req, res, next) => {
  try {
    const forms = await formSubmissionService.getForms();

    return res.status(200).json({
      success: true,
      data: forms,
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissions = async (req, res, next) => {
  try {
    const result = await formSubmissionService.getSubmissions({
      formKey: req.query.formKey,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      data: result.submissions,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await formSubmissionService.getSubmissionById(
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

const viewDocument = async (req, res, next) => {
  try {
    const document = await formSubmissionService.getDocumentFile({
      submissionId: req.params.submissionId,
      documentId: req.params.documentId,
    });

    res.setHeader("Content-Type", document.contentType);

    res.setHeader("Content-Length", document.contentLength);

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${document.fileName}"`,
    );

    res.setHeader(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate",
    );

    return res.send(document.buffer);
  } catch (error) {
    next(error);
  }
};

const updateSubmission = async (req, res, next) => {
  try {
    const submission = await formSubmissionService.updateSubmission({
      id: req.params.id,
      payload: req.body,
      actorId: req.user?.id || null,
    });

    return res.status(200).json({
      success: true,
      message: "Form submission updated successfully.",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createSubmission,
  getForms,
  getSubmissions,
  getSubmissionById,
  viewDocument,
  updateSubmission,
};
