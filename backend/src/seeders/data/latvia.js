/*
|--------------------------------------------------------------------------
| LATVIA — COUNTRY AND OPPORTUNITY DATA
|--------------------------------------------------------------------------
|
| Source of truth for Latvia's catalogue metadata and offers.
|
| Rules:
| - Every country has a unique numeric ID.
| - Country identity belongs to this country definition.
| - Offer slugs are country-specific.
| - Offer IDs are local identifiers, not MongoDB ObjectIds.
|
*/

const latvia = {
  // COUNTRY IDENTITY

  id: 9,

  name: "Latvia",
  shortName: "Latvia",
  slug: "latvia",

  flag: "🇱🇻",

  // COUNTRY PRESENTATION

  image: "",

  applicants: "850",

  category: ["popular", "work", "residency"],

  visa: "Work Permit + Residence Permit",
  duration: "4 Weeks",
  processingTime: "Fast",

  opportunityScore: "88%",
  successRate: "High",
  featured: false,

  description:
    "Explore employment opportunities in Latvia with employer-supported recruitment, work authorization assistance, residence permit guidance and relocation support, subject to employer availability and applicable requirements.",

  // OPPORTUNITIES

  opportunities: [
    {
      // OFFER IDENTITY

      id: 1,

      title: "Latvia Work Permit & Residence Card Program",

      slug: "latvia-work-permit-residence-card-program",

      // PRESENTATION

      image: "",

      icon: "🇱🇻",

      category: "Jobs",

      type: "Work Permit + Residence Permit",

      location: "Riga, Latvia",

      salary: "€1,200 - €2,500 Net / Month",

      duration: "Approximately 4 Weeks",

      demand: "High",

      description:
        "Explore employment opportunities in Latvia with recruitment assistance, work authorization processing support, residence permit guidance, accommodation arrangements and relocation assistance. Employment conditions and immigration outcomes depend on the employer, applicant eligibility and applicable requirements.",

      // HIGHLIGHTS

      highlights: [
        "Work Authorization Support",
        "Residence Permit Guidance",
        "Full-Time Employment Opportunities",
        "Accommodation Arrangements, Subject to Employer Agreement",
        "Transportation Support, Subject to Employer Agreement",
        "Visa Application Support",
      ],

      // AVAILABLE POSITIONS

      positions: [
        {
          title: "Quality Control Inspector",

          category: "Quality Control",

          description:
            "Inspect finished products, maintain production standards and support quality compliance.",
        },

        {
          title: "Construction Worker",

          category: "Construction",

          description:
            "Support construction operations, including material handling, site preparation and installation work.",
        },

        {
          title: "Cleaner",

          category: "Cleaning & Maintenance",

          description:
            "Maintain commercial or residential facilities and operate appropriate cleaning equipment.",
        },
      ],

      // BENEFITS

      benefits: [
        "Work Authorization Application Support",
        "Residence Permit Process Guidance",
        "Employment Opportunities",
        "Accommodation Assistance, Subject to Employer Agreement",
        "Transportation to Work, Subject to Employer Agreement",
        "Potential Longer-Term Employment",
        "Visa Application Support",
      ],

      // REQUIREMENTS

      requirements: [
        "Valid International Passport",
        "Updated CV / Resume",
        "Completed Application Form",
        "Ability to meet the health and physical requirements of the selected role",
        "Eligibility for the applicable employment and immigration pathway",
        "Additional qualifications or experience required by the employer",
      ],

      // PUBLIC DOCUMENT LIST

      documents: [
        "Valid International Passport",
        "CV / Resume",
        "Completed Application Form",
        "Employment Documents, where available",
        "Medical Certificate, where required",
        "Additional Supporting Documents Required by the Employer or Authorities",
      ],

      // MIGRATION JOURNEY

      steps: [
        {
          title: "Eligibility Assessment",

          description:
            "Review the applicant's profile, relevant experience and suitability for available employment opportunities.",
        },

        {
          title: "Occupation Selection",

          description:
            "Identify suitable job categories based on employer requirements and the applicant's profile.",
        },

        {
          title: "Document Preparation",

          description:
            "Review and prepare the identity, employment and supporting documents required for the selected pathway.",
        },

        {
          title: "Employer Matching",

          description:
            "Submit the applicant's profile for consideration by suitable Latvian employers.",
        },

        {
          title: "Employment Offer & Work Authorization",

          description:
            "Review the employment offer and prepare the applicable work authorization documentation.",
        },

        {
          title: "Visa and Residence Procedures",

          description:
            "Complete the applicable visa, residence permit and consular procedures.",
        },

        {
          title: "Relocation Preparation",

          description:
            "Prepare relocation arrangements after the required approvals have been obtained.",
        },
      ],

      // PRICING

      pricing: {
        total: "₦8,000,000",

        currency: "NGN",
      },

      // PAYMENT PLAN

      paymentPlan: [
        {
          stage: "Migration Agreement Signing",

          amount: "₦2,000,000",
        },

        {
          stage:
            "Job Offer + Employment Contract + Work Authorization Milestone",

          amount: "₦3,000,000",
        },

        {
          stage: "Visa Approval & Travel Preparation",

          amount: "₦3,000,000",
        },
      ],

      // TERMS AND CONDITIONS

      terms: [
        "Applicants must provide genuine and valid documents for verification.",
        "Processing begins after agreement signing and the required document screening.",
        "Employment placement depends on employer availability and successful recruitment.",
        "Accommodation and transportation arrangements are subject to the employer's written agreement.",
        "Employment terms must be confirmed in the employment contract.",
        "Work authorization and visa decisions are made by the relevant authorities.",
        "Processing times are estimates and are not guaranteed.",
        "Payment milestones and included services must be documented in the signed agreement.",
      ],
    },
  ],
};

export default latvia;
