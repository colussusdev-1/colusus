import romaniaImage from "../../../../../assets/images/countries/romania.jpg";
import romaniaWorkImage from "../../../../../assets/images/opportunities/romania-work.jpg";

const romania = {
  id: 11,

  name: "Romania",

  shortName: "Romania",

  slug: "romania",

  flag: "🇷🇴",

  image: romaniaImage,

  applicants: "1.4k",

  category: ["popular", "work"],

  visa: "Work Permit + Residency Permit",

  duration: "2–3 Months",

  processingTime: "Standard",

  opportunityScore: "87%",

  successRate: "High",

  featured: false,

  description:
    "Discover employment opportunities in Romania with verified job offers, work permit processing, residency support and employer benefits.",

  opportunities: [
    {
      id: 1,

      title: "Romania Work Permit Migration Package",

      slug: "romania-work-permit",

      image: romaniaWorkImage,

      icon: "🇷🇴",

      category: "Jobs",

      location: "Romania",

      type: "Standard Work Permit Package",

      duration: "2–3 Months",

      salary: "€1,000 - €1,800/month",

      demand: "High",

      description:
        "Move to Romania with a verified job offer, work permit, residency permit and employer support including accommodation options.",

      highlights: [
        "Verified Job Offer",

        "Work Permit",

        "Residency Permit",

        "FREE Accommodation (Most Positions)",

        "FREE Meals (Selected Positions)",

        "Flight Arrangement Support",
      ],

      positions: [
        {
          sector: "Construction",

          roles: [
            "Masons",

            "Shuttering Carpenters",

            "Wall Painters",

            "Tile Fitters",

            "Gypsum Board Workers",
          ],
        },

        {
          sector: "Meat Factory",

          roles: [
            "Meat Processors",

            "Machine Operators",

            "Product Cutters",

            "Packagers",

            "Sorters",

            "Quality Controllers",
          ],
        },

        {
          sector: "Housekeeping",

          roles: ["Housekeepers", "Domestic Workers"],
        },
      ],

      benefits: [
        "Work Permit Processing",

        "Residency Permit Support",

        "8–10 Working Hours Per Day",

        "FREE Employer Accommodation (Most Positions)",

        "FREE Meals For Selected Positions",

        "Medical Insurance Provided",

        "Medical Examination Support",
      ],

      requirements: [
        "Citizens of All Countries Except Bangladesh and Pakistan",

        "Male & Female Applicants",

        "Maximum Age: 50 Years",

        "Communicative English Required",

        "Physically Fit for Full-Time Employment",
      ],

      documents: [
        "Valid International Passport",

        "Police Clearance Certificate",

        "Updated CV / Resume",

        "Passport Photograph",

        "Proof of Current Residence (If Applicable)",

        "Educational Certificates (If Available)",
      ],

      steps: [
        {
          title: "Document Submission",

          description: "Submit required documents for eligibility screening.",
        },

        {
          title: "Migration Agreement",

          description:
            "Sign the official Migration Service Agreement before processing begins.",
        },

        {
          title: "Employer Matching",

          description:
            "Your profile is matched with a suitable Romanian employer.",
        },

        {
          title: "Job Offer & Work Permit",

          description:
            "Receive job offer, employment contract, accommodation details and approved work permit.",
        },

        {
          title: "Visa Application",

          description: "Complete embassy submission and biometric processing.",
        },

        {
          title: "Travel & Residency",

          description:
            "Travel to Romania and receive residency card according to immigration regulations.",
        },
      ],

      pricing: {
        total: "₦8,000,000",

        currency: "NGN",

        includes: [
          "Job Placement",

          "Work Permit Processing",

          "Residency Permit Support",

          "Visa Support",

          "Documentation",
        ],
      },

      paymentPlan: [
        {
          stage: "Migration Agreement Signing",

          amount: "₦2,000,000",
        },

        {
          stage: "Job Offer + Employment Contract + Work Permit",

          amount: "₦3,000,000",
        },

        {
          stage: "Visa Approval & Travel Readiness",

          amount: "₦3,000,000",
        },
      ],

      terms: [
        "Applicants must meet eligibility requirements and provide valid documents.",

        "Processing begins after agreement signing and document verification.",

        "Employment placement depends on employer availability and immigration approval.",

        "Accommodation benefits depend on employer agreement.",

        "Applications are processed on a first-come, first-served basis.",
      ],
    },
  ],
};

export default romania;
