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
| Only active opportunities are exposed publicly.
|
| Multiple opportunities can belong to the same country, so we group
| them by countrySlug.
|
| IMAGE RESOLUTION
|--------------------------------------------------------------------------
|
| 1. Prefer the explicit countryImage.
| 2. If countryImage is missing, use the opportunity image as a
|    non-persistent fallback.
|
| This keeps these two database fields semantically separate:
|
| countryImage -> destination-level image
| image        -> opportunity-level image
|
| The fallback exists only for the public country catalogue.
|
|--------------------------------------------------------------------------
*/

const getCountries = async () => {
  return Opportunity.aggregate([
    /*
    |--------------------------------------------------------------------------
    | ACTIVE OPPORTUNITIES ONLY
    |--------------------------------------------------------------------------
    */

    {
      $match: {
        active: true,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | IMAGE AVAILABILITY
    |--------------------------------------------------------------------------
    |
    | These temporary fields help us select the strongest record for
    | each country.
    |
    */

    {
      $addFields: {
        _hasCountryImage: {
          $cond: [
            {
              $and: [
                {
                  $ne: ["$countryImage", null],
                },
                {
                  $ne: ["$countryImage", ""],
                },
              ],
            },
            1,
            0,
          ],
        },

        _hasOpportunityImage: {
          $cond: [
            {
              $and: [
                {
                  $ne: ["$image", null],
                },
                {
                  $ne: ["$image", ""],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
    },

    /*
    |--------------------------------------------------------------------------
    | PRIORITIZE THE BEST COUNTRY RECORD
    |--------------------------------------------------------------------------
    |
    | Priority:
    |
    | 1. Featured
    | 2. Real country image
    | 3. Opportunity image fallback
    | 4. Newest
    |
    |--------------------------------------------------------------------------
    */

    {
      $sort: {
        featured: -1,
        _hasCountryImage: -1,
        _hasOpportunityImage: -1,
        createdAt: -1,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | GROUP BY COUNTRY
    |--------------------------------------------------------------------------
    */

    {
      $group: {
        _id: "$countrySlug",

        /*
        |----------------------------------------------------------------------
        | COUNTRY SLUG
        |----------------------------------------------------------------------
        */

        slug: {
          $first: "$countrySlug",
        },

        /*
        |----------------------------------------------------------------------
        | COUNTRY NAME
        |----------------------------------------------------------------------
        */

        name: {
          $first: "$countryName",
        },

        /*
        |----------------------------------------------------------------------
        | COUNTRY FLAG
        |----------------------------------------------------------------------
        */

        flag: {
          $first: "$countryFlag",
        },

        /*
        |----------------------------------------------------------------------
        | COUNTRY IMAGE
        |----------------------------------------------------------------------
        |
        | Prefer countryImage.
        |
        | If it does not exist, fall back to the opportunity image.
        |
        | This is returned to CountryCard as `image`.
        |
        */

        image: {
          $first: {
            $cond: [
              {
                $and: [
                  {
                    $ne: ["$countryImage", null],
                  },
                  {
                    $ne: ["$countryImage", ""],
                  },
                ],
              },

              "$countryImage",

              {
                $cond: [
                  {
                    $and: [
                      {
                        $ne: ["$image", null],
                      },
                      {
                        $ne: ["$image", ""],
                      },
                    ],
                  },

                  "$image",

                  "",
                ],
              },
            ],
          },
        },

        /*
        |----------------------------------------------------------------------
        | APPLICANTS
        |----------------------------------------------------------------------
        */

        applicants: {
          $first: "$applicants",
        },

        /*
        |----------------------------------------------------------------------
        | COUNTRY CATEGORIES
        |----------------------------------------------------------------------
        */

        category: {
          $first: "$countryCategories",
        },

        /*
        |----------------------------------------------------------------------
        | VISA
        |----------------------------------------------------------------------
        */

        visa: {
          $first: "$countryVisa",
        },

        /*
        |----------------------------------------------------------------------
        | DURATION
        |----------------------------------------------------------------------
        */

        duration: {
          $first: "$countryDuration",
        },

        /*
        |----------------------------------------------------------------------
        | PROCESSING TIME
        |----------------------------------------------------------------------
        */

        processingTime: {
          $first: "$countryProcessingTime",
        },

        /*
        |----------------------------------------------------------------------
        | OPPORTUNITY SCORE
        |----------------------------------------------------------------------
        */

        opportunityScore: {
          $first: "$opportunityScore",
        },

        /*
        |----------------------------------------------------------------------
        | SUCCESS RATE
        |----------------------------------------------------------------------
        */

        successRate: {
          $first: "$successRate",
        },

        /*
        |----------------------------------------------------------------------
        | FEATURED
        |----------------------------------------------------------------------
        */

        featured: {
          $first: "$featured",
        },

        /*
        |----------------------------------------------------------------------
        | COUNTRY DESCRIPTION
        |----------------------------------------------------------------------
        */

        description: {
          $first: "$countryDescription",
        },
      },
    },

    /*
    |--------------------------------------------------------------------------
    | FINAL COUNTRY SORT
    |--------------------------------------------------------------------------
    */

    {
      $sort: {
        name: 1,
      },
    },
  ]);
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getAllOpportunities,

  getOpportunityBySlug,

  getOpportunityById,

  getCountries,
};
