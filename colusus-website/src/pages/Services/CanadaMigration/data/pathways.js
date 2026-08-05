import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineUsers,
} from "react-icons/hi";

import torontoImage from "../../../../assets/countryimage/toronto.jpg";
import pnpImage from "../../../../assets/countryimage/pnp.jpg";
import familyImage from "../../../../assets/countryimage/family.jpg";
import programsImage from "../../../../assets/countryimage/programs.jpg";

export const pathways = [
  {
    id: "express-entry",

    icon: HiOutlineHome,

    image: torontoImage,

    title: "Express Entry",

    badge: "Permanent Residence",

    description:
      "A strategic immigration pathway for skilled professionals seeking permanent residence in Canada through competitive federal programs.",

    services: [
      "Eligibility Assessment",

      "CRS Score Strategy",

      "Application Preparation",
    ],

    path: "/services/canada/express-entry",
  },

  {
    id: "pnp",

    icon: HiOutlineBriefcase,

    image: pnpImage,

    title: "Provincial Nominee Program",

    badge: "Province-Based Pathway",

    description:
      "Discover opportunities through Canadian provinces looking for skilled workers, entrepreneurs and professionals.",

    services: [
      "Province Matching",

      "Nomination Support",

      "Application Guidance",
    ],

    path: "/services/canada/pnp",
  },

  {
    id: "family",

    icon: HiOutlineUsers,

    image: familyImage,

    title: "Family Sponsorship",

    badge: "Family Reunion",

    description:
      "Reconnect with your loved ones through Canada's family sponsorship programs with structured application support.",

    services: [
      "Spouse Sponsorship",

      "Children Sponsorship",

      "Parent Sponsorship",
    ],

    path: "/services/canada/family-sponsorship",
  },

  {
    id: "other",

    icon: HiOutlineAcademicCap,

    image: programsImage,

    title: "Alternative Programs",

    badge: "More Opportunities",

    description:
      "Explore additional Canadian pathways designed for students, entrepreneurs and specialised applicants.",

    services: ["Study Pathways", "Business Immigration", "Regional Programs"],

    path: "/services/canada/other-programs",
  },
];
