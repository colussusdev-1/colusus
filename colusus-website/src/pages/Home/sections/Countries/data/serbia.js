import serbiaImage from "../../../../../assets/images/countries/serbia.jpg";
import serbiaWorkImage from "../../../../../assets/images/opportunities/serbia-warehouse.jpg";

const serbia = {
  id: 2,

  name: "Serbia",

  shortName: "Serbia",

  slug: "serbia",

  flag: "🇷🇸",

  image: serbiaImage,

  applicants: "1.1k",

  category: ["popular", "work", "residency"],

  visa: "Work Permit + Residency Card",

  duration: "20–25 Days",

  processingTime: "Fast Track",

  opportunityScore: "90%",

  successRate: "High",

  featured: false,

  description:
    "Move to Serbia through a fast-track work permit program with job placement, residency support, free employer accommodation and multiple employment options.",

  opportunities: [
    {
      id: 1,

      title: "Serbia Fast Track Work Permit Package",

      slug: "serbia-work-permit-residency",

      image: serbiaWorkImage,

      icon: "🇷🇸",

      category: "Jobs",

      location: "Serbia",

      type: "Work Permit + Residency Card",

      duration: "20–25 Days",

      salary: "€1,000 - €1,500/month",

      demand: "High",

      description:
        "Relocate to Serbia through a fast-track employment program with job offer, work permit processing, residency card and employer-provided accommodation.",

      highlights: [
        "Job Offer",

        "Work Permit",

        "Residency Card",

        "FREE Employer Accommodation",

        "Fast Track Processing",

        "Pathway to Permanent Residency",
      ],

      positions: [
        {
          sector: "Warehouse Work",

          roles: ["Sorters", "Packers", "Package Handlers"],

          responsibilities: [
            "Sorting goods and packages",

            "Packing items for shipment",

            "General warehouse support duties",
          ],
        },

        {
          sector: "Agriculture Work",

          roles: ["Fruit Pickers", "Vegetable Pickers", "Agricultural Packers"],

          responsibilities: [
            "Harvesting fruits and vegetables",

            "Sorting farm produce",

            "Packing agricultural products",

            "General farm support duties",
          ],

          specialCondition: "Women applicants maximum lifting requirement: 1kg",
        },
      ],

      benefits: [
        "Fast processing within 20–25 days",

        "FREE accommodation provided by employer",

        "Pathway to Permanent Residency",

        "Light work options available for women",

        "Multiple job categories available",

        "Open to couples, men and women",

        "8–10 working hours per day",
      ],

      requirements: [
        "Valid International Passport",

        "Migration eligibility screening",

        "Required employment documents",

        "Ability to meet employer requirements",
      ],

      documents: [
        "International Passport",

        "Updated CV / Resume",

        "Passport Photograph",

        "Employment Documents",

        "Supporting Qualification Documents (If Available)",
      ],

      steps: [
        {
          title: "Eligibility Assessment",

          description:
            "Applicant documents are reviewed and verified for eligibility.",
        },

        {
          title: "Job Offer Processing",

          description:
            "Employer placement and employment documents are prepared.",
        },

        {
          title: "Work Permit & Residency Processing",

          description: "Work permit application and residency support begins.",
        },

        {
          title: "Visa & Travel Preparation",

          description:
            "Applicant receives relocation guidance and prepares for travel.",
        },
      ],

      pricing: {
        total: "₦8,000,000",

        currency: "NGN",

        includes: [
          "Work Permit Processing",

          "Job Placement",

          "Employment Documentation",

          "Visa Support Services",
        ],
      },

      paymentPlan: [
        {
          stage: "Migration Agreement Signing",

          amount: "₦2,000,000",
        },

        {
          stage: "Job Offer Letter",

          amount: "₦3,000,000",
        },

        {
          stage: "Visa Approval & Travel",

          amount: "₦3,000,000",
        },
      ],

      terms: [
        "Applicants must meet eligibility requirements and provide valid documentation.",

        "Processing begins after agreement signing and document verification.",

        "Placements are subject to employer availability and embassy approval.",

        "Limited slots available.",

        "Applications are processed first-come, first-served.",
      ],
    },
  ],
};

export default serbia;
