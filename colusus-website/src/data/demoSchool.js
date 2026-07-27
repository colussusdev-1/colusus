const demoSchool = {
    school: {
        id: "1",
        name: "Bright Future Academy",
        slug: "bright-future-academy",
        logo: "/logo.png",
        favicon: "/favicon.ico",
        motto: "Building Tomorrow's Leaders",
        description:
            "Providing quality education in a safe, nurturing and inspiring environment.",
        email: "info@brightfuture.edu",
        phone: "+234 800 000 0000",
        address: "123 Education Avenue, Lagos",
        website: "https://brightfuture.edu",
        socialLinks: {
            facebook: "",
            instagram: "",
            twitter: "",
            youtube: ""
        }
    },

    theme: {
        template: "modern",
        primaryColor: "#1d4ed8",
        secondaryColor: "#ffffff",
        accentColor: "#f59e0b",
        font: "Inter"
    },

    hero: {
        title: "Building Confident Future Leaders",
        subtitle: "Excellence In Education Since 2005",
        description:
            "We empower students with knowledge, character and leadership skills to succeed in a changing world.",
        image:
            "https://images.unsplash.com/photo-1509062522246-3755977927d7",
        primaryButton: "Apply Now",
        secondaryButton: "Schedule A Visit"
    },

    profile: {
        history:
            "Founded in 2005 with a mission to provide world-class education.",
        mission:
            "To nurture confident, responsible and academically excellent students.",
        vision:
            "To become a leading institution shaping future leaders.",
        values: [
            "Excellence",
            "Integrity",
            "Innovation",
            "Leadership"
        ]
    },

    stats: [
        {
            label: "Years Of Excellence",
            value: "20+"
        },
        {
            label: "Students",
            value: "1500+"
        },
        {
            label: "Qualified Teachers",
            value: "80+"
        },
        {
            label: "Graduates",
            value: "5000+"
        }
    ],

    programs: [
        {
            id: 1,
            name: "Early Years",
            ageRange: "2 - 5 Years",
            description:
                "A nurturing environment focused on foundational learning."
        },
        {
            id: 2,
            name: "Primary School",
            ageRange: "6 - 11 Years",
            description:
                "Developing critical thinking and academic excellence."
        },
        {
            id: 3,
            name: "Secondary School",
            ageRange: "12 - 17 Years",
            description:
                "Preparing students for university and future careers."
        }
    ],

    teachers: [
        {
            id: 1,
            name: "Mrs. Grace Johnson",
            role: "Principal",
            qualification: "M.Ed Educational Leadership",
            photo: ""
        }
    ],

    activities: [
        {
            id: 1,
            title: "Science Fair",
            category: "Academics",
            image: ""
        },
        {
            id: 2,
            title: "Sports Festival",
            category: "Sports",
            image: ""
        }
    ],

    gallery: [
        {
            id: 1,
            title: "Graduation Day",
            image: ""
        },
        {
            id: 2,
            title: "Classroom Activities",
            image: ""
        },
        {
            id: 3,
            title: "Sports Competition",
            image: ""
        }
    ],

    news: [
        {
            id: 1,
            title: "Admissions Open For 2027 Session",
            excerpt:
                "Applications are now open for prospective students."
        },
        {
            id: 2,
            title: "Students Win National Science Competition",
            excerpt:
                "Our students secured first place in the national finals."
        }
    ],

    testimonials: [
        {
            id: 1,
            parentName: "Mrs. Adeyemi",
            childClass: "Primary 5",
            message:
                "The school has transformed my child's confidence and academic performance."
        }
    ],

    admission: {
        open: true,
        deadline: "2027-08-30",
        process: [
            "Submit Application",
            "Assessment",
            "Interview",
            "Admission Offer"
        ]
    }
};

export default demoSchool;