import {
    HiOutlineBriefcase,
    HiOutlineAcademicCap,
    HiOutlineHome,
    HiOutlineUsers,
} from "react-icons/hi";

export const goals = [
    {
        id: "work",
        title: "Work in Canada",
        subtitle: "Skilled workers & professionals",
        icon: HiOutlineBriefcase,
    },
    {
        id: "study",
        title: "Study in Canada",
        subtitle: "Universities & Colleges",
        icon: HiOutlineAcademicCap,
    },
    {
        id: "pr",
        title: "Permanent Residence",
        subtitle: "Immigration pathways",
        icon: HiOutlineHome,
    },
    {
        id: "family",
        title: "Family Sponsorship",
        subtitle: "Reunite with loved ones",
        icon: HiOutlineUsers,
    },
];

export const educationLevels = [
    "High School",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
];

export const experienceLevels = [
    "Less than 1 Year",
    "1 - 2 Years",
    "3 - 5 Years",
    "5 - 10 Years",
    "10+ Years",
];

export const englishLevels = [
    "Beginner",
    "Intermediate",
    "IELTS 6+",
    "IELTS 7+",
    "IELTS 8+",
];

export const results = {
    work: {
        title: "Express Entry",
        score: "★★★★★",
        description:
            "Strong profile for skilled worker immigration pathways like Express Entry.",
    },
    study: {
        title: "Study Permit",
        score: "★★★★☆",
        description:
            "Ideal for academic pathways leading to future PR opportunities.",
    },
    pr: {
        title: "Permanent Residence",
        score: "★★★★★",
        description:
            "High eligibility for multiple permanent residency programs.",
    },
    family: {
        title: "Family Sponsorship",
        score: "★★★★☆",
        description:
            "Suitable for applicants with eligible family connections in Canada.",
    },
};