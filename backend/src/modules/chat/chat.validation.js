import mongoose from "mongoose";

const MAX_MESSAGE_LENGTH = 10000;
const MAX_SUBJECT_LENGTH = 200;

export function validateObjectId(value, fieldName = "ID") {
  if (!mongoose.isValidObjectId(value)) {
    const error = new Error(`Invalid ${fieldName}.`);
    error.statusCode = 400;
    throw error;
  }

  return value;
}

export function validateMessage(content) {
  if (content !== undefined && typeof content !== "string") {
    const error = new Error("Message content must be text.");
    error.statusCode = 400;
    throw error;
  }

  const normalized = typeof content === "string" ? content.trim() : "";

  if (normalized.length > MAX_MESSAGE_LENGTH) {
    const error = new Error(
      `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`,
    );
    error.statusCode = 400;
    throw error;
  }

  return normalized;
}

export function validateSubject(subject) {
  if (subject !== undefined && typeof subject !== "string") {
    const error = new Error("Conversation subject must be text.");
    error.statusCode = 400;
    throw error;
  }

  const normalized = typeof subject === "string" ? subject.trim() : "";

  if (normalized.length > MAX_SUBJECT_LENGTH) {
    const error = new Error(
      `Subject cannot exceed ${MAX_SUBJECT_LENGTH} characters.`,
    );
    error.statusCode = 400;
    throw error;
  }

  return normalized || "Client Communication";
}

export function validatePagination(query = {}) {
  const page = Number.parseInt(query.page, 10) || 1;
  const limit = Number.parseInt(query.limit, 10) || 30;

  if (page < 1 || limit < 1 || limit > 100) {
    const error = new Error("Invalid pagination parameters.");
    error.statusCode = 400;
    throw error;
  }

  return { page, limit };
}

export function validateChatStatus(status) {
  const allowed = ["OPEN", "CLOSED", "ARCHIVED"];

  if (!allowed.includes(status)) {
    const error = new Error("Invalid conversation status.");
    error.statusCode = 400;
    throw error;
  }

  return status;
}
