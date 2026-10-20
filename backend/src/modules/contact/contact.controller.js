import contactService from "./contact.service.js";

/*
|--------------------------------------------------------------------------
| PUBLIC: CREATE CONTACT ENQUIRY
|--------------------------------------------------------------------------
*/

const createContact = async (req, res, next) => {
  try {
    const contact = await contactService.createContact(req.body);

    return res.status(201).json({
      success: true,
      message: "Your enquiry has been received successfully.",
      data: {
        id: contact._id,
        fullName: contact.fullName,
        email: contact.email,
        status: contact.status,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN: LIST CONTACT ENQUIRIES
|--------------------------------------------------------------------------
*/

const getContacts = async (req, res, next) => {
  try {
    const result = await contactService.getContacts({
      status: req.query.status,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      data: result.contacts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN: CONTACT SUMMARY
|--------------------------------------------------------------------------
*/

const getContactSummary = async (req, res, next) => {
  try {
    const summary = await contactService.getContactSummary();

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN: GET SINGLE CONTACT
|--------------------------------------------------------------------------
*/

const getContactById = async (req, res, next) => {
  try {
    const contact = await contactService.getContactById(req.params.id);

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN: UPDATE CONTACT
|--------------------------------------------------------------------------
*/

const updateContact = async (req, res, next) => {
  try {
    const contact = await contactService.updateContact({
      id: req.params.id,
      payload: req.body,
      actorId: req.user?._id || req.user?.id || null,
    });

    return res.status(200).json({
      success: true,
      message: "Contact enquiry updated successfully.",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createContact,
  getContacts,
  getContactSummary,
  getContactById,
  updateContact,
};
