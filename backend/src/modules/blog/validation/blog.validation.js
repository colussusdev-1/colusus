import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

export const BLOG_STATUSES = ["DRAFT", "SCHEDULED", "PUBLISHED"];

export const COMMENT_STATUSES = [
  "PENDING",
  "APPROVED",
  "SCHEDULED",
  "REJECTED",
];

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidDate = (value) => {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
};

const isFutureDate = (value) => {
  if (!isValidDate(value)) {
    return false;
  }

  return new Date(value) > new Date();
};

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| Blog Post Validation
|--------------------------------------------------------------------------
*/

export const validatePost = (body = {}, { partial = false } = {}) => {
  const errors = {};

  if (!partial || body.title !== undefined) {
    if (!isNonEmptyString(body.title)) {
      errors.title = "Title is required.";
    } else if (body.title.trim().length > 180) {
      errors.title = "Title cannot exceed 180 characters.";
    }
  }

  if (!partial || body.content !== undefined) {
    if (!isNonEmptyString(body.content)) {
      errors.content = "Content is required.";
    }
  }

  if (
    body.excerpt !== undefined &&
    typeof body.excerpt === "string" &&
    body.excerpt.trim().length > 500
  ) {
    errors.excerpt = "Excerpt cannot exceed 500 characters.";
  }

  if (body.category !== undefined) {
    if (!isNonEmptyString(body.category)) {
      errors.category = "Category cannot be empty.";
    }
  }

  if (body.slug !== undefined) {
    if (!isNonEmptyString(body.slug)) {
      errors.slug = "Slug cannot be empty.";
    }
  }

  if (body.tags !== undefined) {
    const tags = normalizeTags(body.tags);

    if (tags.length > 20) {
      errors.tags = "A post cannot have more than 20 tags.";
    }

    if (tags.some((tag) => tag.length > 50)) {
      errors.tags = "Each tag cannot exceed 50 characters.";
    }
  }

  if (body.status !== undefined) {
    const status = String(body.status).toUpperCase();

    if (!BLOG_STATUSES.includes(status)) {
      errors.status = "Invalid blog post status.";
    }
  }

  if (body.scheduledFor !== undefined) {
    if (!isValidDate(body.scheduledFor)) {
      errors.scheduledFor = "Invalid scheduled date.";
    } else if (
      String(body.status || "").toUpperCase() === "SCHEDULED" &&
      !isFutureDate(body.scheduledFor)
    ) {
      errors.scheduledFor = "Scheduled date must be in the future.";
    }
  }

  if (body.coverImage !== undefined) {
    if (
      typeof body.coverImage !== "object" ||
      body.coverImage === null ||
      Array.isArray(body.coverImage)
    ) {
      errors.coverImage = "coverImage must be an object.";
    } else {
      if (
        body.coverImage.url !== undefined &&
        typeof body.coverImage.url !== "string"
      ) {
        errors.coverImage = "coverImage.url must be a string.";
      }

      if (
        body.coverImage.publicId !== undefined &&
        typeof body.coverImage.publicId !== "string"
      ) {
        errors.coverImage = "coverImage.publicId must be a string.";
      }
    }
  }

  if (body.seo !== undefined) {
    if (
      typeof body.seo !== "object" ||
      body.seo === null ||
      Array.isArray(body.seo)
    ) {
      errors.seo = "seo must be an object.";
    } else {
      if (
        body.seo.metaTitle !== undefined &&
        typeof body.seo.metaTitle !== "string"
      ) {
        errors.seo = "seo.metaTitle must be a string.";
      }

      if (
        body.seo.metaDescription !== undefined &&
        typeof body.seo.metaDescription !== "string"
      ) {
        errors.seo = "seo.metaDescription must be a string.";
      }

      if (
        body.seo.keywords !== undefined &&
        !Array.isArray(body.seo.keywords)
      ) {
        errors.seo = "seo.keywords must be an array.";
      }
    }
  }

  if (body.featured !== undefined && typeof body.featured !== "boolean") {
    errors.featured = "featured must be a boolean.";
  }

  if (
    body.commentsEnabled !== undefined &&
    typeof body.commentsEnabled !== "boolean"
  ) {
    errors.commentsEnabled = "commentsEnabled must be a boolean.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/*
|--------------------------------------------------------------------------
| Schedule Validation
|--------------------------------------------------------------------------
*/

export const validateSchedule = (scheduledFor) => {
  const errors = {};

  if (!scheduledFor) {
    errors.scheduledFor = "scheduledFor is required.";
  } else if (!isValidDate(scheduledFor)) {
    errors.scheduledFor = "Invalid scheduled date.";
  } else if (!isFutureDate(scheduledFor)) {
    errors.scheduledFor = "Scheduled date must be in the future.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/*
|--------------------------------------------------------------------------
| Comment Validation
|--------------------------------------------------------------------------
*/

export const validateComment = (body = {}, { editorial = false } = {}) => {
  const errors = {};

  if (!isNonEmptyString(body.content)) {
    errors.content = "Comment content is required.";
  } else if (body.content.trim().length > 2000) {
    errors.content = "Comment cannot exceed 2000 characters.";
  }

  if (!editorial && !isNonEmptyString(body.name)) {
    errors.name = "Name is required.";
  }

  if (
    body.name !== undefined &&
    typeof body.name === "string" &&
    body.name.trim().length > 100
  ) {
    errors.name = "Name cannot exceed 100 characters.";
  }

  if (body.email !== undefined && body.email !== "") {
    if (typeof body.email !== "string") {
      errors.email = "Email must be a string.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
      errors.email = "Please provide a valid email address.";
    }
  }

  if (body.status !== undefined) {
    const status = String(body.status).toUpperCase();

    if (!COMMENT_STATUSES.includes(status)) {
      errors.status = "Invalid comment status.";
    }
  }

  if (
    body.scheduledFor !== undefined &&
    String(body.status || "").toUpperCase() === "SCHEDULED"
  ) {
    const schedule = validateSchedule(body.scheduledFor);

    if (!schedule.valid) {
      Object.assign(errors, schedule.errors);
    }
  }

  if (body.pinned !== undefined && typeof body.pinned !== "boolean") {
    errors.pinned = "pinned must be a boolean.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/*
|--------------------------------------------------------------------------
| MongoDB ID Validation
|--------------------------------------------------------------------------
*/

export const validateObjectId = (value, field = "id") => {
  if (!mongoose.isValidObjectId(value)) {
    return {
      valid: false,
      errors: {
        [field]: `Invalid ${field}.`,
      },
    };
  }

  return {
    valid: true,
    errors: {},
  };
};

/*
|--------------------------------------------------------------------------
| Validation Response Helper
|--------------------------------------------------------------------------
*/

export const validationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: "Please correct the highlighted fields.",
    errors,
  });
};

/*
|--------------------------------------------------------------------------
| Normalizers
|--------------------------------------------------------------------------
*/

export const normalizePostInput = (body = {}) => {
  const normalized = {
    ...body,
  };

  if (typeof normalized.title === "string") {
    normalized.title = normalized.title.trim();
  }

  if (typeof normalized.excerpt === "string") {
    normalized.excerpt = normalized.excerpt.trim();
  }

  if (typeof normalized.category === "string") {
    normalized.category = normalized.category.trim();
  }

  if (typeof normalized.slug === "string") {
    normalized.slug = normalized.slug.trim();
  }

  if (normalized.tags !== undefined) {
    normalized.tags = normalizeTags(normalized.tags);
  }

  if (normalized.status !== undefined) {
    normalized.status = String(normalized.status).toUpperCase();
  }

  return normalized;
};

export const normalizeCommentInput = (body = {}) => {
  const normalized = {
    ...body,
  };

  if (typeof normalized.name === "string") {
    normalized.name = normalized.name.trim();
  }

  if (typeof normalized.email === "string") {
    normalized.email = normalized.email.trim().toLowerCase();
  }

  if (typeof normalized.content === "string") {
    normalized.content = normalized.content.trim();
  }

  if (normalized.status !== undefined) {
    normalized.status = String(normalized.status).toUpperCase();
  }

  return normalized;
};
