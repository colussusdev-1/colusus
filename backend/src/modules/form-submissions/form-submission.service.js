import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import FormSubmission from "./form-submission.model.js";
import formSubmissionValidation from "./form-submission.validation.js";

const formRegistry = [
  {
    key: "ireland-nursing-healthcare",
    name: "Ireland Nursing & Healthcare",
    description: "Nursing and healthcare migration interest form",
    active: true,
  },

  {
    key: "webinar-registration",
    name: "Webinar Registration",
    description: "Ireland nursing webinar registrations",
    active: true,
  },

  {
    key: "contact",
    name: "Contact Form",
    description: "General website enquiries",
    active: true,
  },

  {
    key: "consultation-request",
    name: "Consultation Request",
    description: "Migration consultation requests",
    active: true,
  },
];

const getRegisteredForm = (formKey) => {
  return formRegistry.find((form) => form.key === formKey);
};

const createSubmission = async (payload) => {
  const data = formSubmissionValidation.createSubmission(payload);

  const registeredForm = getRegisteredForm(data.formKey);

  if (!registeredForm || !registeredForm.active) {
    const error = new Error("This form is not available.");

    error.statusCode = 400;

    throw error;
  }

  const submission = await FormSubmission.create({
    formKey: registeredForm.key,
    formName: registeredForm.name,
    submissionData: data.submissionData,
    documents: data.documents,
    source: data.source,
  });

  return submission;
};

const getForms = async () => {
  return formRegistry.filter((form) => form.active);
};

const getSubmissions = async ({
  formKey,
  status,
  page = 1,
  limit = 25,
} = {}) => {
  const filter = {};

  if (formKey) {
    filter.formKey = formKey.trim().toLowerCase();
  }

  if (status) {
    filter.status = status;
  }

  const currentPage = Math.max(Number(page) || 1, 1);

  const currentLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);

  const skip = (currentPage - 1) * currentLimit;

  const [submissions, total] = await Promise.all([
    FormSubmission.find(filter)
      .populate("assignedTo", "firstName lastName email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(currentLimit)
      .lean(),

    FormSubmission.countDocuments(filter),
  ]);

  return {
    submissions,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      pages: Math.ceil(total / currentLimit),
    },
  };
};

const getSubmissionById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid submission ID.");

    error.statusCode = 400;

    throw error;
  }

  const submission = await FormSubmission.findById(id)
    .populate("assignedTo", "firstName lastName email role")
    .populate("internalNotes.addedBy", "firstName lastName email role");

  if (!submission) {
    const error = new Error("Form submission not found.");

    error.statusCode = 404;

    throw error;
  }

  return submission;
};

const getDocumentFile = async ({ submissionId, documentId }) => {
  if (!mongoose.Types.ObjectId.isValid(submissionId)) {
    const error = new Error("Invalid submission ID.");

    error.statusCode = 400;

    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    const error = new Error("Invalid document ID.");

    error.statusCode = 400;

    throw error;
  }

  const submission = await FormSubmission.findById(submissionId).lean();

  if (!submission) {
    const error = new Error("Form submission not found.");

    error.statusCode = 404;

    throw error;
  }

  const document = submission.documents?.find(
    (item) => String(item._id) === String(documentId),
  );

  if (!document) {
    const error = new Error("Document not found.");

    error.statusCode = 404;

    throw error;
  }

  if (!document.publicId) {
    const error = new Error(
      "This document does not have a Cloudinary public ID.",
    );

    error.statusCode = 404;

    throw error;
  }

  const resourceType = document.resourceType || "image";

  const format = String(document.format || "").toLowerCase();

  if (!format) {
    const error = new Error("Document format is missing.");

    error.statusCode = 400;

    throw error;
  }

  let cloudinaryUrl;

  try {
    cloudinaryUrl = cloudinary.utils.private_download_url(
      document.publicId,
      format,
      {
        resource_type: resourceType,
        type: "upload",
        attachment: false,
      },
    );
  } catch (cloudinaryError) {
    const error = new Error("Unable to create the Cloudinary document URL.");

    error.statusCode = 502;
    error.cause = cloudinaryError;

    throw error;
  }

  let response;

  try {
    response = await fetch(cloudinaryUrl);
  } catch (fetchError) {
    const error = new Error("Unable to connect to document storage.");

    error.statusCode = 502;
    error.cause = fetchError;

    throw error;
  }

  if (!response.ok) {
    const error = new Error(
      `Document storage returned HTTP ${response.status}.`,
    );

    error.statusCode = 502;

    throw error;
  }

  const arrayBuffer = await response.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  let contentType =
    response.headers.get("content-type") || "application/octet-stream";

  if (format === "pdf") {
    contentType = "application/pdf";
  }

  if (["jpg", "jpeg"].includes(format)) {
    contentType = "image/jpeg";
  }

  if (format === "png") {
    contentType = "image/png";
  }

  if (format === "webp") {
    contentType = "image/webp";
  }

  if (format === "gif") {
    contentType = "image/gif";
  }

  return {
    buffer,
    contentType,
    contentLength: buffer.length,
    fileName: document.name || `document.${format}`,
  };
};

const updateSubmission = async ({ id, payload, actorId }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid submission ID.");

    error.statusCode = 400;

    throw error;
  }

  const data = formSubmissionValidation.updateSubmission(payload);

  const submission = await FormSubmission.findById(id);

  if (!submission) {
    const error = new Error("Form submission not found.");

    error.statusCode = 404;

    throw error;
  }

  if (data.status !== undefined) {
    submission.status = data.status;
  }

  if (data.assignedTo !== undefined) {
    if (
      data.assignedTo !== null &&
      !mongoose.Types.ObjectId.isValid(data.assignedTo)
    ) {
      const error = new Error("Invalid assigned staff ID.");

      error.statusCode = 400;

      throw error;
    }

    submission.assignedTo = data.assignedTo;
  }

  if (data.note) {
    submission.internalNotes.push({
      message: data.note,
      addedBy: actorId || null,
      createdAt: new Date(),
    });
  }

  await submission.save();

  return getSubmissionById(id);
};

export default {
  formRegistry,
  createSubmission,
  getForms,
  getSubmissions,
  getSubmissionById,
  getDocumentFile,
  updateSubmission,
};
