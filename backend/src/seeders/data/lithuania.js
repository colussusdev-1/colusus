/*
|--------------------------------------------------------------------------
| LITHUANIA — COUNTRY AND OPPORTUNITY DATA
|--------------------------------------------------------------------------
|
| Source of truth for Lithuania's catalogue metadata and offers.
|
| Rules:
| - Every country has a unique numeric ID.
| - Country identity belongs to this country definition.
| - Offer slugs are country-specific.
| - Offer IDs are local identifiers, not MongoDB ObjectIds.
|
*/

const lithuania = {
  // COUNTRY IDENTITY

  id: 10,

  name: "Lithuania",
  shortName: "Lithuania",
  slug: "lithuania",

  flag: "🇱🇹",

  // COUNTRY PRESENTATION

  image: "",

  applicants: "980",

  category: ["popular", "work", "residency"],

  visa: "Residence Permit + Work Authorization",
  duration: "3–6 Weeks",
  processingTime: "Fast Processing",

  opportunityScore: "88%",
  successRate: "High",
  featured: false,

  description:
    "Explore employment opportunities in Lithuania across construction and agriculture, with employer recruitment assistance, work authorization support, accommodation arrangements and relocation guidance, subject to employer terms and applicable immigration requirements.",

  // OPPORTUNITIES

  opportunities: [
    {
      // OFFER IDENTITY

      id: 1,

      title: "Lithuania Residency Work Permit Program",

      slug: "lithuania-residency-work-permit-program",

      // PRESENTATION

      image: "",

      icon: "🇱🇹",

      category: "Jobs",

      location: "Lithuania",

      type: "Residence Permit + Work Authorization",

      duration: "3–6 Weeks",

      salary: "€1,400 - €2,200/month",

      demand: "High",

      description:
        "Explore employment opportunities in Lithuania through construction and agricultural roles. The package includes recruitment assistance, work authorization guidance, accommodation arrangements and relocation support. Actual employment conditions and immigration outcomes depend on the employer, applicant eligibility and applicable requirements.",

      // HIGHLIGHTS

      highlights: [
        "Work Authorization Support",
        "Residence Permit Guidance",
        "Employment Opportunities",
        "Accommodation Arrangements, Subject to Employer Agreement",
        "Meals, Subject to Employer Agreement",
        "Relocation Assistance",
      ],

      // WORK CONDITIONS

      workConditions: {
        hours: "8–12 Hours Per Day",
      },

      // AVAILABLE POSITIONS

      positions: [
        {
          sector: "Construction",

          roles: [
            "Masons / Bricklayers",
            "Concrete Workers",
            "Concrete Fitters",
            "Joiners / Carpenters",
            "Window & Door Installers",
            "Scaffolding Installers",
            "Road Repairers",
            "Asphalt Pavers",
            "Tilers",
            "Tile Decorators",
            "Plasterers",
            "Drywall Installers",
            "Insulators",
            "Thermal Insulation Installers",
          ],
        },

        {
          sector: "Agriculture",

          roles: [
            "Fruit Pickers",
            "Vegetable Harvesters",
            "Greenhouse Workers",
            "Farm Labourers",
            "Crop Processing Workers",
            "Berry Pickers",
          ],
        },
      ],

      // BENEFITS

      benefits: [
        "Accommodation, Subject to Employer Agreement",
        "Meals, Subject to Employer Agreement",
        "Work Clothes and Tools, Subject to Employer Agreement",
        "Health Insurance According to Applicable Requirements and Employment Terms",
        "Transportation to the Workplace, Subject to Employer Agreement",
        "Potential Competitive Hourly Rates",
        "Potential Long-Term Residence Options, Subject to Eligibility",
      ],

      // REQUIREMENTS

      requirements: [
        "Valid International Passport",
        "Ability to meet the requirements of the selected occupation",
        "Physical fitness where required by the role",
        "Basic English communication or willingness to learn, where applicable",
        "Relevant experience or qualifications where required by the employer",
        "Eligibility for the applicable employment and immigration pathway",
      ],

      // PUBLIC DOCUMENT LIST

      documents: [
        "Valid International Passport",
        "Criminal Record Certificate / Police Clearance, where required",
        "Medical Fitness Certificate, where required",
        "Updated CV / Resume",
        "Educational Diploma or Certificates, where applicable",
        "Passport-size Photographs",
        "Additional documents required by the employer or relevant authorities",
      ],

      // MIGRATION JOURNEY

      steps: [
        {
          title: "Eligibility Assessment",

          description:
            "Review the applicant's qualifications, experience and suitability for available employment opportunities.",
        },

        {
          title: "Occupation Selection",

          description:
            "Identify suitable occupations based on the applicant's profile and available employer requirements.",
        },

        {
          title: "Document Preparation",

          description:
            "Review and prepare the documents required for the selected employment and immigration pathway.",
        },

        {
          title: "Employer Matching",

          description:
            "Submit the applicant's profile to suitable Lithuanian employers for consideration.",
        },

        {
          title: "Employment Offer & Work Authorization",

          description:
            "Review the employment offer and contract, then prepare the applicable work authorization documentation.",
        },

        {
          title: "Visa and Residence Procedures",

          description:
            "Complete the applicable visa and residence procedures and submit the required supporting documents.",
        },

        {
          title: "Relocation Preparation",

          description:
            "Prepare travel and relocation arrangements after the necessary approvals have been obtained.",
        },
      ],

      // PRICING

      pricing: {
        total: "₦8,000,000",

        currency: "NGN",

        includes: [
          "Employment Placement Assistance",
          "Work Authorization Processing Support",
          "Residence Permit Support",
          "Visa Application Support",
          "Documentation Assistance",
        ],
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
        "Applicants must meet the applicable eligibility requirements and provide genuine documents.",
        "Processing begins after agreement signing and the required document verification.",
        "Employment placement depends on employer availability and successful recruitment.",
        "Accommodation and meals depend on the employer's written agreement.",
        "Working hours, overtime and employment conditions must be confirmed in the employment contract.",
        "Work authorization and visa decisions are made by the relevant authorities.",
        "Processing times are estimates and are not guaranteed.",
        "Long-term residence eligibility depends on the applicable rules and individual circumstances.",
        "Payment milestones and included services must be documented in the signed agreement.",
      ],
    },
  ],
};

export default lithuania;
