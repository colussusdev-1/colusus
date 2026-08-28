import countries from "../../../pages/Home/sections/Countries/countriesData";

import { createOpportunityPool } from "./normalizer";

/*
|--------------------------------------------------------------------------
| BUILD OPPORTUNITY POOL
|--------------------------------------------------------------------------
*/

const opportunities = createOpportunityPool(countries);

/*
|--------------------------------------------------------------------------
| GET ALL OPPORTUNITIES
|--------------------------------------------------------------------------
*/

export const getOpportunityPool = () => {
  return opportunities;
};

/*
|--------------------------------------------------------------------------
| GET COUNT
|--------------------------------------------------------------------------
*/

export const getOpportunityCount = () => {
  return opportunities.length;
};

/*
|--------------------------------------------------------------------------
| GET OPPORTUNITY
|--------------------------------------------------------------------------
*/

export const getOpportunityById = (countryId, opportunityId) => {
  return opportunities.find(
    (opportunity) =>
      String(opportunity.countryId) === String(countryId) &&
      String(opportunity.id) === String(opportunityId),
  );
};

/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getOpportunityPool,

  getOpportunityCount,

  getOpportunityById,
};
