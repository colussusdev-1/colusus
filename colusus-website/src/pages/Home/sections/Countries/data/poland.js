import polandFlag from "../../../../../assets/flags/poland.png";

import polandImage from "../../../../../assets/images/countries/poland.jpg";

import polandWorkImage from "../../../../../assets/images/opportunities/poland-work.jpg";
import polandWarehouseImage from "../../../../../assets/images/opportunities/poland-warehouse.jpg";
import polandFactoryImage from "../../../../../assets/images/opportunities/poland-factory.jpg";
import polandAgricultureImage from "../../../../../assets/images/opportunities/poland-agriculture.jpg";

const poland = {
  id: 5,

  name: "Poland",

  shortName: "Poland",

  slug: "poland",

  flag: polandFlag,

  image: polandImage,

  applicants: "2.1k",

  category: ["popular", "work"],

  visa: "Work Permit",

  duration: "3–6 Weeks",

  processingTime: "Fast",

  opportunityScore: "90%",

  successRate: "High",

  featured: true,

  description:
    "Relocate to Poland through a verified employer-sponsored work permit program with accommodation support, multiple employment sectors and flight arrangement assistance.",

  opportunities: [
    {
      id: 1,

      title: "Poland Work Permit Migration Package",

      slug: "poland-work-permit",

      image: polandWorkImage,

      icon: "🇵🇱",

      category: "Jobs",

      location: "Poland",

      type: "Standard Work Permit Package",

      duration: "3–6 Weeks",

      salary: "€1,100 – €1,500/month",

      demand: "High",

      description:
        "Move to Poland with a verified job offer, employer-provided accommodation, work permit processing and opportunities across warehouse, factory and agricultural sectors.",

      highlights: [
        "Verified Job Offer",

        "Work Permit",

        "Employer Accommodation",

        "Multiple Employment Sectors",

        "Flight Arrangement Support",
      ],

      positions: [
        {
          sector: "Warehouses",

          image: polandWarehouseImage,

          roles: [
            "Product Packers",

            "Scanner Operators",

            "Electric Trolley Operators",
          ],
        },

        {
          sector: "Factories",

          image: polandFactoryImage,

          roles: [
            "Assembly Line Workers",

            "Quality Control Staff",

            "Small Parts Assembly Workers",
          ],
        },

        {
          sector: "Agriculture",

          image: polandAgricultureImage,

          roles: ["Farm Workers", "Fruit Pickers", "Vegetable Packers"],
        },
      ],

      benefits: [
        "Verified Work Permit",

        "Accommodation Provided by Employer",

        "6 Working Days Per Week",

        "170–250 Working Hours Per Month",

        "Transportation to and from Work (Where Applicable)",

        "Multiple Employment Sectors",

        "Flight Arrangement Support",
      ],

      requirements: [
        "All Nationalities Can Apply",

        "Maximum Age: 45 Years",

        "Communicative English Required",

        "Physically Fit for Manual Work",
      ],

      documents: [
        "Valid International Passport",

        "Updated CV / Resume",

        "Passport Photograph",

        "Educational Certificates (If Available)",

        "Work Experience Documents (If Available)",
      ],

      steps: [
        {
          title: "Document Submission",

          description:
            "Submit all required documents for eligibility screening.",
        },

        {
          title: "Migration Service Agreement",

          description:
            "Sign the official Migration Service Agreement before processing begins.",
        },

        {
          title: "Employer Matching",

          description:
            "Your profile is matched with a suitable Polish employer.",
        },

        {
          title: "Job Offer & Work Permit",

          description:
            "Receive employment contract, accommodation details and approved work permit.",
        },

        {
          title: "Visa Application",

          description: "Complete embassy submission and biometric processing.",
        },

        {
          title: "Travel Preparation",

          description: "Prepare relocation after visa approval.",
        },
      ],

      pricing: {
        total: "₦8,000,000",

        currency: "NGN",

        includes: [
          "Job Placement",

          "Employer Matching",

          "Work Permit Processing",

          "Visa Processing Support",

          "Flight Arrangement Fees",
        ],
      },

      paymentPlan: [
        {
          stage: "Migration Agreement Signing",

          amount: "₦2,000,000",
        },

        {
          stage:
            "Job Offer + Employment Contract + Accommodation + Work Permit",

          amount: "₦3,000,000",
        },

        {
          stage: "Visa Approval & Travel Readiness",

          amount: "₦3,000,000",
        },
      ],

      terms: [
        "Applicants must meet eligibility requirements and provide valid documents.",

        "Processing begins after Migration Service Agreement signing.",

        "Placements depend on employer availability and immigration approval.",

        "Accommodation is provided by employer.",

        "Transportation depends on employer location.",

        "Limited slots available.",
      ],
    },
  ],
};

export default poland;
