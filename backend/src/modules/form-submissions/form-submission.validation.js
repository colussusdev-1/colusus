const allowedStatuses = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "CLOSED",
];

const createSubmission = (payload = {}) => {
  const errors = [];

  if (
    !payload.formKey ||
    typeof payload.formKey !== "string" ||
    !payload.formKey.trim()
  ) {
    errors.push("formKey is required.");
  }

  if (
    !payload.formName ||
    typeof payload.formName !== "string" ||
    !payload.formName.trim()
  ) {
    errors.push("formName is required.");
  }

  if (
    !payload.submissionData ||
    typeof payload.submissionData !== "object" ||
    Array.isArray(payload.submissionData)
  ) {
    errors.push("submissionData must be an object.");
  }

  if (errors.length) {
    const error = new Error(errors[0]);
    error.statusCode = 400;
    throw error;
  }

  return {
    formKey: payload.formKey.trim().toLowerCase(),
    formName: payload.formName.trim(),
    submissionData: payload.submissionData,
    documents: Array.isArray(payload.documents) ? payload.documents : [],
    source:
      typeof payload.source === "string" && payload.source.trim()
        ? payload.source.trim()
        : "WEBSITE",
  };
};

const updateSubmission = (payload = {}) => {
  const data = {};

  if (payload.status !== undefined) {
    if (!allowedStatuses.includes(payload.status)) {
      const error = new Error(
        `Invalid submission status. Allowed statuses: ${allowedStatuses.join(
          ", ",
        )}.`,
      );

      error.statusCode = 400;
      throw error;
    }

    data.status = payload.status;
  }

  if (payload.assignedTo !== undefined) {
    data.assignedTo = payload.assignedTo || null;
  }

  if (payload.note !== undefined) {
    if (typeof payload.note !== "string" || !payload.note.trim()) {
      const error = new Error("Note must be a non-empty string.");
      error.statusCode = 400;
      throw error;
    }

    data.note = payload.note.trim();
  }

  if (!Object.keys(data).length) {
    const error = new Error("No valid update fields were provided.");
    error.statusCode = 400;
    throw error;
  }

  return data;
};

export default {
  allowedStatuses,
  createSubmission,
  updateSubmission,
};
