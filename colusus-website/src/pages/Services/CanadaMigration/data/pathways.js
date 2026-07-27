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

        badge: "Popular",

        description:
            "Canada's fastest pathway for skilled professionals seeking permanent residence.",

        services: [
            "Profile Creation",
            "CRS Score Review",
            "ITA Support",
        ],

        path: "/services/canada/express-entry",
    },

    {
        id: "pnp",

        icon: HiOutlineBriefcase,

        image: pnpImage,

        title: "Provincial Nominee Program",

        badge: "PNP",

        description:
            "Immigrate through province-specific streams designed for local labour needs.",

        services: [
            "Eligibility Review",
            "PNP Application",
            "Province Selection",
        ],

        path: "/services/canada/pnp",
    },

    {
        id: "family",

        icon: HiOutlineUsers,

        image: familyImage,

        title: "Family Sponsorship",

        badge: "Family",

        description:
            "Sponsor eligible family members for permanent residence.",

        services: [
            "Spouse",
            "Children",
            "Parents",
        ],

        path: "/services/canada/family-sponsorship",
    },

    {
        id: "other",

        icon: HiOutlineAcademicCap,

        image: programsImage,

        title: "Other Programs",

        badge: "More",

        description:
            "Explore Atlantic, Rural and Business immigration programs.",

        services: [
            "Atlantic Program",
            "RNIP",
            "Business Immigration",
        ],

        path: "/services/canada/other-programs",
    },

];