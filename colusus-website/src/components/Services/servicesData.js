import {
  HiOutlineBriefcase,
  HiOutlineGlobeAlt,
  HiOutlineHome,
} from "react-icons/hi";

const services = [
  {
    id: 1,

    slug: "canada-migration",

    icon: HiOutlineHome,

    title: "Canada Migration",

    description:
      "Explore permanent residency pathways, immigration programs, and relocation options designed for individuals and families seeking a new future in Canada.",

    features: [
      "Express Entry",

      "Provincial Nominee Programs",

      "Family Sponsorship",

      "Permanent Residency Support",
    ],

    cta: "Explore Canada Pathways",
  },

  {
    id: 2,

    slug: "global-works",

    icon: HiOutlineBriefcase,

    title: "Global Work Opportunities",

    description:
      "Access international employment pathways and work permit opportunities across leading destinations with professional guidance throughout the process.",

    features: [
      "International Job Opportunities",

      "Work Permit Support",

      "Employer Sponsorship",

      "Relocation Guidance",
    ],

    cta: "Explore Work Opportunities",
  },

  {
    id: 3,

    slug: "tourist-visa",

    icon: HiOutlineGlobeAlt,

    title: "Tourist Visas",

    description:
      "Get professional assistance with tourist visa applications, travel documentation, and preparation for successful international travel.",

    features: [
      "Visa Application Support",

      "Travel Documentation",

      "Embassy Preparation",

      "Application Review",
    ],

    cta: "Start Visa Process",
  },
];

export default services;
