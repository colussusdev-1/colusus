/*
|--------------------------------------------------------------------------
| HUNGARY — COUNTRY AND OPPORTUNITY DATA
|--------------------------------------------------------------------------
|
| Source of truth for Hungary's catalogue metadata and offers.
|
| Rules:
| - Every country has a unique numeric ID.
| - Country identity belongs to this country definition.
| - Offer slugs are country-specific.
| - Offer IDs are local identifiers, not MongoDB ObjectIds.
| - Do not duplicate country metadata inside individual offers.
|
*/

const hungary = {
  /*
    |--------------------------------------------------------------------------
    | COUNTRY IDENTITY
    |--------------------------------------------------------------------------
    */

  id: 7,

  name: "Hungary",
  shortName: "Hungary",
  slug: "hungary",

  flag: "🇭🇺",

  /*
    |--------------------------------------------------------------------------
    | COUNTRY PRESENTATION
    |--------------------------------------------------------------------------
    */

  image: "",

  applicants: "1.3k",

  category: ["popular", "work", "residency"],

  visa: "Work Permit + Residence Card",
  duration: "3 Weeks - 4 Months",
  processingTime: "Flexible Processing",

  opportunityScore: "86%",
  successRate: "High",
  featured: false,

  description:
    "Explore seasonal and longer-term employment opportunities in Hungary, with job placement assistance, work authorization support and residence permit guidance, subject to employer availability and applicable immigration requirements.",

  /*
    |--------------------------------------------------------------------------
    | OPPORTUNITIES
    |--------------------------------------------------------------------------
    */

  opportunities: [
    {
      /*
            |--------------------------------------------------------------------------
            | OFFER IDENTITY
            |--------------------------------------------------------------------------
            */

      id: 1,

      title: "Hungary Flexible Work Permit Package",

      slug: "hungary-flexible-work-permit-package",

      /*
            |--------------------------------------------------------------------------
            | PRESENTATION
            |--------------------------------------------------------------------------
            */

      image: "",

      icon: "🇭🇺",

      category: "Jobs",

      location: "Hungary",

      type: "Work Permit + Residence Permit",

      duration: "3 Weeks - 4 Months",

      /*
            |--------------------------------------------------------------------------
            | EMPLOYMENT INFORMATION
            |--------------------------------------------------------------------------
            */

      salary: "€700 - €1,400+/month",

      demand: "High",

      description:
        "Explore seasonal and longer-term employment opportunities in Hungary across construction and agriculture. The package includes employment matching assistance, work authorization support and guidance on residence requirements. Actual employment conditions depend on the employer and the agreed contract.",

      /*
            |--------------------------------------------------------------------------
            | HIGHLIGHTS
            |--------------------------------------------------------------------------
            */

      highlights: [
        "Employment Offer Support",
        "Work Authorization Processing Support",
        "Residence Permit Guidance",
        "Employer Accommodation, Subject to Agreement",
        "Seasonal and Longer-Term Work Opportunities",
      ],

      /*
            |--------------------------------------------------------------------------
            | AVAILABLE POSITIONS
            |--------------------------------------------------------------------------
            */

      positions: [
        {
          sector: "Construction",

          salary: "From €1,400/month",

          roles: [
            "General Workers",
            "Laborers",
            "Concrete Workers",
            "Rebar Workers",
            "Carpenters",
            "Assembly Workers",
            "Electricians",
            "Low-Voltage Assemblers",
            "Welders",
            "Tile Layers",
            "Plasterers",
            "Painters",
            "Finishers",
            "Electrical Installers",
            "Plumbing Equipment Installers",
          ],

          notes: ["Driver's license preferred for some roles."],
        },

        {
          sector: "Agriculture Seasonal Work",

          roles: [
            "Agricultural Workers",
            "Fruit Harvesters",
            "Vegetable Harvesters",
            "Farm Workers",
          ],

          workingHours: "06:00 - 16:00 (5 days/week)",

          notes: [
            "Extra hours and Saturdays may be available.",
            "Meals are paid for by the employee unless otherwise agreed.",
            "Accommodation is subject to the employer's agreement.",
          ],
        },
      ],

      /*
            |--------------------------------------------------------------------------
            | BENEFITS
            |--------------------------------------------------------------------------
            */

      benefits: [
        "Employer Accommodation, Subject to Agreement",
        "Seasonal and Longer-Term Work Options",
        "Residence Permit Process Guidance",
        "Potential Overtime Opportunities, Subject to Contract",
        "Opportunities Across Skilled and General Labour Roles",
      ],

      /*
            |--------------------------------------------------------------------------
            | REQUIREMENTS
            |--------------------------------------------------------------------------
            */

      requirements: [
        "Valid International Passport",
        "Updated CV / Resume",
        "Digital Passport Photograph",
        "Educational Certificates, where required for the role or contract",
        "Proof of Work Experience, where required",
        "Police Clearance Certificate, where required",
        "Additional documents required by the employer or relevant authorities",
        "Eligibility for the applicable Hungarian employment and immigration pathway",
      ],

      /*
            |--------------------------------------------------------------------------
            | PUBLIC DOCUMENT LIST
            |--------------------------------------------------------------------------
            */

      documents: [
        "International Passport",
        "CV / Resume",
        "Passport Photograph",
        "Educational Certificates, where applicable",
        "Employment Records, where applicable",
        "Police Clearance Certificate, where required",
        "Additional Supporting Documents, where required",
      ],

      /*
            |--------------------------------------------------------------------------
            | MIGRATION JOURNEY
            |--------------------------------------------------------------------------
            */

      steps: [
        {
          title: "Document Screening",

          description:
            "Review the applicant's identity documents, experience and eligibility for the selected employment opportunity.",
        },

        {
          title: "Employer Matching",

          description:
            "Assess the applicant's profile against available Hungarian employment opportunities.",
        },

        {
          title: "Employment Offer",

          description:
            "Review the proposed job offer, employment contract, salary and working conditions.",
        },

        {
          title: "Work Authorization Processing",

          description:
            "Prepare and process the applicable employment and work authorization documentation.",
        },

        {
          title: "Visa or Entry Procedure",

          description:
            "Complete the applicable visa or entry procedures and submit any required supporting documents.",
        },

        {
          title: "Residence Formalities",

          description:
            "Complete the relevant residence permit or registration requirements under the applicable immigration pathway.",
        },

        {
          title: "Travel Preparation",

          description:
            "Prepare relocation arrangements after the necessary approvals have been obtained.",
        },
      ],

      /*
            |--------------------------------------------------------------------------
            | PRICING
            |--------------------------------------------------------------------------
            */

      pricing: {
        total: "₦8,000,000",

        currency: "NGN",

        includes: [
          "Work Authorization Processing Support",
          "Employment Placement Assistance",
          "Visa Application Support",
          "Job Matching",
          "Documentation Assistance",
        ],
      },

      /*
            |--------------------------------------------------------------------------
            | PAYMENT PLAN
            |--------------------------------------------------------------------------
            */

      paymentPlan: [
        {
          stage: "Migration Agreement Signing",

          amount: "₦2,000,000",
        },

        {
          stage: "Job Offer Letter + Employment Contract",

          amount: "₦3,000,000",
        },

        {
          stage: "Visa Approval & Completion",

          amount: "₦3,000,000",
        },
      ],

      /*
            |--------------------------------------------------------------------------
            | TERMS AND CONDITIONS
            |--------------------------------------------------------------------------
            */

      terms: [
        "Applicants must provide genuine documents for verification.",
        "Processing begins after agreement signing and the required document screening.",
        "Employment placement depends on employer availability and successful recruitment.",
        "Accommodation arrangements are subject to the employer's written agreement.",
        "Employment conditions must be confirmed in the signed employment contract.",
        "Work authorization and visa decisions are made by the relevant authorities.",
        "Processing times are estimates and are not guaranteed.",
        "Payment milestones and the services included must be documented in the signed agreement.",
      ],
    },
  ],
};

export default hungary;
