/*
|--------------------------------------------------------------------------
| OPPORTUNITY NORMALIZER
|--------------------------------------------------------------------------
|
| Converts:
|
| Country
|   └── opportunities[]
|
| into:
|
| Opportunity
| Opportunity
| Opportunity
| Opportunity
|
| Every opportunity keeps its country information so the UI can navigate
| to the existing pathway page.
|--------------------------------------------------------------------------
*/

const normalizeText = (value) => {
  if (!value) return "";

  return String(value).toLowerCase().trim();
};

const flattenPositions = (positions = []) => {
  if (!Array.isArray(positions)) {
    return [];
  }

  return positions.flatMap((position) => {
    if (!position) {
      return [];
    }

    return [
      position.title,
      position.sector,
      position.category,
      position.description,
      ...(Array.isArray(position.roles) ? position.roles : []),
    ].filter(Boolean);
  });
};

const normalizeOpportunity = (opportunity, country) => {
  const searchable = [
    opportunity.title,

    opportunity.category,

    opportunity.type,

    opportunity.location,

    opportunity.description,

    opportunity.salary,

    opportunity.demand,

    ...(opportunity.highlights || []),

    ...(opportunity.benefits || []),

    ...(opportunity.requirements || []),

    ...flattenPositions(opportunity.positions),
  ]
    .filter(Boolean)
    .map(normalizeText)
    .join(" ");

  return {
    ...opportunity,

    countryId: country.id,

    countryName: country.name,

    countryShortName: country.shortName,

    countrySlug: country.slug,

    countryFlag: country.flag,

    countryImage: country.image,

    searchable,
  };
};

export const createOpportunityPool = (countries = []) => {
  if (!Array.isArray(countries)) {
    return [];
  }

  return countries.flatMap((country) => {
    if (!country) {
      return [];
    }

    if (!Array.isArray(country.opportunities)) {
      return [];
    }

    return country.opportunities.map((opportunity) =>
      normalizeOpportunity(opportunity, country),
    );
  });
};

export default createOpportunityPool;
