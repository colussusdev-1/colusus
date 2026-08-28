import canadaFlag from "../../../../../assets/flags/canada.png";
import canadaImage from "../../../../../assets/images/countries/canada.jpg";
import softwareEngineerImage from "../../../../../assets/images/opportunities/software-engineer.jpg";

const canada = {
  id: 1,

  name: "Canada",

  shortName: "Canada",

  slug: "canada",

  flag: canadaFlag,

  image: canadaImage,

  applicants: "2.8k",

  category: ["popular", "work", "pr"],

  visa: "Express Entry",

  duration: "8–16 Weeks",

  processingTime: "Fast",

  opportunityScore: "92%",

  successRate: "High",

  description:
    "Discover work permits, permanent residency pathways, and study opportunities in Canada.",

  opportunities: [
    {
      id: 1,

      title: "Software Engineer",

      slug: "software-engineer",

      image: softwareEngineerImage,

      icon: "💻",

      category: "Jobs",

      location: "Toronto, Canada",

      type: "Express Entry",

      duration: "8–16 Weeks",

      salary: "$80,000 - $120,000 CAD/year",

      demand: "Very High",

      description:
        "Technology professionals are highly demanded across Canada's growing tech industry.",

      highlights: [
        "Permanent residency pathway",

        "High salary opportunities",

        "Family sponsorship options",

        "Growing technology sector",
      ],

      requirements: [
        "Computer Science degree or equivalent experience",

        "Relevant software engineering experience",

        "English language proficiency",
      ],

      documents: [
        "Passport",

        "CV / Resume",

        "Educational certificates",

        "Employment records",
      ],

      benefits: [
        "Permanent residency pathway",

        "High salary opportunities",

        "Family sponsorship options",
      ],

      steps: [
        {
          title: "Eligibility Review",

          description:
            "Assess your profile against Canada's immigration requirements.",
        },

        {
          title: "Document Preparation",

          description: "Prepare academic, professional and identity documents.",
        },

        {
          title: "Application Submission",

          description: "Submit your migration application.",
        },

        {
          title: "Visa Processing",

          description: "Track approval and relocation steps.",
        },
      ],
    },
  ],
};

export default canada;
