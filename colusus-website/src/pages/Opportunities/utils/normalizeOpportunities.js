const normalizeOpportunities = (country, opportunities = null) => {
  if (!country) {
    return [];
  }

  /*
    ============================================================
    SOURCE
    ============================================================
    New MongoDB flow passes opportunities directly.

    We keep support for the old country.opportunities / country.offers
    structure so existing components do not break while the migration
    from static data to MongoDB is completed.
    */

  const source = Array.isArray(opportunities)
    ? opportunities
    : country.opportunities || country.offers || [];

  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((opportunity) => ({
    /*
        ============================================================
        PRESERVE THE COMPLETE MONGODB OPPORTUNITY
        ============================================================
        Do not strip fields such as:
        pricing
        paymentPlan
        applicationConfig
        faq
        workConditions
        contract
        documents
        terms
        positions
        etc.
        */

    ...opportunity,

    /*
        ============================================================
        IDENTIFIERS
        ============================================================
        */

    id: opportunity.id || opportunity._id || opportunity.slug,

    _id: opportunity._id,

    slug: opportunity.slug,

    /*
        ============================================================
        DISPLAY NAME
        ============================================================
        */

    name: opportunity.name || opportunity.title || "Migration Opportunity",

    title: opportunity.title || opportunity.name || "Migration Opportunity",

    /*
        ============================================================
        DESCRIPTION
        ============================================================
        */

    description:
      opportunity.description ||
      opportunity.summary ||
      "Explore this migration pathway and discover whether it fits your goals.",

    /*
        ============================================================
        IMAGE
        ============================================================
        */

    image:
      opportunity.image ||
      opportunity.thumbnail ||
      country.image ||
      country.countryImage ||
      "",

    /*
        ============================================================
        COUNTRY
        ============================================================
        */

    country:
      opportunity.country ||
      opportunity.countryName ||
      country.name ||
      country.countryName ||
      "",

    countryName:
      opportunity.countryName || country.name || country.countryName || "",

    countrySlug: opportunity.countrySlug || country.slug || "",

    countryFlag: opportunity.countryFlag || country.flag || "",

    /*
        ============================================================
        LOCATION
        ============================================================
        */

    location: opportunity.location || country.name || country.countryName || "",

    /*
        ============================================================
        CATEGORY / TYPE
        ============================================================
        */

    category: opportunity.category || opportunity.type || "Work",

    type: opportunity.type || opportunity.category || "Work",

    /*
        ============================================================
        DURATION
        ============================================================
        */

    duration:
      opportunity.duration ||
      opportunity.timeline ||
      country.duration ||
      country.countryDuration ||
      "Varies",

    /*
        ============================================================
        SALARY
        ============================================================
        */

    salary:
      opportunity.salary ||
      opportunity.salaryRange ||
      "Available upon assessment",

    /*
        ============================================================
        VISA
        ============================================================
        */

    visa: opportunity.visa || country.visa || country.countryVisa || "Varies",

    /*
        ============================================================
        BENEFITS
        ============================================================
        */

    benefits: Array.isArray(opportunity.benefits)
      ? opportunity.benefits
      : Array.isArray(opportunity.highlights)
        ? opportunity.highlights
        : [],

    highlights: Array.isArray(opportunity.highlights)
      ? opportunity.highlights
      : Array.isArray(opportunity.benefits)
        ? opportunity.benefits
        : [],

    /*
        ============================================================
        REQUIREMENTS
        ============================================================
        */

    requirements: Array.isArray(opportunity.requirements)
      ? opportunity.requirements
      : [],

    /*
        ============================================================
        DOCUMENTS
        ============================================================
        */

    documents: Array.isArray(opportunity.documents)
      ? opportunity.documents
      : [],

    /*
        ============================================================
        POSITIONS
        ============================================================
        */

    positions: Array.isArray(opportunity.positions)
      ? opportunity.positions
      : [],

    /*
        ============================================================
        PROCESS / STEPS
        ============================================================
        */

    steps: Array.isArray(opportunity.steps)
      ? opportunity.steps
      : Array.isArray(opportunity.process)
        ? opportunity.process
        : [],

    /*
        ============================================================
        PRICING
        ============================================================
        */

    pricing: opportunity.pricing || null,

    paymentPlan: Array.isArray(opportunity.paymentPlan)
      ? opportunity.paymentPlan
      : [],

    /*
        ============================================================
        WORK / CONTRACT INFORMATION
        ============================================================
        */

    workConditions: opportunity.workConditions || null,

    contract: opportunity.contract || "",

    /*
        ============================================================
        FAQ
        ============================================================
        */

    faq: Array.isArray(opportunity.faq) ? opportunity.faq : [],

    /*
        ============================================================
        APPLICATION CONFIG
        ============================================================
        */

    applicationConfig: opportunity.applicationConfig || {
      steps: ["DOCUMENTS", "REVIEW"],
      questions: [],
      requiredDocuments: [],
      workflow: [],
    },

    /*
        ============================================================
        TERMS
        ============================================================
        */

    terms: Array.isArray(opportunity.terms) ? opportunity.terms : [],

    /*
        ============================================================
        FEATURED
        ============================================================
        */

    featured: Boolean(opportunity.featured || opportunity.isFeatured),

    /*
        ============================================================
        ACTIVE
        ============================================================
        */

    active: opportunity.active !== false,
  }));
};

export default normalizeOpportunities;
