import opportunityService from "./opportunity.service.js";

export const getOpportunities = async (req, res, next) => {
  try {
    const opportunities = await opportunityService.getAllOpportunities({
      country: req.query.country,
      category: req.query.category,
      featured:
        req.query.featured !== undefined
          ? req.query.featured === "true"
          : undefined,
    });

    res.json({
      success: true,

      count: opportunities.length,

      data: opportunities,
    });
  } catch (error) {
    next(error);
  }
};

export const getOpportunity = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.getOpportunityBySlug(
      req.params.country,
      req.params.slug,
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,

        message: "Opportunity not found",
      });
    }

    res.json({
      success: true,

      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

export const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.getOpportunityById(
      req.params.id,
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,

        message: "Opportunity not found",
      });
    }

    res.json({
      success: true,

      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

export const getCountries = async (req, res, next) => {
  try {
    const countries = await opportunityService.getCountries();

    res.json({
      success: true,

      data: countries,
    });
  } catch (error) {
    next(error);
  }
};
