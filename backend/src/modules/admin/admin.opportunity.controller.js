import opportunityService from "./admin.opportunity.service.js";

/* -------------------------------------------------------------------------- */
/* RESPONSE HELPERS                                                           */
/* -------------------------------------------------------------------------- */

const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null ? { data } : {}),
  });
};

const sendError = (
  res,
  error,
  fallbackMessage = "An unexpected error occurred.",
) => {
  const statusCode =
    Number.isInteger(error?.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode <= 599
      ? error.statusCode
      : 500;

  return res.status(statusCode).json({
    success: false,
    message: error?.message || fallbackMessage,
    ...(error?.details ? { details: error.details } : {}),
  });
};

/* -------------------------------------------------------------------------- */
/* ASYNC HANDLER                                                              */
/* -------------------------------------------------------------------------- */

const asyncHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error(
        `[Admin Opportunity Controller] ${req.method} ${req.originalUrl}:`,
        error,
      );

      if (res.headersSent) {
        return;
      }

      return sendError(res, error);
    }
  };
};

/* -------------------------------------------------------------------------- */
/* GET ALL OPPORTUNITIES                                                      */
/* GET /api/v1/admin/opportunities                                            */
/* -------------------------------------------------------------------------- */

export const getAllOpportunities = asyncHandler(async (req, res) => {
  const result = await opportunityService.getAllOpportunities({
    search: req.query.search,
    countrySlug: req.query.countrySlug,
    countryName: req.query.countryName,
    category: req.query.category,
    type: req.query.type,
    active: req.query.active,
    featured: req.query.featured,
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    order: req.query.order,
  });

  return sendSuccess(res, "Opportunities retrieved successfully.", result);
});

/* -------------------------------------------------------------------------- */
/* GET OPPORTUNITY BY ID                                                      */
/* GET /api/v1/admin/opportunities/:id                                        */
/* -------------------------------------------------------------------------- */

export const getOpportunityById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const opportunity = await opportunityService.getOpportunityById(id);

  return sendSuccess(res, "Opportunity retrieved successfully.", opportunity);
});

/* -------------------------------------------------------------------------- */
/* CREATE OPPORTUNITY                                                         */
/* POST /api/v1/admin/opportunities                                           */
/* -------------------------------------------------------------------------- */

export const createOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await opportunityService.createOpportunity(req.body);

  return sendSuccess(
    res,
    "Opportunity created successfully.",
    opportunity,
    201,
  );
});

/* -------------------------------------------------------------------------- */
/* UPDATE OPPORTUNITY                                                         */
/* PATCH /api/v1/admin/opportunities/:id                                      */
/* -------------------------------------------------------------------------- */

export const updateOpportunity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const opportunity = await opportunityService.updateOpportunity(id, req.body);

  return sendSuccess(res, "Opportunity updated successfully.", opportunity);
});

/* -------------------------------------------------------------------------- */
/* DEACTIVATE OPPORTUNITY                                                     */
/* DELETE /api/v1/admin/opportunities/:id                                     */
/* -------------------------------------------------------------------------- */

export const deactivateOpportunity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const opportunity = await opportunityService.deactivateOpportunity(id);

  return sendSuccess(res, "Opportunity deactivated successfully.", opportunity);
});

/* -------------------------------------------------------------------------- */
/* SET OPPORTUNITY ACTIVE STATUS                                              */
/* PATCH /api/v1/admin/opportunities/:id/active                               */
/* -------------------------------------------------------------------------- */

export const setOpportunityActive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  if (typeof active !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "The active field must be a boolean.",
    });
  }

  const opportunity = await opportunityService.setOpportunityActive(id, active);

  return sendSuccess(
    res,
    `Opportunity ${active ? "activated" : "deactivated"} successfully.`,
    opportunity,
  );
});

/* -------------------------------------------------------------------------- */
/* SET OPPORTUNITY FEATURED STATUS                                            */
/* PATCH /api/v1/admin/opportunities/:id/featured                             */
/* -------------------------------------------------------------------------- */

export const setOpportunityFeatured = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { featured } = req.body;

  if (typeof featured !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "The featured field must be a boolean.",
    });
  }

  const opportunity = await opportunityService.setOpportunityFeatured(
    id,
    featured,
  );

  return sendSuccess(
    res,
    `Opportunity ${featured ? "featured" : "unfeatured"} successfully.`,
    opportunity,
  );
});

/* -------------------------------------------------------------------------- */
/* GET DESTINATIONS                                                           */
/* GET /api/v1/admin/opportunities/destinations                               */
/* -------------------------------------------------------------------------- */

export const getDestinations = asyncHandler(async (req, res) => {
  const destinations = await opportunityService.getDestinations({
    search: req.query.search,
    active: req.query.active,
  });

  return sendSuccess(res, "Destinations retrieved successfully.", destinations);
});

/* -------------------------------------------------------------------------- */
/* GET DESTINATION BY COUNTRY SLUG                                            */
/* GET /api/v1/admin/opportunities/destinations/:countrySlug                 */
/* -------------------------------------------------------------------------- */

export const getDestinationBySlug = asyncHandler(async (req, res) => {
  const { countrySlug } = req.params;

  const destination =
    await opportunityService.getDestinationBySlug(countrySlug);

  return sendSuccess(res, "Destination retrieved successfully.", destination);
});

/* -------------------------------------------------------------------------- */
/* UPDATE DESTINATION METADATA                                                */
/* PATCH /api/v1/admin/opportunities/destinations/:countrySlug               */
/* -------------------------------------------------------------------------- */

export const updateDestination = asyncHandler(async (req, res) => {
  const { countrySlug } = req.params;

  const destination = await opportunityService.updateDestination(
    countrySlug,
    req.body,
  );

  return sendSuccess(res, "Destination updated successfully.", destination);
});

/* -------------------------------------------------------------------------- */
/* GET OPPORTUNITY DATA INTEGRITY REPORT                                      */
/* GET /api/v1/admin/opportunities/integrity                                  */
/* -------------------------------------------------------------------------- */

export const getIntegrityReport = asyncHandler(async (req, res) => {
  const report = await opportunityService.getIntegrityReport();

  return sendSuccess(
    res,
    "Opportunity integrity report generated successfully.",
    report,
  );
});

/* -------------------------------------------------------------------------- */
/* DEFAULT EXPORT                                                             */
/* -------------------------------------------------------------------------- */

export default {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deactivateOpportunity,
  setOpportunityActive,
  setOpportunityFeatured,
  getDestinations,
  getDestinationBySlug,
  updateDestination,
  getIntegrityReport,
};
