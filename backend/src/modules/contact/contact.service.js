import mongoose from "mongoose";

import Contact from "./contact.model.js";
import contactValidation from "./contact.validation.js";

import communicationService from "../communications/communication.service.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  return error;
};

/*
|--------------------------------------------------------------------------
| CREATE CONTACT ENQUIRY
|--------------------------------------------------------------------------
*/

const createContact = async (payload = {}) => {
  const { error, value } = contactValidation.sendContactMessageSchema.validate(
    payload,
    {
      abortEarly: true,
      stripUnknown: true,
    },
  );

  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const contact = await Contact.create({
    fullName: value.fullName,
    email: value.email,
    phone: value.phone,
    service: value.service,
    message: value.message,
    source: value.source || "website-contact",
  });

  /*
    |--------------------------------------------------------------------------
    | SEND COMMUNICATIONS
    |--------------------------------------------------------------------------
    |
    | The enquiry is already saved before emails are attempted.
    | A mail delivery failure must not erase a valid enquiry.
    |
    */

  const communicationPayload = {
    fullName: contact.fullName,
    email: contact.email,
    phone: contact.phone,
    service: contact.service,
    message: contact.message,
    contactId: contact._id.toString(),
    createdAt: contact.createdAt,
  };

  try {
    await communicationService.contactReceived(communicationPayload);
  } catch (error) {
    console.error("CONTACT ADMIN NOTIFICATION ERROR:", error.message);
  }

  try {
    await communicationService.contactConfirmation(communicationPayload);
  } catch (error) {
    console.error("CONTACT CUSTOMER CONFIRMATION ERROR:", error.message);
  }

  return contact;
};

/*
|--------------------------------------------------------------------------
| GET CONTACT SUBMISSIONS
|--------------------------------------------------------------------------
*/

const getContacts = async ({ status, search, page = 1, limit = 25 } = {}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search && String(search).trim()) {
    const searchTerm = String(search).trim();

    filter.$or = [
      {
        fullName: {
          $regex: searchTerm,
          $options: "i",
        },
      },
      {
        email: {
          $regex: searchTerm,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: searchTerm,
          $options: "i",
        },
      },
      {
        service: {
          $regex: searchTerm,
          $options: "i",
        },
      },
    ];
  }

  const currentPage = Math.max(Number(page) || 1, 1);

  const currentLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);

  const skip = (currentPage - 1) * currentLimit;

  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .populate("assignedTo", "firstName lastName email role")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(currentLimit)
      .lean(),

    Contact.countDocuments(filter),
  ]);

  return {
    contacts,

    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      pages: Math.ceil(total / currentLimit),
    },
  };
};

/*
|--------------------------------------------------------------------------
| GET SINGLE CONTACT
|--------------------------------------------------------------------------
*/

const getContactById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid contact enquiry ID.", 400);
  }

  const contact = await Contact.findById(id)
    .populate("assignedTo", "firstName lastName email role")
    .populate("internalNotes.addedBy", "firstName lastName email");

  if (!contact) {
    throw createError("Contact enquiry not found.", 404);
  }

  return contact;
};

/*
|--------------------------------------------------------------------------
| UPDATE CONTACT
|--------------------------------------------------------------------------
*/

const updateContact = async ({ id, payload = {}, actorId = null }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid contact enquiry ID.", 400);
  }

  const { error, value } = contactValidation.updateContactSchema.validate(
    payload,
    {
      abortEarly: true,
      stripUnknown: true,
    },
  );

  if (error) {
    throw createError(error.details[0].message, 400);
  }

  if (value.assignedTo && !mongoose.Types.ObjectId.isValid(value.assignedTo)) {
    throw createError("Invalid assigned staff ID.", 400);
  }

  const contact = await Contact.findById(id);

  if (!contact) {
    throw createError("Contact enquiry not found.", 404);
  }

  if (value.status !== undefined) {
    contact.status = value.status;

    if (value.status === "CONTACTED" && !contact.contactedAt) {
      contact.contactedAt = new Date();
    }

    if (value.status === "RESOLVED") {
      contact.resolvedAt = new Date();
    } else {
      contact.resolvedAt = null;
    }
  }

  if (value.assignedTo !== undefined) {
    contact.assignedTo = value.assignedTo;
  }

  if (value.note) {
    contact.internalNotes.push({
      message: value.note,
      addedBy: actorId || null,
      createdAt: new Date(),
    });
  }

  await contact.save();

  return getContactById(contact._id);
};

/*
|--------------------------------------------------------------------------
| CONTACT DASHBOARD SUMMARY
|--------------------------------------------------------------------------
*/

const getContactSummary = async () => {
  const [total, newCount, inProgress, contacted, resolved, closed] =
    await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: "NEW" }),
      Contact.countDocuments({ status: "IN_PROGRESS" }),
      Contact.countDocuments({ status: "CONTACTED" }),
      Contact.countDocuments({ status: "RESOLVED" }),
      Contact.countDocuments({ status: "CLOSED" }),
    ]);

  return {
    total,
    new: newCount,
    inProgress,
    contacted,
    resolved,
    closed,
  };
};

export default {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  getContactSummary,
};
