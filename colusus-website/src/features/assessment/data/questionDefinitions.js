/*
|--------------------------------------------------------------------------
| ASSESSMENT QUESTION DEFINITIONS
|--------------------------------------------------------------------------
|
| These questions describe the applicant.
|
| IMPORTANT:
| Questions are NOT tied to individual countries.
|
| The engine uses the answers to rank opportunities across the entire
| opportunity pool.
|--------------------------------------------------------------------------
*/

const questionDefinitions = [
  {
    id: "goal",

    type: "select",

    eyebrow: "LET'S FIND YOUR DIRECTION",

    title: "What are you hoping to achieve?",

    subtitle:
      "Tell us what you would like your migration journey to help you accomplish.",

    options: [
      {
        value: "work",
        label: "Work abroad",
        description:
          "Find employment and build your career in another country.",
        icon: "💼",
      },

      {
        value: "study",
        label: "Study abroad",
        description: "Explore education and international study opportunities.",
        icon: "🎓",
      },

      {
        value: "residency",
        label: "Permanent residency",
        description: "Explore pathways toward long-term residence.",
        icon: "🏠",
      },

      {
        value: "relocation",
        label: "Relocate abroad",
        description:
          "Find an opportunity that can help you establish yourself abroad.",
        icon: "🌍",
      },

      {
        value: "explore",
        label: "I'm exploring my options",
        description: "Show me opportunities that may fit my profile.",
        icon: "✨",
      },
    ],
  },

  {
    id: "ageRange",

    type: "select",

    eyebrow: "YOUR PROFILE",

    title: "What is your age range?",

    subtitle:
      "Your age helps us identify pathways whose requirements may fit your profile.",

    options: [
      {
        value: "18-24",
        label: "18–24",
        icon: "✨",
      },

      {
        value: "25-34",
        label: "25–34",
        icon: "✨",
      },

      {
        value: "35-44",
        label: "35–44",
        icon: "✨",
      },

      {
        value: "45-54",
        label: "45–54",
        icon: "✨",
      },

      {
        value: "55+",
        label: "55+",
        icon: "✨",
      },
    ],
  },

  {
    id: "education",

    type: "select",

    eyebrow: "YOUR BACKGROUND",

    title: "What is your highest level of education?",

    subtitle:
      "This helps us understand which professional, study and migration opportunities may fit your background.",

    options: [
      {
        value: "secondary",
        label: "Secondary school",
        icon: "📘",
      },

      {
        value: "diploma",
        label: "Diploma / Technical qualification",
        icon: "📜",
      },

      {
        value: "bachelor",
        label: "Bachelor's degree",
        icon: "🎓",
      },

      {
        value: "master",
        label: "Master's degree",
        icon: "🎓",
      },

      {
        value: "doctorate",
        label: "Doctorate / PhD",
        icon: "🏆",
      },

      {
        value: "professional",
        label: "Professional qualification",
        icon: "💼",
      },
    ],
  },

  {
    id: "experience",

    type: "select",

    eyebrow: "YOUR EXPERIENCE",

    title: "How much work experience do you have?",

    subtitle:
      "Your experience helps us prioritize opportunities where your professional background can be useful.",

    options: [
      {
        value: "none",
        label: "No experience",
        icon: "🌱",
      },

      {
        value: "less-than-1",
        label: "Less than 1 year",
        icon: "🌱",
      },

      {
        value: "1-3",
        label: "1–3 years",
        icon: "💼",
      },

      {
        value: "3-5",
        label: "3–5 years",
        icon: "💼",
      },

      {
        value: "5-10",
        label: "5–10 years",
        icon: "🚀",
      },

      {
        value: "10+",
        label: "10+ years",
        icon: "🏆",
      },
    ],
  },

  {
    id: "occupation",

    type: "select",

    eyebrow: "YOUR PROFESSIONAL DIRECTION",

    title: "What best describes your background?",

    subtitle:
      "Choose the area that most closely matches your skills, profession or experience.",

    options: [
      {
        value: "technology",
        label: "Technology & IT",
        icon: "💻",
      },

      {
        value: "healthcare",
        label: "Healthcare",
        icon: "🏥",
      },

      {
        value: "engineering",
        label: "Engineering",
        icon: "⚙️",
      },

      {
        value: "construction",
        label: "Construction & Trades",
        icon: "🏗️",
      },

      {
        value: "hospitality",
        label: "Hospitality & Food Service",
        icon: "🍽️",
      },

      {
        value: "agriculture",
        label: "Agriculture",
        icon: "🌱",
      },

      {
        value: "logistics",
        label: "Warehouse & Logistics",
        icon: "📦",
      },

      {
        value: "business",
        label: "Business & Finance",
        icon: "📊",
      },

      {
        value: "education",
        label: "Education",
        icon: "📚",
      },

      {
        value: "other",
        label: "Other",
        icon: "🌍",
      },
    ],
  },

  {
    id: "opportunityType",

    type: "select",

    eyebrow: "YOUR PREFERRED PATH",

    title: "What kind of opportunity interests you most?",

    subtitle:
      "We'll prioritize the pathways that best match what you're looking for.",

    options: [
      {
        value: "jobs",
        label: "Employment",
        description: "Find work and employment opportunities abroad.",
        icon: "💼",
      },

      {
        value: "study",
        label: "Study",
        description: "Explore international education opportunities.",
        icon: "🎓",
      },

      {
        value: "residency",
        label: "Residency",
        description: "Explore long-term residence pathways.",
        icon: "🏠",
      },

      {
        value: "any",
        label: "I'm open to any suitable pathway",
        description: "Let the assessment decide what may fit me.",
        icon: "✨",
      },
    ],
  },
];

export default questionDefinitions;
