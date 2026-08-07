import {
  HiOutlineCode,
  HiOutlineOfficeBuilding,
  HiOutlineTruck,
  HiOutlineHeart,
} from "react-icons/hi";

import softwareEngineerImage from "../../../../assets/images/opportunities/software-engineer.jpg";
import constructionImage from "../../../../assets/images/opportunities/construction-worker.jpg";
import truckDriverImage from "../../../../assets/images/opportunities/truck-driver.jpg";
import caregiverImage from "../../../../assets/images/opportunities/caregiver.jpg";

export const pathways = [
  {
    id: "software-engineer",

    icon: HiOutlineCode,

    image: softwareEngineerImage,

    title: "Software Engineer",

    badge: "Technology Careers",

    description:
      "Canada's technology sector continues to recruit skilled software engineers with competitive salaries and strong permanent residency opportunities.",

    services: ["Express Entry", "LMIA Jobs", "Tech Pathways"],

    path: "/opportunities/canada/software-engineer",
  },

  {
    id: "construction-worker",

    icon: HiOutlineOfficeBuilding,

    image: constructionImage,

    title: "Construction Worker",

    badge: "Skilled Trades",

    description:
      "Join Canada's booming construction industry through employer-sponsored jobs and skilled trade immigration programs.",

    services: [
      "Building Trades",
      "Employer Sponsorship",
      "Provincial Programs",
    ],

    path: "/opportunities/canada/construction-worker",
  },

  {
    id: "truck-driver",

    icon: HiOutlineTruck,

    image: truckDriverImage,

    title: "Truck Driver",

    badge: "Transportation",

    description:
      "Experienced truck drivers are in high demand across Canada with excellent relocation and permanent residency opportunities.",

    services: ["Long Haul Driving", "Work Permit", "PR Pathway"],

    path: "/opportunities/canada/truck-driver",
  },

  {
    id: "caregiver",

    icon: HiOutlineHeart,

    image: caregiverImage,

    title: "Caregiver",

    badge: "Healthcare Support",

    description:
      "Build a rewarding career supporting families and healthcare institutions while creating a pathway toward permanent residence.",

    services: ["Home Care", "Healthcare Support", "Family Pathway"],

    path: "/opportunities/canada/caregiver",
  },
];
