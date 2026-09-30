import adminOpportunityService from "./admin.opportunity.service.js";

/*
|--------------------------------------------------------------------------
| GET ALL OPPORTUNITIES
|--------------------------------------------------------------------------
*/

export const getAllOpportunities = async (req, res, next) => {
  try {
    const opportunities = await adminOpportunityService.getAllOpportunities();

    return res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE OPPORTUNITY
|--------------------------------------------------------------------------
*/

export const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await adminOpportunityService.getOpportunityById(
      req.params.id,
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| CREATE OPPORTUNITY
|--------------------------------------------------------------------------
*/

export const createOpportunity = async (req, res, next) => {
  try {
    const opportunity = await adminOpportunityService.createOpportunity(
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Opportunity created successfully.",
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE OPPORTUNITY
|--------------------------------------------------------------------------
*/

export const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await adminOpportunityService.updateOpportunity(
      req.params.id,
      req.body,
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Opportunity updated successfully.",
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| ACTIVATE / DEACTIVATE
|--------------------------------------------------------------------------
*/

export const setOpportunityActive = async (req, res, next) => {
  try {
    const { active } = req.body;

    if (typeof active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "The active value must be true or false.",
      });
    }

    const opportunity = await adminOpportunityService.setOpportunityActive(
      req.params.id,
      active,
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: active
        ? "Opportunity activated successfully."
        : "Opportunity deactivated successfully.",
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| FEATURED
|--------------------------------------------------------------------------
*/

export const setOpportunityFeatured = async (req, res, next) => {
  try {
    const { featured } = req.body;

    if (typeof featured !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "The featured value must be true or false.",
      });
    }

    const opportunity = await adminOpportunityService.setOpportunityFeatured(
      req.params.id,
      featured,
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: featured
        ? "Opportunity marked as featured."
        : "Opportunity removed from featured.",
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| DEACTIVATE
|--------------------------------------------------------------------------
*/

export const deactivateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await adminOpportunityService.deactivateOpportunity(
      req.params.id,
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Opportunity deactivated successfully.",
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  setOpportunityActive,
  setOpportunityFeatured,
  deactivateOpportunity,
};
