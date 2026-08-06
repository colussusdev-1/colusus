import contactService from "./contact.service.js";

/*
|--------------------------------------------------------------------------
| Send Contact Message
|--------------------------------------------------------------------------
*/

const sendMessage = async (req, res, next) => {
  try {
    const result = await contactService.sendMessage(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  sendMessage,
};
