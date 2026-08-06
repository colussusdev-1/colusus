import Joi from "joi";

const sendContactMessageSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(120).required(),

  email: Joi.string().email().required(),

  phone: Joi.string().trim().min(7).max(25).required(),

  service: Joi.string().trim().required(),

  message: Joi.string().trim().min(10).max(3000).required(),
});

export default {
  sendContactMessageSchema,
};
