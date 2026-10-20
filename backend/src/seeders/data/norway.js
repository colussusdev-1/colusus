/*
|--------------------------------------------------------------------------
| NORWAY — COUNTRY AND OPPORTUNITY DATA
|--------------------------------------------------------------------------
|
| Source of truth for Norway's catalogue metadata and offers.
|
| Rules:
| - Every country has a unique numeric ID.
| - Country identity belongs to this country definition.
| - Offer slugs are country-specific.
| - Offer IDs are local identifiers, not MongoDB ObjectIds.
|
*/

const norway = {
  // COUNTRY IDENTITY

  id: 11,

  name: "Norway",
  shortName: "Norway",
  slug: "norway",

  flag: "🇳🇴",

  // COUNTRY PRESENTATION

  image: "",

  applicants: "420",

  category: ["premium", "work", "residency"],

  visa: "Work Permit + Residence Permit Support",
  duration: "Employer & Immigration Processing",
  processingTime: "Standard",

  opportunityScore: "94%",
  successRate: "High",
  featured: true,

  description:
    "Explore employment opportunities in Norway with employer-supported recruitment, work authorization assistance, accommodation arrangements and relocation guidance, subject to employer terms and applicable immigration requirements.",

  // OPPORTUNITIES

  opportunities: [
    {
      // OFFER IDENTITY

      id: 1,

      title: "Norway Work Permit Migration Package",

      slug: "norway-work-permit-migration-package",

      // PRESENTATION

      image: "",

      icon: "🇳🇴",

      category: "Jobs",

      location: "Norway",

      type: "Work Permit + Residence Permit",

      duration: "Document Preparation: 10–15 Days",

      salary: "€3,200 - €4,800 Net / Month",

      demand: "High",

      description:
        "Explore seafood production employment opportunities in Norway with recruitment assistance, work authorization support, accommodation arrangements and relocation guidance. Employment terms, salary and immigration outcomes depend on the employer, applicant eligibility and the applicable requirements.",

      // HIGHLIGHTS

      highlights: [
        "Employment Offer Support",
        "Work Authorization Processing Support",
        "Residence Permit Guidance",
        "Employer Accommodation, Subject to Agreement",
        "Flight Arrangement Assistance",
      ],

      // BENEFITS

      benefits: [
        "Employment Placement Assistance",
        "Work Authorization Processing Support",
        "Residence Permit Guidance",
        "Employer-Provided Accommodation, Subject to Agreement",
        "Flight Arrangement Assistance",
        "Meals During Working Hours, Subject to Employer Agreement",
        "Local Transportation Support, Subject to Employer Agreement",
        "Work Clothes Support, Subject to Employer Agreement",
        "Overtime According to Applicable Norwegian Labour Rules and Employment Terms",
      ],

      // AVAILABLE POSITIONS

      positions: [
        {
          sector: "Seafood Production",

          roles: [
            "Seafood Production Line Worker",
            "Fish Processing Worker",
            "Packaging Worker",
            "Quality Control Assistant",
          ],

          description:
            "Work in seafood processing facilities supporting production, packaging and quality control activities.",
        },
      ],

      // WORK CONDITIONS

      workConditions: [
        "Working Hours: 120–160 Hours Per Month, Subject to the Employment Contract",
        "Probation Period: 3 Months, Where Agreed and Permitted",
        "Accommodation: Subject to Employer Agreement",
        "Meals During Working Hours: Subject to Employer Agreement",
        "Overtime: Subject to Applicable Labour Rules and Employment Terms",
      ],

      // REQUIREMENTS

      requirements: [
        "Updated CV / Resume",
        "Passport Photograph",
        "Valid International Passport",
        "Proof of Funds, Where Required",
        "Valid Supporting Documents",
        "Ability to meet the requirements of the selected position",
        "Eligibility for the applicable employment and immigration pathway",
      ],

      // PUBLIC DOCUMENT LIST

      documents: [
        "Valid International Passport",
        "CV / Resume",
        "Passport Photograph",
        "Employment Offer or Contract, Where Available",
        "Additional Documents Required by the Employer or Relevant Authorities",
      ],

      // MIGRATION JOURNEY

      steps: [
        {
          title: "Document Submission",

          description:
            "Submit the required documents for initial eligibility screening and profile assessment.",
        },

        {
          title: "Migration Agreement",

          description:
            "Review and sign the Migration Service Agreement, including the scope of services, fees and payment milestones.",
        },

        {
          title: "Employer Matching",

          description:
            "Assess the applicant's profile against available Norwegian employment opportunities.",
        },

        {
          title: "Job Offer & Work Authorization",

          description:
            "Review the employment offer and contract, then prepare the applicable work authorization documentation.",
        },

        {
          title: "Visa and Residence Procedures",

          description:
            "Complete the applicable visa, residence permit and consular procedures.",
        },

        {
          title: "Travel Preparation",

          description:
            "Prepare travel and relocation arrangements after the necessary approvals have been obtained.",
        },
      ],

      // PRICING

      pricing: {
        total: "₦10,000,000",

        currency: "NGN",

        includes: [
          "Job Placement Assistance",
          "Work Authorization Processing Support",
          "Residence Permit Support",
          "Visa Application Support",
          "Relocation Assistance",
        ],
      },

      // PAYMENT PLAN

      paymentPlan: [
        {
          stage: "After Migration Service Agreement Signing",

          amount: "₦3,000,000",
        },

        {
          stage:
            "After Job Offer, Employment Contract, Accommodation Details & Work Authorization Milestone",

          amount: "₦3,000,000",
        },

        {
          stage: "After Visa Approval & Travel Readiness",

          amount: "₦4,000,000",
        },
      ],

      // TERMS AND CONDITIONS

      terms: [
        "Applicants must meet the applicable eligibility requirements and provide genuine documents.",
        "Processing begins after agreement signing and the required document verification.",
        "Employment placement depends on employer availability and successful recruitment.",
        "Accommodation and other employment benefits are subject to the employer's written agreement.",
        "Salary, currency, working hours and other employment conditions must be confirmed in the employment contract.",
        "Work authorization and visa decisions are made by the relevant authorities.",
        "Processing times are estimates and are not guaranteed.",
        "Payment milestones and included services must be documented in the signed agreement.",
      ],
    },
  ],
};

export default norway;
