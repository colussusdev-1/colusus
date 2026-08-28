import ukFlag from "../../../../../assets/flags/united-kingdom.png";

import ukImage from "../../../../../assets/images/countries/uk.jpg";

const uk = {
  id: 2,

  name: "United Kingdom",

  shortName: "UK",

  slug: "united-kingdom",

  flag: ukFlag,

  image: ukImage,

  applicants: "2.1k",

  category: ["popular", "work", "study"],

  visa: "Skilled Worker Visa",

  duration: "6–12 Weeks",

  processingTime: "Fast",

  opportunityScore: "88%",

  successRate: "High",

  description:
    "Explore UK skilled worker routes, healthcare careers, university pathways and long-term settlement opportunities.",

  opportunities: [
    {
      id: 1,

      title: "Healthcare Worker",

      slug: "healthcare-worker",

      icon: "🏥",

      category: "Jobs",

      location: "United Kingdom",

      type: "Health & Care Visa",

      duration: "6–12 Weeks",

      salary: "£30,000 - £50,000/year",

      demand: "Very High",

      description:
        "The UK continues to experience strong demand for qualified healthcare professionals including nurses, carers and medical specialists.",

      requirements: [
        "Healthcare qualification",
        "Professional registration",
        "English language proficiency",
        "Relevant healthcare experience",
      ],

      documents: [
        "Valid passport",
        "Professional certificates",
        "Work experience records",
        "English language results",
        "CV / Resume",
      ],

      benefits: [
        "Visa sponsorship opportunities",
        "Healthcare career growth",
        "Family migration options",
        "Pathway toward settlement",
      ],

      steps: [
        {
          title: "Profile Assessment",
          description:
            "Review your healthcare background and eligibility for UK healthcare routes.",
        },

        {
          title: "Document Preparation",
          description:
            "Prepare professional certificates, identity documents and employment records.",
        },

        {
          title: "Employer Matching",
          description:
            "Connect with eligible UK employers offering sponsorship opportunities.",
        },

        {
          title: "Visa Application",
          description: "Submit your application and prepare for relocation.",
        },
      ],

      faq: [
        {
          question: "Can healthcare workers get UK visa sponsorship?",

          answer:
            "Yes. Many UK healthcare employers are approved sponsors for qualified international workers.",
        },

        {
          question: "Is English required?",

          answer:
            "Most healthcare routes require proof of English language ability.",
        },
      ],
    },

    {
      id: 2,

      title: "Skilled Worker",

      slug: "skilled-worker",

      icon: "💼",

      category: "Jobs",

      location: "London, United Kingdom",

      type: "Skilled Worker Visa",

      duration: "8–14 Weeks",

      salary: "£35,000 - £70,000/year",

      demand: "High",

      description:
        "Move to the UK through employer-sponsored skilled employment opportunities across technology, engineering, finance and other industries.",

      requirements: [
        "Eligible occupation",
        "Job offer from approved UK employer",
        "Required professional skills",
        "English proficiency",
      ],

      documents: [
        "Passport",
        "Certificate of sponsorship",
        "CV",
        "Educational certificates",
        "Employment history",
      ],

      benefits: [
        "Work legally in the UK",
        "Career advancement opportunities",
        "Family visa options",
        "Settlement pathway",
      ],

      steps: [
        {
          title: "Eligibility Check",
          description:
            "Determine if your occupation qualifies under the UK skilled worker system.",
        },

        {
          title: "Employer Sponsorship",
          description: "Secure employment with an approved UK sponsor.",
        },

        {
          title: "Application Filing",
          description:
            "Submit visa documents and complete application requirements.",
        },

        {
          title: "Relocation",
          description: "Receive approval and prepare your move.",
        },
      ],

      faq: [
        {
          question: "Do I need a UK job offer?",

          answer:
            "Yes. Skilled Worker routes usually require sponsorship from an approved employer.",
        },

        {
          question: "Can my family join me?",

          answer: "Eligible applicants may bring qualifying dependants.",
        },
      ],
    },

    {
      id: 3,

      title: "Student Route",

      slug: "student-route",

      icon: "🎓",

      category: "Study",

      location: "United Kingdom",

      type: "Student Visa",

      duration: "6–10 Weeks",

      salary: "Post-study work opportunities",

      demand: "Growing",

      description:
        "Study at globally recognised UK universities while building opportunities for future employment and settlement.",

      requirements: [
        "University admission offer",
        "Academic qualification",
        "Proof of funds",
        "English language requirement",
      ],

      documents: [
        "Passport",
        "Admission letter",
        "Academic transcripts",
        "Financial documents",
      ],

      benefits: [
        "World-class education",
        "Graduate route opportunities",
        "International career exposure",
        "Future migration pathways",
      ],

      steps: [
        {
          title: "University Selection",
          description: "Choose a suitable UK institution and study program.",
        },

        {
          title: "Admission Application",
          description: "Receive your official confirmation of study.",
        },

        {
          title: "Visa Processing",
          description: "Submit your student visa application.",
        },

        {
          title: "Travel Preparation",
          description: "Prepare accommodation and relocation plans.",
        },
      ],

      faq: [
        {
          question: "Can students work in the UK?",

          answer:
            "Many international students can work limited hours during their studies depending on visa conditions.",
        },

        {
          question: "Can students stay after graduation?",

          answer: "Graduates may qualify for post-study work options.",
        },
      ],
    },
  ],

  featured: true,
};

export default uk;
