import Joi from "joi";

const sendContactMessageSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(120).required(),

  email: Joi.string().trim().email().max(254).required(),

  phone: Joi.string().trim().min(7).max(25).required(),

  service: Joi.string().trim().min(1).max(150).required(),

  message: Joi.string().trim().min(10).max(3000).required(),

  source: Joi.string().trim().max(100).optional(),
});

const updateContactSchema = Joi.object({
  status: Joi.string()
    .valid("NEW", "IN_PROGRESS", "CONTACTED", "RESOLVED", "CLOSED")
    .optional(),

  assignedTo: Joi.string().hex().length(24).allow(null).optional(),

  note: Joi.string().trim().min(1).max(2000).optional(),
})
  .min(1)
  .unknown(false);

export default {
  sendContactMessageSchema,
  updateContactSchema,
};
