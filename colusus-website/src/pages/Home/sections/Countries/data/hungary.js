import hungaryFlag from "../../../../../assets/flags/hungary.png";

import hungaryImage from "../../../../../assets/images/countries/hungary.jpg";
import hungaryWorkImage from "../../../../../assets/images/opportunities/hungary-work.jpg";

const hungary = {
  id: 3,

  name: "Hungary",

  shortName: "Hungary",

  slug: "hungary",

  flag: hungaryFlag,

  image: hungaryImage,

  applicants: "1.3k",

  category: ["popular", "work", "residency"],

  visa: "Work Permit + Residence Card",

  duration: "3 Weeks - 4 Months",

  processingTime: "Flexible Processing",

  opportunityScore: "86%",

  successRate: "High",

  featured: false,

  description:
    "Move to Hungary through seasonal and long-term work opportunities with job placement, work permit support and residence options.",

  opportunities: [
    {
      id: 1,

      title: "Hungary Flexible Work Permit Package",

      slug: "hungary-work-permit-residency",

      image: hungaryWorkImage,

      icon: "🇭🇺",

      category: "Jobs",

      location: "Hungary",

      type: "Work Permit + Residence Card (TRC)",

      duration: "3 Weeks - 4 Months",

      salary: "€700 - €1,400+/month",

      demand: "High",

      description:
        "Relocate to Hungary through seasonal and long-term employment programs with job placement, work permit processing, free accommodation and residence support.",

      highlights: [
        "Job Offer",

        "Work Permit",

        "Residence Card (TRC)",

        "FREE Employer Accommodation",

        "Seasonal & Long-Term Work Options",
      ],

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

          notes: ["Driver's license preferred for some roles"],
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
            "Extra hours and Saturdays possible",

            "Meals paid by employee",

            "Free accommodation provided",
          ],
        },
      ],

      benefits: [
        "FREE accommodation provided by employer",

        "Seasonal and long-term work options",

        "Residence Card issuance upon arrival",

        "Overtime opportunities available",

        "Skilled and unskilled roles available",
      ],

      requirements: [
        "Valid International Passport",

        "Updated CV / Resume",

        "Digital Passport Photograph",

        "Educational Certificates (for 1-year contract)",

        "Proof of work experience",

        "Police Clearance Certificate",

        "Embassy Registration Details",
      ],

      documents: [
        "International Passport",

        "CV / Resume",

        "Passport Photograph",

        "Educational Certificates",

        "Employment Records",

        "Police Clearance Certificate",
      ],

      steps: [
        {
          title: "Document Screening",

          description: "Applicant documents are reviewed for eligibility.",
        },

        {
          title: "Employer Matching",

          description:
            "Candidate is matched with available Hungarian employers.",
        },

        {
          title: "Work Permit Processing",

          description: "Work permit application and visa support begins.",
        },

        {
          title: "Visa Approval",

          description: "Applicant completes visa requirements and preparation.",
        },

        {
          title: "Travel Preparation",

          description: "Final relocation steps are completed.",
        },
      ],

      pricing: {
        total: "₦8,000,000",

        currency: "NGN",

        includes: [
          "Work Permit Processing",

          "Employment Placement",

          "Visa Processing Support",

          "Job Matching",

          "Documentation",
        ],
      },

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

      terms: [
        "Applicants must provide genuine documents for verification.",

        "Processing begins after agreement signing and document screening.",

        "Placements depend on employer availability and embassy approval.",

        "Limited slots available.",

        "Applications are processed first-come, first-served.",
      ],
    },
  ],
};

export default hungary;
