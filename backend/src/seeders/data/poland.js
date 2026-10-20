/*
|--------------------------------------------------------------------------
| POLAND — COUNTRY AND OPPORTUNITY DATA
|--------------------------------------------------------------------------
|
| Source of truth for Poland's catalogue metadata and offers.
|
| Rules:
| - Every country has a unique numeric ID.
| - Country identity belongs to this country definition.
| - Offer slugs are country-specific.
| - Offer IDs are local identifiers, not MongoDB ObjectIds.
|
*/

const poland = {
  // COUNTRY IDENTITY

  id: 12,

  name: "Poland",
  shortName: "Poland",
  slug: "poland",

  flag: "🇵🇱",

  // COUNTRY PRESENTATION

  image: "",

  applicants: "2.1k",

  category: ["popular", "work"],

  visa: "Work Permit",
  duration: "3–6 Weeks",
  processingTime: "Fast",

  opportunityScore: "90%",
  successRate: "High",
  featured: true,

  description:
    "Explore employer-supported employment opportunities in Poland across warehouse, factory and agricultural sectors, with recruitment assistance, work authorization support, accommodation arrangements and relocation guidance.",

  // OPPORTUNITIES

  opportunities: [
    {
      // OFFER IDENTITY

      id: 1,

      title: "Poland Work Permit Migration Package",

      slug: "poland-work-permit-migration-package",

      // PRESENTATION

      image: "",

      icon: "🇵🇱",

      category: "Jobs",

      location: "Poland",

      type: "Work Permit Package",

      duration: "3–6 Weeks",

      salary: "€1,100 – €1,500/month",

      demand: "High",

      description:
        "Explore employment opportunities in Poland with employer matching, work authorization application support, accommodation arrangements and potential roles across warehouse, factory and agricultural sectors. Actual employment terms depend on the employer and the agreed employment contract.",

      // HIGHLIGHTS

      highlights: [
        "Employment Offer Support",
        "Work Authorization Application Support",
        "Accommodation Arrangements, Subject to Employer Agreement",
        "Multiple Employment Sectors",
        "Flight Arrangement Assistance",
      ],

      // AVAILABLE POSITIONS

      positions: [
        {
          sector: "Warehouses",

          image: "",

          roles: [
            "Product Packers",
            "Scanner Operators",
            "Electric Trolley Operators",
          ],
        },

        {
          sector: "Factories",

          image: "",

          roles: [
            "Assembly Line Workers",
            "Quality Control Staff",
            "Small Parts Assembly Workers",
          ],
        },

        {
          sector: "Agriculture",

          image: "",

          roles: ["Farm Workers", "Fruit Pickers", "Vegetable Packers"],
        },
      ],

      // BENEFITS

      benefits: [
        "Work Authorization Application Support",
        "Accommodation, Subject to Employer Agreement",
        "Potential Six-Day Working Schedule, Subject to Contract",
        "Working Hours as Specified in the Employment Contract",
        "Transportation to and from Work, Where Agreed",
        "Employment Opportunities Across Multiple Sectors",
        "Flight Arrangement Assistance",
      ],

      // REQUIREMENTS

      requirements: [
        "Valid International Passport",
        "Updated CV / Resume",
        "Ability to communicate in English where required by the employer",
        "Ability to meet the physical requirements of the selected role",
        "Relevant experience or qualifications where required",
        "Eligibility for the applicable employment and immigration pathway",
      ],

      // PUBLIC DOCUMENT LIST

      documents: [
        "Valid International Passport",
        "Updated CV / Resume",
        "Passport Photograph",
        "Educational Certificates, where available or required",
        "Work Experience Documents, where available or required",
        "Additional documents required by the employer or relevant authorities",
      ],

      // MIGRATION JOURNEY

      steps: [
        {
          title: "Document Submission",

          description:
            "Submit the required documents for initial eligibility screening and profile assessment.",
        },

        {
          title: "Migration Service Agreement",

          description:
            "Review and sign the Migration Service Agreement, including the scope of services, fees and payment milestones.",
        },

        {
          title: "Employer Matching",

          description:
            "Assess the applicant's profile against available positions and employer requirements.",
        },

        {
          title: "Job Offer & Work Authorization",

          description:
            "Review the employment contract and prepare the applicable work authorization documentation.",
        },

        {
          title: "Visa Application",

          description:
            "Prepare and submit the applicable visa application and complete the required consular procedures.",
        },

        {
          title: "Travel Preparation",

          description:
            "Prepare relocation arrangements after the necessary approvals have been obtained.",
        },
      ],

      // PRICING

      pricing: {
        total: "₦8,000,000",

        currency: "NGN",

        includes: [
          "Job Placement Assistance",
          "Employer Matching",
          "Work Authorization Processing Support",
          "Visa Application Support",
          "Flight Arrangement Assistance",
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
            "Job Offer + Employment Contract + Accommodation + Work Authorization Milestone",

          amount: "₦3,000,000",
        },

        {
          stage: "Visa Approval & Travel Readiness",

          amount: "₦3,000,000",
        },
      ],

      // TERMS AND CONDITIONS

      terms: [
        "Applicants must meet the applicable eligibility requirements and provide genuine documents.",
        "Processing begins after the Migration Service Agreement is signed and the required initial screening is completed.",
        "Employment placement depends on employer availability and successful recruitment.",
        "Accommodation arrangements are subject to the employer's written agreement.",
        "Working hours, salary, overtime and other employment conditions must be confirmed in the employment contract.",
        "Work authorization and visa decisions are made by the relevant authorities.",
        "Processing times are estimates and are not guaranteed.",
        "Payment milestones and included services must be documented in the signed agreement.",
      ],
    },
  ],
};

export default poland;
