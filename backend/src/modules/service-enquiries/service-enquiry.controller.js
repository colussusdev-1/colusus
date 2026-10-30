import serviceEnquiryService from "./service-enquiry.service.js";
import { getServiceEnquiryFiles } from "./service-enquiry.upload.js";

/* -------------------------------------------------------------------------- */
/* ERROR HELPER                                                               */
/* -------------------------------------------------------------------------- */

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/* -------------------------------------------------------------------------- */
/* PARSE PUBLIC ENQUIRY PAYLOAD                                               */
/* -------------------------------------------------------------------------- */

const parseEnquiryPayload = (req) => {
  let enquiry = req.body?.enquiry;

  if (typeof enquiry === "string") {
    try {
      enquiry = JSON.parse(enquiry);
    } catch {
      throw createError(
        "Invalid enquiry information. Please refresh and try again.",
      );
    }
  }

  if (!enquiry || typeof enquiry !== "object" || Array.isArray(enquiry)) {
    throw createError("Service enquiry information is required.");
  }

  return enquiry;
};

/* -------------------------------------------------------------------------- */
/* CREATE SERVICE ENQUIRY                                                     */
/* -------------------------------------------------------------------------- */

export const createSubmission = async (req, res, next) => {
  try {
    const enquiry = parseEnquiryPayload(req);

    const files = getServiceEnquiryFiles(req.files);

    const submission = await serviceEnquiryService.createSubmission(
      enquiry,
      files,
    );

    return res.status(201).json({
      success: true,
      message: "Your service enquiry has been submitted successfully.",
      data: submission,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET ALL SERVICE ENQUIRIES                                                  */
/* -------------------------------------------------------------------------- */

export const getSubmissions = async (req, res, next) => {
  try {
    const result = await serviceEnquiryService.getSubmissions({
      serviceType: req.query.serviceType,
      status: req.query.status,
      search: req.query.search,
      assignedTo: req.query.assignedTo,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      data: result.submissions,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET SINGLE SERVICE ENQUIRY                                                 */
/* -------------------------------------------------------------------------- */

export const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await serviceEnquiryService.getSubmissionById(
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* VIEW / DOWNLOAD ENQUIRY DOCUMENT                                           */
/* -------------------------------------------------------------------------- */

export const viewDocument = async (req, res, next) => {
  try {
    const document = await serviceEnquiryService.getDocumentFile({
      submissionId: req.params.id,
      documentId: req.params.documentId,
    });

    const filename = String(document.fileName || "document").replace(
      /[\\/\r\n"]/g,
      "_",
    );

    const encodedFilename = encodeURIComponent(document.fileName || "document");

    res.setHeader("Content-Type", document.contentType);

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
    );

    res.setHeader("Content-Length", document.contentLength);

    res.setHeader("Cache-Control", "private, no-store, max-age=0");

    res.setHeader("Pragma", "no-cache");

    res.setHeader("X-Content-Type-Options", "nosniff");

    return res.status(200).send(document.buffer);
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* UPDATE SERVICE ENQUIRY                                                     */
/* -------------------------------------------------------------------------- */

export const updateSubmission = async (req, res, next) => {
  try {
    const actorId = req.user?._id || req.user?.id;

    if (!actorId) {
      throw createError(
        "Authenticated staff information could not be resolved.",
        401,
      );
    }

    const submission = await serviceEnquiryService.updateSubmission({
      id: req.params.id,
      payload: req.body,
      actorId,
    });

    return res.status(200).json({
      success: true,
      message: "Service enquiry updated successfully.",
      data: submission,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* DEFAULT EXPORT                                                             */
/* -------------------------------------------------------------------------- */

const serviceEnquiryController = {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  viewDocument,
  updateSubmission,
};

export default serviceEnquiryController;
