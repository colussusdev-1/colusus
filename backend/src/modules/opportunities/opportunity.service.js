import Opportunity from "./opportunity.model.js";

/*
|--------------------------------------------------------------------------
| GET ALL OPPORTUNITIES
|--------------------------------------------------------------------------
*/

const getAllOpportunities = async (filters = {}) => {
  const query = {
    active: true,
  };

  if (filters.country) {
    query.countrySlug = filters.country;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.featured !== undefined) {
    query.featured = filters.featured;
  }

  return Opportunity.find(query).sort({
    createdAt: -1,
  });
};

/*
|--------------------------------------------------------------------------
| GET SINGLE OPPORTUNITY
|--------------------------------------------------------------------------
*/

const getOpportunityBySlug = async (countrySlug, opportunitySlug) => {
  return Opportunity.findOne({
    countrySlug,

    slug: opportunitySlug,

    active: true,
  });
};

/*
|--------------------------------------------------------------------------
| GET OPPORTUNITY BY ID
|--------------------------------------------------------------------------
*/

const getOpportunityById = async (id) => {
  return Opportunity.findOne({
    _id: id,

    active: true,
  });
};

/*
|--------------------------------------------------------------------------
| GET COUNTRIES
|--------------------------------------------------------------------------
|
| Countries are derived from the opportunities collection.
|
*/

const getCountries = async () => {
  return Opportunity.aggregate([
    {
      $match: {
        active: true,
      },
    },

    {
      $group: {
        _id: "$countrySlug",

        name: {
          $first: "$countryName",
        },

        flag: {
          $first: "$countryFlag",
        },

        image: {
          $first: "$countryImage",
        },

        applicants: {
          $first: "$applicants",
        },

        category: {
          $first: "$countryCategories",
        },

        visa: {
          $first: "$countryVisa",
        },

        duration: {
          $first: "$countryDuration",
        },

        processingTime: {
          $first: "$countryProcessingTime",
        },

        opportunityScore: {
          $first: "$opportunityScore",
        },

        successRate: {
          $first: "$successRate",
        },

        featured: {
          $first: "$featured",
        },

        description: {
          $first: "$countryDescription",
        },
      },
    },

    {
      $sort: {
        name: 1,
      },
    },
  ]);
};

export default {
  getAllOpportunities,

  getOpportunityBySlug,

  getOpportunityById,

  getCountries,
};
