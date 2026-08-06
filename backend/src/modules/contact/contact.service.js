import communicationService from "../communications/communication.service.js";
import contactValidation from "./contact.validation.js";

const sendMessage = async (payload) => {
  /*
  |--------------------------------------------------------------------------
  | Validate Request
  |--------------------------------------------------------------------------
  */

  const { error, value } =
    contactValidation.sendContactMessageSchema.validate(payload);

  if (error) {
    throw new Error(error.details[0].message);
  }

  /*
  |--------------------------------------------------------------------------
  | Destructure
  |--------------------------------------------------------------------------
  */

  const { fullName, email, phone, service, message } = value;

  /*
  |--------------------------------------------------------------------------
  | Notify Admin
  |--------------------------------------------------------------------------
  */

  await communicationService.contactReceived({
    fullName,
    email,
    phone,
    service,
    message,
  });

  /*
  |--------------------------------------------------------------------------
  | Send Confirmation To Customer
  |--------------------------------------------------------------------------
  */

  await communicationService.contactConfirmation({
    fullName,
    email,
    service,
  });

  /*
  |--------------------------------------------------------------------------
  | Response
  |--------------------------------------------------------------------------
  */

  return {
    success: true,
    message: "Your enquiry has been received successfully.",
  };
};

export default {
  sendMessage,
};
