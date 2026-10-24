const newZealandData = {
  id: 17,

  name: "New Zealand",
  shortName: "New Zealand",
  slug: "new-zealand",

  flag: "🇳🇿",
  image: "",

  applicants: "New Program",

  category: ["popular", "work", "study", "training"],

  visa: "Training & Study Pathways",
  duration: "1 Year",
  processingTime: "Program Dependent",

  description:
    "Explore New Zealand trainee and apprenticeship opportunities focused on practical skills development, vocational training and potential workplace learning, subject to provider availability and eligibility.",

  opportunityScore: "New",
  successRate: "Program Dependent",
  featured: true,

  opportunities: [
    {
      id: 1,

      title: "New Zealand 1-Year Trainee & Apprenticeship Program",
      slug: "new-zealand-trainee-apprenticeship",

      image: "",
      category: "Training",
      location: "New Zealand",
      type: "Traineeship & Apprenticeship",
      duration: "12 Months",

      icon: "🇳🇿",

      salary: "Placement dependent",
      demand: "Program Dependent",

      applicationFlow: "ASSESSMENT_FIRST",

      programDetails: {
        programType: "Trainee & Apprenticeship",
        country: "New Zealand",

        programDuration: "12 Months",

        targetAudience: [
          "Young adults interested in practical training",
          "Applicants seeking vocational education",
          "Individuals interested in developing job-ready skills",
          "Eligible international applicants",
        ],

        ageRequirement: {
          minimum: 18,
          maximum: 35,
          note: "Age eligibility depends on the training provider, program and any applicable visa requirements.",
        },

        trainingCategories: [
          {
            name: "Hospitality & Tourism",
            courses: [
              "Hospitality Operations",
              "Food and Beverage Service",
              "Commercial Cookery",
              "Tourism Operations",
              "Accommodation Services",
            ],
            indicativeCourseFees: "NZD $5,000–$12,000",
          },
          {
            name: "Business & Administration",
            courses: [
              "Business Administration",
              "Office Administration",
              "Customer Service",
              "Business Operations",
            ],
            indicativeCourseFees: "NZD $4,000–$10,000",
          },
          {
            name: "Information Technology",
            courses: [
              "IT Support",
              "Networking Fundamentals",
              "Software Development Fundamentals",
              "Digital Technology",
            ],
            indicativeCourseFees: "NZD $6,000–$15,000",
          },
          {
            name: "Health & Community Support",
            courses: [
              "Health and Wellbeing Fundamentals",
              "Community Support",
              "Disability Support",
              "Aged Care Support",
            ],
            indicativeCourseFees: "NZD $5,000–$12,000",
          },
          {
            name: "Trades & Technical Skills",
            courses: [
              "Construction Fundamentals",
              "Automotive Fundamentals",
              "Engineering Fundamentals",
              "Technical Maintenance",
            ],
            indicativeCourseFees: "NZD $6,000–$15,000",
          },
        ],

        targetIntakes: ["February", "July"],

        stipend: {
          available: "Placement dependent",
          currency: "NZD",
          frequency: "Monthly where applicable",
          note: "No stipend amount is guaranteed. Any payment depends on the specific employer, placement, funding arrangement and written agreement.",
        },

        refundPolicy: {
          available: "Subject to written terms",
          note: "Refund eligibility, conditions, deductions and timelines must be confirmed in the provider's written refund policy and the applicable agreement.",
        },

        assessment: {
          required: true,
          fee: 0,
          accountRequiredBeforeAssessment: false,
          nextStep: "CREATE_ACCOUNT",
          note: "Applicants can complete the initial eligibility assessment before creating an account.",
        },
      },

      description:
        "Explore a one-year New Zealand trainee and apprenticeship pathway focused on vocational training, practical skills development and potential workplace learning. Course availability, placements, fees and eligibility depend on the selected provider and applicable program requirements.",

      highlights: [
        "Free initial eligibility assessment",
        "One-year program structure",
        "Multiple vocational training categories",
        "Potential practical training opportunities",
        "Guidance on provider and program suitability",
        "Account creation after the initial assessment",
      ],

      requirements: [
        "Must meet the minimum age requirement for the selected program",
        "Valid passport or ability to obtain one",
        "Relevant educational background for the selected course",
        "English language proficiency where required",
        "Ability to meet course and financial requirements",
        "Eligibility for any required visa or placement arrangements",
      ],

      documents: [
        "Valid passport",
        "Educational certificates",
        "Academic transcripts where applicable",
        "CV or resume where required",
        "English language results where required",
        "Proof of financial capacity where required",
        "Additional documents requested by the provider",
      ],

      benefits: [
        "Explore vocational training pathways",
        "Develop practical and industry-related skills",
        "Compare available training categories",
        "Receive guidance on potential program suitability",
        "Explore possible workplace learning opportunities where available",
      ],

      positions: [
        "Hospitality Trainee",
        "Business Administration Trainee",
        "IT Support Trainee",
        "Community Support Trainee",
        "Technical Skills Trainee",
      ],

      steps: [
        "Complete Free Eligibility Assessment",
        "Create an Account or Sign In",
        "Review Assessment and Program Suitability",
        "Select an Appropriate Training Option",
        "Confirm Provider Requirements and Costs",
        "Prepare Required Documents",
        "Proceed With the Applicable Application Process",
      ],

      pricing: null,
      paymentPlan: [],

      terms: [
        "The initial eligibility assessment is not an offer of admission, employment or a visa.",
        "The one-year duration describes the intended program structure and is subject to provider confirmation.",
        "Course availability, entry requirements and tuition fees must be confirmed with the relevant provider.",
        "Indicative course fees are estimates and may differ from actual provider charges.",
        "Any stipend or paid placement depends on the specific employer, placement and written terms.",
        "Training does not automatically provide employment, a work visa or permanent residency.",
        "Visa eligibility and approval are determined under the applicable New Zealand immigration rules.",
        "Refund eligibility is governed by the relevant written agreement and provider refund policy.",
        "Applicants must verify all program costs and conditions before making payments.",
      ],

      faq: [
        {
          question: "How long is the program?",
          answer:
            "The intended program duration is one year, subject to confirmation by the selected provider.",
        },
        {
          question: "Is the initial eligibility assessment free?",
          answer:
            "Yes. The initial eligibility assessment is free and can be completed before creating an account.",
        },
        {
          question: "Do I need an account before taking the assessment?",
          answer:
            "No. Submit the initial assessment first. You will then be prompted to create an account or sign in to continue.",
        },
        {
          question: "Will I receive a monthly stipend?",
          answer:
            "A stipend is not guaranteed. Payment depends on the specific placement, employer, funding arrangement and written terms.",
        },
        {
          question:
            "Does the program guarantee a New Zealand visa or permanent residency?",
          answer:
            "No. Visa approval and residency eligibility depend on the applicable immigration rules and your individual circumstances.",
        },
        {
          question: "How much does the program cost?",
          answer:
            "Costs depend on the selected course and provider. Request a written breakdown of fees before making a payment.",
        },
      ],
    },
  ],
};

export default newZealandData;
