import {
    HiOutlineBriefcase,
    HiOutlineAcademicCap,
    HiOutlineGlobeAlt,
    HiOutlineDocumentText,
    HiOutlineHome,
} from "react-icons/hi";

const services = [
    {
        id: 1,
        icon: HiOutlineHome,
        title: "Canada Immigration",
        description:
            "Expert assistance on Canada immigration pathways including Permanent Residency (PR) through Federal Skilled Worker, Federal Skilled Trades, Provincial Nominee Programs, and Family Sponsorship.",
        features: [
            "Federal Skilled Worker Program",
            "Provincial Nominee Program (PNP)",
            "Family Sponsorship",
            "Express Entry Guidance",
        ],
        cta: "Read More",
    },

    {
        id: 2,
        icon: HiOutlineBriefcase,
        title: "Global Work & Immigration Pathways",
        description:
            "Secure work permits for skilled and unskilled professionals across the US, UK, Australia, New Zealand, and Europe. We connect you to legitimate international opportunities.",
        features: [
            "Work Permit Assistance",
            "Skilled & Unskilled Jobs",
            "Employer Sponsorship Support",
            "Multi-country Placement Options",
        ],
        cta: "Read More",
    },

    {
        id: 3,
        icon: HiOutlineGlobeAlt,
        title: "Tourist Visas",
        description:
            "Streamlined visa application support for hassle-free travel to your dream destinations worldwide.",
        features: [
            "Tourist Visa Application",
            "Travel Documentation",
            "Embassy Preparation",
            "Visa Guidance Support",
        ],
        cta: "Read More",
    },

    {
        id: 4,
        icon: HiOutlineAcademicCap,
        title: "Study Permits",
        description:
            "Guidance and full support for international students seeking admission and study permits in top global institutions.",
        features: [
            "Study Permit Application",
            "School Admission Support",
            "Scholarship Guidance",
            "Pre-departure Assistance",
        ],
        cta: "Read More",
    },
];

export default services;