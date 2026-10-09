/* -------------------------------------------------------------------------- */
/* NOTIFICATION TYPES                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Notification audiences.
 *
 * This represents the operational role of the recipient.
 */
export const NOTIFICATION_AUDIENCES = Object.freeze([
  "CLIENT",
  "STAFF",
  "ADMIN",
]);

/* -------------------------------------------------------------------------- */
/* CATEGORIES                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Broad business area that generated the notification.
 */
export const NOTIFICATION_CATEGORIES = Object.freeze([
  "APPLICATION",
  "DOCUMENT",
  "PAYMENT",
  "BOOKING",
  "PROFILE",
  "COMMUNICATION",
  "STAFF",
  "ADMIN",
  "SYSTEM",
]);

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Specific event that happened.
 *
 * Categories keep the system organized while types describe
 * the actual event.
 */
export const NOTIFICATION_TYPES = Object.freeze({
  APPLICATION: Object.freeze([
    "CREATED",
    "UPDATED",
    "SUBMITTED",
    "STATUS_CHANGED",
    "APPROVED",
    "REJECTED",
  ]),

  DOCUMENT: Object.freeze([
    "UPLOADED",
    "UPDATED",
    "APPROVED",
    "REJECTED",
    "REUPLOAD_REQUIRED",
  ]),

  PAYMENT: Object.freeze([
    "CREATED",
    "PENDING",
    "RECEIVED",
    "FAILED",
    "REFUNDED",
  ]),

  BOOKING: Object.freeze(["CREATED", "UPDATED", "CONFIRMED", "CANCELLED"]),

  PROFILE: Object.freeze(["UPDATED", "COMPLETED"]),

  COMMUNICATION: Object.freeze(["MESSAGE_RECEIVED"]),

  STAFF: Object.freeze(["ACTION_REQUIRED", "ACTION_COMPLETED"]),

  ADMIN: Object.freeze(["ACTION_REQUIRED", "ACTION_COMPLETED"]),

  SYSTEM: Object.freeze(["GENERAL", "MAINTENANCE"]),
});

/* -------------------------------------------------------------------------- */
/* PRIORITIES                                                                 */
/* -------------------------------------------------------------------------- */

export const NOTIFICATION_PRIORITIES = Object.freeze([
  "LOW",
  "NORMAL",
  "HIGH",
  "URGENT",
]);

/* -------------------------------------------------------------------------- */
/* ENTITY TYPES                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The actual business record associated with the notification.
 */
export const NOTIFICATION_ENTITY_TYPES = Object.freeze([
  "APPLICATION",
  "DOCUMENT",
  "PAYMENT",
  "BOOKING",
  "PROFILE",
  "USER",
  "MESSAGE",
  "SYSTEM",
  "NONE",
]);

/* -------------------------------------------------------------------------- */
/* ACTIONS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Optional action the recipient can take from the notification.
 */
export const NOTIFICATION_ACTIONS = Object.freeze([
  "VIEW",
  "REVIEW",
  "UPLOAD",
  "PAY",
  "APPROVE",
  "REJECT",
  "RESPOND",
  "NONE",
]);

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Check whether a category exists.
 */
export function isValidNotificationCategory(category) {
  return NOTIFICATION_CATEGORIES.includes(
    String(category || "")
      .trim()
      .toUpperCase(),
  );
}

/**
 * Check whether an audience exists.
 */
export function isValidNotificationAudience(audience) {
  return NOTIFICATION_AUDIENCES.includes(
    String(audience || "")
      .trim()
      .toUpperCase(),
  );
}

/**
 * Check whether a priority exists.
 */
export function isValidNotificationPriority(priority) {
  return NOTIFICATION_PRIORITIES.includes(
    String(priority || "")
      .trim()
      .toUpperCase(),
  );
}

/**
 * Check whether an entity type exists.
 */
export function isValidNotificationEntityType(entityType) {
  return NOTIFICATION_ENTITY_TYPES.includes(
    String(entityType || "")
      .trim()
      .toUpperCase(),
  );
}

/**
 * Check whether an action exists.
 */
export function isValidNotificationAction(action) {
  return NOTIFICATION_ACTIONS.includes(
    String(action || "")
      .trim()
      .toUpperCase(),
  );
}

/**
 * Check whether a type belongs to a category.
 */
export function isValidNotificationType(category, type) {
  const normalizedCategory = String(category || "")
    .trim()
    .toUpperCase();

  const normalizedType = String(type || "")
    .trim()
    .toUpperCase();

  return (
    Array.isArray(NOTIFICATION_TYPES[normalizedCategory]) &&
    NOTIFICATION_TYPES[normalizedCategory].includes(normalizedType)
  );
}
