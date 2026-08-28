const normalizeOpportunities = (country) => {
  if (!country) {
    return [];
  }

  const opportunities = country.opportunities || country.offers || [];

  return opportunities.map((opportunity) => ({
    ...opportunity,

    id: opportunity.id || opportunity._id || opportunity.slug,

    slug: opportunity.slug,

    name: opportunity.name || opportunity.title || "Migration Opportunity",

    title: opportunity.title || opportunity.name || "Migration Opportunity",

    description:
      opportunity.description ||
      opportunity.summary ||
      "Explore this migration pathway and discover whether it fits your goals.",

    image: opportunity.image || opportunity.thumbnail || country.image,

    country: country.name,

    countrySlug: country.slug,

    location: opportunity.location || country.name,

    category: opportunity.category || opportunity.type || "Work",

    type: opportunity.type || opportunity.category || "Work",

    duration:
      opportunity.duration ||
      opportunity.timeline ||
      country.duration ||
      "Varies",

    salary:
      opportunity.salary ||
      opportunity.salaryRange ||
      "Available upon assessment",

    visa: opportunity.visa || country.visa || "Varies",

    benefits: opportunity.benefits || opportunity.highlights || [],

    requirements: opportunity.requirements || [],

    positions: opportunity.positions || [],

    steps: opportunity.steps || opportunity.process || [],

    pricing: opportunity.pricing || null,

    paymentPlan: opportunity.paymentPlan || [],

    featured: Boolean(opportunity.featured || opportunity.isFeatured),
  }));
};

export default normalizeOpportunities;
