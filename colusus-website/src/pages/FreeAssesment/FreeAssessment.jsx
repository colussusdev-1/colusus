import React, {
    useMemo,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    HiOutlineGlobeAlt,
    HiOutlineBriefcase,
    HiOutlineAcademicCap,
    HiOutlineUser,
    HiOutlineDocumentText,
    HiOutlineCheckCircle,
    HiOutlineSearch,
    HiOutlineArrowRight,
    HiOutlineArrowLeft,
    HiOutlineShieldCheck,
    HiOutlineSparkles,
    HiOutlineLockClosed,
    HiOutlineLocationMarker,
    HiOutlineLightningBolt,
} from "react-icons/hi";

import countries from "../Home/sections/Countries/countriesData";

import "./FreeAssessment.css";


/* ============================================================
   ASSESSMENT STEPS
============================================================ */

const STEPS = [

    {
        number: "01",
        title: "Destination",
        icon: HiOutlineGlobeAlt,
    },

    {
        number: "02",
        title: "Your Goal",
        icon: HiOutlineBriefcase,
    },

    {
        number: "03",
        title: "Your Profile",
        icon: HiOutlineUser,
    },

    {
        number: "04",
        title: "Review",
        icon: HiOutlineDocumentText,
    },

    {
        number: "05",
        title: "Matches",
        icon: HiOutlineSparkles,
    },

];


/* ============================================================
   GOALS
============================================================ */

const GOALS = [

    {
        id: "work",

        title: "Work Abroad",

        description:
            "Find employment and skilled work pathways.",

        icon: HiOutlineBriefcase,
    },

    {
        id: "study",

        title: "Study Abroad",

        description:
            "Explore education and student opportunities.",

        icon: HiOutlineAcademicCap,
    },

    {
        id: "residency",

        title: "Permanent Residency",

        description:
            "Explore long-term settlement pathways.",

        icon: HiOutlineLocationMarker,
    },

    {
        id: "travel",

        title: "Visit / Travel",

        description:
            "Find suitable international travel options.",

        icon: HiOutlineGlobeAlt,
    },

];


/* ============================================================
   PROFILE OPTIONS
============================================================ */

const LOCATIONS = [

    "Nigeria",
    "Ghana",
    "Kenya",
    "South Africa",
    "Other",

];


const AGE_OPTIONS = [

    {
        value: "18-24",
        label: "18 – 24",
    },

    {
        value: "25-34",
        label: "25 – 34",
    },

    {
        value: "35-44",
        label: "35 – 44",
    },

    {
        value: "45-54",
        label: "45 – 54",
    },

    {
        value: "55+",
        label: "55+",
    },

];


const EDUCATION_OPTIONS = [

    {
        value: "secondary",
        label: "Secondary School",
    },

    {
        value: "diploma",
        label: "Diploma",
    },

    {
        value: "bachelors",
        label: "Bachelor's Degree",
    },

    {
        value: "masters",
        label: "Master's Degree",
    },

    {
        value: "phd",
        label: "PhD",
    },

];


const EXPERIENCE_OPTIONS = [

    {
        value: "none",
        label: "No experience",
    },

    {
        value: "1-2",
        label: "1 – 2 years",
    },

    {
        value: "3-5",
        label: "3 – 5 years",
    },

    {
        value: "6-10",
        label: "6 – 10 years",
    },

    {
        value: "10+",
        label: "10+ years",
    },

];


/* ============================================================
   HELPERS
============================================================ */

const normalize = (
    value = ""
) => {

    return String(
        value
    )
        .toLowerCase()
        .trim();

};


/* ============================================================
   GOAL MATCH
============================================================ */

const getGoalScore = (
    opportunity,
    goal
) => {

    if (!goal) {
        return 0;
    }


    const text = normalize(`

        ${opportunity.category || ""}

        ${opportunity.title || ""}

        ${opportunity.type || ""}

        ${opportunity.description || ""}

    `);


    if (
        goal === "work"
        &&
        (
            text.includes("job")
            ||
            text.includes("work")
            ||
            text.includes("worker")
            ||
            text.includes("employment")
            ||
            text.includes("skilled")
            ||
            text.includes("career")
        )
    ) {

        return 45;

    }


    if (
        goal === "study"
        &&
        (
            text.includes("study")
            ||
            text.includes("student")
            ||
            text.includes("education")
            ||
            text.includes("university")
        )
    ) {

        return 45;

    }


    if (
        goal === "residency"
        &&
        (
            text.includes("residency")
            ||
            text.includes("permanent")
            ||
            text.includes("settlement")
            ||
            text.includes("pr")
        )
    ) {

        return 45;

    }


    if (
        goal === "travel"
        &&
        (
            text.includes("travel")
            ||
            text.includes("visit")
            ||
            text.includes("tourist")
        )
    ) {

        return 45;

    }


    return 0;

};


/* ============================================================
   COUNTRY PREFERENCE

   IMPORTANT:

   This does NOT filter opportunities.

   It simply makes the preferred country more relevant.
============================================================ */

const getCountryScore = (
    country,
    selectedCountry
) => {

    if (!selectedCountry) {
        return 0;
    }


    if (
        country.id === selectedCountry.id
        ||
        country.slug === selectedCountry.slug
    ) {

        return 25;

    }


    return 0;

};


/* ============================================================
   EXPERIENCE MATCH
============================================================ */

const getExperienceScore = (
    opportunity,
    experience
) => {

    if (!experience) {
        return 0;
    }


    const text = normalize(`

        ${opportunity.title || ""}

        ${opportunity.description || ""}

        ${opportunity.category || ""}

        ${opportunity.type || ""}

        ${(opportunity.requirements || []).join(" ")}

    `);


    const professional =

        text.includes("software")
        ||
        text.includes("engineer")
        ||
        text.includes("nurse")
        ||
        text.includes("healthcare")
        ||
        text.includes("skilled")
        ||
        text.includes("professional")
        ||
        text.includes("worker")
        ||
        text.includes("employment");


    if (!professional) {
        return 0;
    }


    if (
        experience === "none"
    ) {

        return 0;

    }


    if (
        experience === "1-2"
        ||
        experience === "3-5"
    ) {

        return 7;

    }


    if (
        experience === "6-10"
        ||
        experience === "10+"
    ) {

        return 10;

    }


    return 0;

};


/* ============================================================
   EDUCATION MATCH
============================================================ */

const getEducationScore = (
    opportunity,
    education
) => {

    if (!education) {
        return 0;
    }


    const text = normalize(`

        ${opportunity.title || ""}

        ${opportunity.description || ""}

        ${opportunity.type || ""}

        ${(opportunity.requirements || []).join(" ")}

    `);


    const academic =

        text.includes("degree")
        ||
        text.includes("university")
        ||
        text.includes("student")
        ||
        text.includes("education")
        ||
        text.includes("engineer")
        ||
        text.includes("nurse")
        ||
        text.includes("professional");


    if (!academic) {
        return 0;
    }


    if (
        education === "secondary"
    ) {

        return 2;

    }


    if (
        education === "diploma"
    ) {

        return 5;

    }


    if (
        education === "bachelors"
    ) {

        return 8;

    }


    if (
        education === "masters"
        ||
        education === "phd"
    ) {

        return 10;

    }


    return 0;

};


/* ============================================================
   DEMAND
============================================================ */

const getDemandScore = (
    opportunity
) => {

    const demand =
        normalize(
            opportunity.demand
        );


    if (
        demand.includes("critical")
        ||
        demand.includes("very high")
    ) {

        return 10;

    }


    if (
        demand.includes("high")
    ) {

        return 7;

    }


    if (
        demand.includes("medium")
    ) {

        return 4;

    }


    return 2;

};


/* ============================================================
   BUILD GLOBAL OPPORTUNITY POOL
============================================================ */

const buildOpportunityPool = () => {

    return countries.flatMap(
        (country) => {

            return (
                country.opportunities || []
            ).map(
                (opportunity) => ({

                    ...opportunity,

                    countryId:
                        country.id,

                    countryName:
                        country.name,

                    countrySlug:
                        country.slug,

                    countryFlag:
                        country.flag,

                    countryImage:
                        country.image,

                    opportunityImage:
                        opportunity.image || null,

                })
            );

        }
    );

};


/* ============================================================
   MATCH LABEL

   No numeric scores are shown to the user.
============================================================ */

const getMatchLabel = (
    index
) => {

    if (index === 0) {

        return {
            text: "Best Match",
            icon: HiOutlineSparkles,
        };

    }


    if (index === 1 || index === 2) {

        return {
            text: "Recommended for You",
            icon: HiOutlineCheckCircle,
        };

    }


    return {
        text: "Worth Exploring",
        icon: HiOutlineGlobeAlt,
    };

};


/* ============================================================
   COMPONENT
============================================================ */

const FreeAssessment = () => {

    const [currentStep, setCurrentStep] =
        useState(1);


    const [search, setSearch] =
        useState("");


    const [answers, setAnswers] = useState({

        destination: null,

        goal: null,

        location: "Nigeria",

        age: "",

        education: "",

        experience: "",

    });


    const [showResults, setShowResults] =
        useState(false);


    /* ========================================================
       OPPORTUNITY POOL
    ======================================================== */

    const opportunityPool = useMemo(
        () =>
            buildOpportunityPool(),
        []
    );


    /* ========================================================
       COUNTRY SEARCH
    ======================================================== */

    const filteredCountries = useMemo(() => {

        if (!search.trim()) {

            return countries;

        }


        return countries.filter(
            (country) =>
                normalize(
                    country.name
                ).includes(
                    normalize(search)
                )
        );

    }, [search]);


    /* ========================================================
       COUNTRY SELECTION
    ======================================================== */

    const selectDestination = (
        country
    ) => {

        setAnswers(
            (previous) => ({

                ...previous,

                destination:
                    country,

            })
        );

    };


    /* ========================================================
       GOAL
    ======================================================== */

    const selectGoal = (
        goal
    ) => {

        setAnswers(
            (previous) => ({

                ...previous,

                goal,

            })
        );

    };


    /* ========================================================
       ANSWER UPDATE
    ======================================================== */

    const updateAnswer = (
        field,
        value
    ) => {

        setAnswers(
            (previous) => ({

                ...previous,

                [field]:
                    value,

            })
        );

    };


    /* ========================================================
       MATCH ENGINE
    ======================================================== */

    const matches = useMemo(() => {

        return opportunityPool

            .map(
                (opportunity) => {

                    let score = 0;


                    score += getGoalScore(
                        opportunity,
                        answers.goal
                    );


                    score += getCountryScore(
                        opportunity,
                        answers.destination
                    );


                    score += getExperienceScore(
                        opportunity,
                        answers.experience
                    );


                    score += getEducationScore(
                        opportunity,
                        answers.education
                    );


                    score += getDemandScore(
                        opportunity
                    );


                    const goalMatch =
                        getGoalScore(
                            opportunity,
                            answers.goal
                        ) > 0;


                    if (
                        answers.goal
                        &&
                        !goalMatch
                    ) {

                        score -= 25;

                    }


                    return {

                        ...opportunity,

                        matchScore:
                            Math.max(
                                0,
                                Math.min(
                                    100,
                                    score
                                )
                            ),

                    };

                }
            )

            .filter(
                (opportunity) => {

                    if (!answers.goal) {

                        return true;

                    }


                    return (
                        getGoalScore(
                            opportunity,
                            answers.goal
                        ) > 0
                    );

                }
            )

            .sort(
                (a, b) =>
                    b.matchScore -
                    a.matchScore
            )

            .slice(
                0,
                6
            );

    }, [
        opportunityPool,
        answers,
    ]);


    /* ========================================================
       PROGRESS
    ======================================================== */

    const progress =
        Math.round(
            (
                currentStep /
                STEPS.length
            ) * 100
        );


    /* ========================================================
       NEXT
    ======================================================== */

    const nextStep = () => {

        if (
            currentStep < 5
        ) {

            setCurrentStep(
                (step) =>
                    step + 1
            );

            return;

        }


        setShowResults(true);

    };


    /* ========================================================
       BACK
    ======================================================== */

    const previousStep = () => {

        if (showResults) {

            setShowResults(false);

            setCurrentStep(4);

            return;

        }


        if (
            currentStep > 1
        ) {

            setCurrentStep(
                (step) =>
                    step - 1
            );

        }

    };


    /* ========================================================
       RESTART
    ======================================================== */

    const restartAssessment = () => {

        setCurrentStep(1);

        setSearch("");

        setShowResults(false);

        setAnswers({

            destination: null,

            goal: null,

            location: "Nigeria",

            age: "",

            education: "",

            experience: "",

        });

    };


    /* ========================================================
       STEP CONTENT
    ======================================================== */

    const renderStep = () => {


        /* ====================================================
           STEP 1 — DESTINATION
        ==================================================== */

        if (
            currentStep === 1
        ) {

            return (

                <div className="assessment-step">

                    <div className="assessment-step-heading">

                        <span className="assessment-eyebrow">
                            STEP 01 / DESTINATION
                        </span>


                        <h1>

                            Where would you

                            <span>
                                like to go?
                            </span>

                        </h1>


                        <p>

                            Choose a destination you're
                            interested in. This is a preference,
                            not a restriction — we'll still
                            compare opportunities across our
                            available countries.

                        </p>

                    </div>


                    <div className="assessment-search">

                        <HiOutlineSearch />

                        <input
                            type="text"
                            value={search}
                            placeholder="Search destinations..."
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <div className="destination-grid">

                        {
                            filteredCountries.map(
                                (country) => {

                                    const selected =
                                        answers.destination?.id ===
                                        country.id;


                                    return (

                                        <button
                                            type="button"
                                            key={country.id}
                                            className={
                                                `destination-card ${selected
                                                    ? "selected"
                                                    : ""
                                                }`
                                            }
                                            onClick={() =>
                                                selectDestination(
                                                    country
                                                )
                                            }
                                        >

                                            <div className="destination-card-flag">

                                                {
                                                    country.flag
                                                }

                                            </div>


                                            <div className="destination-card-info">

                                                <strong>
                                                    {
                                                        country.name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        country.visa ||
                                                        "Migration pathways"
                                                    }
                                                </span>

                                            </div>


                                            <div className="destination-card-action">

                                                {
                                                    selected
                                                        ? (
                                                            <HiOutlineCheckCircle />
                                                        )
                                                        : (
                                                            <HiOutlineArrowRight />
                                                        )
                                                }

                                            </div>

                                        </button>

                                    );

                                }
                            )
                        }

                    </div>


                    <div className="assessment-hint">

                        <HiOutlineSparkles />

                        <span>

                            Your destination preference helps
                            us rank results — it won't hide
                            stronger opportunities elsewhere.

                        </span>

                    </div>

                </div>

            );

        }



        /* ====================================================
           STEP 2 — GOAL
        ==================================================== */

        if (
            currentStep === 2
        ) {

            return (

                <div className="assessment-step">

                    <div className="assessment-step-heading">

                        <span className="assessment-eyebrow">
                            STEP 02 / OBJECTIVE
                        </span>


                        <h1>

                            What are you

                            <span>
                                looking for?
                            </span>

                        </h1>


                        <p>

                            Your goal is one of the strongest
                            signals we'll use when matching you
                            with available opportunities.

                        </p>

                    </div>


                    <div className="goal-grid">

                        {
                            GOALS.map(
                                (goal) => {

                                    const Icon =
                                        goal.icon;


                                    const selected =
                                        answers.goal ===
                                        goal.id;


                                    return (

                                        <button
                                            type="button"
                                            key={goal.id}
                                            className={
                                                `goal-card ${selected
                                                    ? "selected"
                                                    : ""
                                                }`
                                            }
                                            onClick={() =>
                                                selectGoal(
                                                    goal.id
                                                )
                                            }
                                        >

                                            <div className="goal-card-top">

                                                <div className="goal-icon">

                                                    <Icon />

                                                </div>


                                                {
                                                    selected && (

                                                        <HiOutlineCheckCircle
                                                            className="goal-selected-icon"
                                                        />

                                                    )
                                                }

                                            </div>


                                            <div className="goal-content">

                                                <strong>
                                                    {
                                                        goal.title
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        goal.description
                                                    }
                                                </span>

                                            </div>


                                            <span className="goal-card-arrow">

                                                <HiOutlineArrowRight />

                                            </span>

                                        </button>

                                    );

                                }
                            )
                        }

                    </div>

                </div>

            );

        }



        /* ====================================================
           STEP 3 — PROFILE
        ==================================================== */

        if (
            currentStep === 3
        ) {

            return (

                <div className="assessment-step">

                    <div className="assessment-step-heading">

                        <span className="assessment-eyebrow">
                            STEP 03 / PROFILE
                        </span>


                        <h1>

                            A little more

                            <span>
                                about you.
                            </span>

                        </h1>


                        <p>

                            These details help us make the
                            opportunity ranking more relevant
                            to your profile.

                        </p>

                    </div>


                    <div className="profile-form">


                        <div className="form-field">

                            <label>
                                Current location
                            </label>


                            <select
                                value={
                                    answers.location
                                }
                                onChange={(event) =>
                                    updateAnswer(
                                        "location",
                                        event.target.value
                                    )
                                }
                            >

                                {
                                    LOCATIONS.map(
                                        (location) => (

                                            <option
                                                key={location}
                                                value={location}
                                            >
                                                {
                                                    location
                                                }
                                            </option>

                                        )
                                    )
                                }

                            </select>

                        </div>


                        <div className="form-field">

                            <label>
                                Age range
                            </label>


                            <select
                                value={
                                    answers.age
                                }
                                onChange={(event) =>
                                    updateAnswer(
                                        "age",
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select age range
                                </option>


                                {
                                    AGE_OPTIONS.map(
                                        (option) => (

                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {
                                                    option.label
                                                }
                                            </option>

                                        )
                                    )
                                }

                            </select>

                        </div>


                        <div className="form-field">

                            <label>
                                Highest education
                            </label>


                            <select
                                value={
                                    answers.education
                                }
                                onChange={(event) =>
                                    updateAnswer(
                                        "education",
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select qualification
                                </option>


                                {
                                    EDUCATION_OPTIONS.map(
                                        (option) => (

                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {
                                                    option.label
                                                }
                                            </option>

                                        )
                                    )
                                }

                            </select>

                        </div>


                        <div className="form-field">

                            <label>
                                Relevant experience
                            </label>


                            <select
                                value={
                                    answers.experience
                                }
                                onChange={(event) =>
                                    updateAnswer(
                                        "experience",
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select experience
                                </option>


                                {
                                    EXPERIENCE_OPTIONS.map(
                                        (option) => (

                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {
                                                    option.label
                                                }
                                            </option>

                                        )
                                    )
                                }

                            </select>

                        </div>

                    </div>


                    <div className="profile-note">

                        <HiOutlineLightningBolt />

                        <div>

                            <strong>
                                Better information = better matches
                            </strong>

                            <span>

                                Your answers are used together
                                to rank opportunities across
                                our available destinations.

                            </span>

                        </div>

                    </div>

                </div>

            );

        }



        /* ====================================================
           STEP 4 — REVIEW
        ==================================================== */

        if (
            currentStep === 4
        ) {

            const selectedGoal =
                GOALS.find(
                    (goal) =>
                        goal.id ===
                        answers.goal
                );


            return (

                <div className="assessment-step">

                    <div className="assessment-step-heading">

                        <span className="assessment-eyebrow">
                            STEP 04 / REVIEW
                        </span>


                        <h1>

                            Ready to find your

                            <span>
                                best pathways?
                            </span>

                        </h1>


                        <p>

                            We'll use everything you've provided
                            to rank available opportunities — not
                            just opportunities in your preferred
                            country.

                        </p>

                    </div>


                    <div className="review-summary">


                        <div className="review-summary-card">

                            <span className="review-summary-number">
                                01
                            </span>


                            <div className="review-summary-icon">

                                <HiOutlineGlobeAlt />

                            </div>


                            <div className="review-summary-content">

                                <span>
                                    Destination preference
                                </span>

                                <strong>

                                    {
                                        answers.destination?.flag
                                    }

                                    {" "}

                                    {
                                        answers.destination?.name ||
                                        "Not selected"
                                    }

                                </strong>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentStep(1)
                                }
                            >
                                Edit
                            </button>

                        </div>



                        <div className="review-summary-card">

                            <span className="review-summary-number">
                                02
                            </span>


                            <div className="review-summary-icon">

                                <HiOutlineBriefcase />

                            </div>


                            <div className="review-summary-content">

                                <span>
                                    Primary objective
                                </span>

                                <strong>

                                    {
                                        selectedGoal?.title ||
                                        "Not selected"
                                    }

                                </strong>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentStep(2)
                                }
                            >
                                Edit
                            </button>

                        </div>



                        <div className="review-summary-card">

                            <span className="review-summary-number">
                                03
                            </span>


                            <div className="review-summary-icon">

                                <HiOutlineUser />

                            </div>


                            <div className="review-summary-content">

                                <span>
                                    Profile
                                </span>

                                <strong>

                                    {
                                        answers.location
                                    }

                                    {" • "}

                                    {
                                        EDUCATION_OPTIONS.find(
                                            (option) =>
                                                option.value ===
                                                answers.education
                                        )?.label ||
                                        "Education not selected"
                                    }

                                </strong>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentStep(3)
                                }
                            >
                                Edit
                            </button>

                        </div>

                    </div>


                    <div className="review-security">

                        <div className="review-security-icon">

                            <HiOutlineShieldCheck />

                        </div>


                        <div>

                            <strong>
                                Secure & private
                            </strong>

                            <span>

                                Your responses are used to
                                personalize your opportunity
                                results.

                            </span>

                        </div>

                    </div>

                </div>

            );

        }



        return null;

    };


    /* ============================================================
       RESULTS PAGE
    ============================================================ */

    if (
        showResults
    ) {

        return (

            <main className="assessment-page assessment-results-page">


                <div className="assessment-results-shell">


                    {/* =================================================
                        RESULTS HEADER
                    ================================================= */}

                    <header className="results-header">

                        <button
                            type="button"
                            className="assessment-back-button"
                            onClick={
                                previousStep
                            }
                        >

                            <HiOutlineArrowLeft />

                            Back

                        </button>


                        <div className="results-complete">

                            <span className="results-complete-icon">

                                <HiOutlineCheckCircle />

                            </span>

                            <span>
                                ASSESSMENT COMPLETE
                            </span>

                        </div>


                        <h1>

                            We found opportunities

                            <span>
                                worth exploring.
                            </span>

                        </h1>


                        <p>

                            Based on your goals, profile and
                            destination preference, these are
                            pathways we think are worth taking
                            a closer look at.

                        </p>

                    </header>



                    {/* =================================================
                        RESULT CONTEXT
                    ================================================= */}

                    <div className="results-overview">


                        <div className="results-overview-main">

                            <span>
                                YOUR PREFERENCE
                            </span>

                            <strong>

                                {
                                    answers.destination?.flag
                                }

                                {" "}

                                {
                                    answers.destination?.name ||
                                    "Open to options"
                                }

                            </strong>

                        </div>


                        <div className="results-overview-divider" />


                        <div className="results-overview-main">

                            <span>
                                YOUR GOAL
                            </span>

                            <strong>

                                {
                                    GOALS.find(
                                        (goal) =>
                                            goal.id ===
                                            answers.goal
                                    )?.title ||
                                    "Explore options"
                                }

                            </strong>

                        </div>


                        <div className="results-overview-divider" />


                        <div className="results-overview-main">

                            <span>
                                PATHWAYS REVIEWED
                            </span>

                            <strong>
                                {opportunityPool.length}
                            </strong>

                        </div>

                    </div>



                    {/* =================================================
                        RESULTS
                    ================================================= */}

                    <section className="results-list">


                        {
                            matches.length > 0
                                ? (

                                    matches.map(
                                        (
                                            opportunity,
                                            index
                                        ) => {

                                            const match =
                                                getMatchLabel(
                                                    index
                                                );


                                            const MatchIcon =
                                                match.icon;


                                            return (

                                                <article
                                                    className={
                                                        `opportunity-result-card ${index === 0
                                                            ? "top-match"
                                                            : ""
                                                        }`
                                                    }
                                                    key={
                                                        `${opportunity.countryId}-${opportunity.id}`
                                                    }
                                                >


                                                    {/* =========================================
                                                        IMAGE
                                                    ========================================= */}

                                                    <div className="opportunity-result-image">

                                                        {
                                                            opportunity.opportunityImage
                                                                ? (

                                                                    <img
                                                                        src={
                                                                            opportunity.opportunityImage
                                                                        }
                                                                        alt={
                                                                            opportunity.title
                                                                        }
                                                                        loading="lazy"
                                                                    />

                                                                )
                                                                : opportunity.countryImage
                                                                    ? (

                                                                        <img
                                                                            src={
                                                                                opportunity.countryImage
                                                                            }
                                                                            alt={
                                                                                opportunity.countryName
                                                                            }
                                                                            loading="lazy"
                                                                        />

                                                                    )
                                                                    : (

                                                                        <div className="opportunity-image-fallback">

                                                                            <HiOutlineGlobeAlt />

                                                                        </div>

                                                                    )
                                                        }

                                                    </div>



                                                    {/* =========================================
                                                        CONTENT
                                                    ========================================= */}

                                                    <div className="opportunity-result-content">


                                                        <div className="opportunity-result-topline">


                                                            <div className="opportunity-country">

                                                                <span className="opportunity-country-flag">

                                                                    {
                                                                        opportunity.countryFlag
                                                                    }

                                                                </span>


                                                                <div>

                                                                    <strong>
                                                                        {
                                                                            opportunity.countryName
                                                                        }
                                                                    </strong>

                                                                    <small>

                                                                        {
                                                                            opportunity.location ||
                                                                            opportunity.countryName
                                                                        }

                                                                    </small>

                                                                </div>

                                                            </div>


                                                            <div
                                                                className={
                                                                    `opportunity-match-label ${index === 0
                                                                        ? "best"
                                                                        : ""
                                                                    }`
                                                                }
                                                            >

                                                                <MatchIcon />

                                                                {
                                                                    match.text
                                                                }

                                                            </div>

                                                        </div>



                                                        <span className="opportunity-category">

                                                            {
                                                                opportunity.category ||
                                                                "Opportunity"
                                                            }

                                                        </span>


                                                        <h3>

                                                            {
                                                                opportunity.title
                                                            }

                                                        </h3>


                                                        <p>

                                                            {
                                                                opportunity.description
                                                            }

                                                        </p>



                                                        {/* =========================================
                                                            META
                                                        ========================================= */}

                                                        <div className="opportunity-meta-row">


                                                            {
                                                                opportunity.type && (

                                                                    <div>

                                                                        <span>
                                                                            TYPE
                                                                        </span>

                                                                        <strong>
                                                                            {
                                                                                opportunity.type
                                                                            }
                                                                        </strong>

                                                                    </div>

                                                                )
                                                            }


                                                            {
                                                                opportunity.duration && (

                                                                    <div>

                                                                        <span>
                                                                            PROCESSING
                                                                        </span>

                                                                        <strong>
                                                                            {
                                                                                opportunity.duration
                                                                            }
                                                                        </strong>

                                                                    </div>

                                                                )
                                                            }


                                                            {
                                                                opportunity.salary && (

                                                                    <div>

                                                                        <span>
                                                                            SALARY
                                                                        </span>

                                                                        <strong>
                                                                            {
                                                                                opportunity.salary
                                                                            }
                                                                        </strong>

                                                                    </div>

                                                                )
                                                            }


                                                            {
                                                                opportunity.demand && (

                                                                    <div>

                                                                        <span>
                                                                            DEMAND
                                                                        </span>

                                                                        <strong>
                                                                            {
                                                                                opportunity.demand
                                                                            }
                                                                        </strong>

                                                                    </div>

                                                                )
                                                            }


                                                        </div>


                                                        {/* =========================================
                                                            CTA
                                                        ========================================= */}

                                                        <Link
                                                            to={
                                                                `/opportunities/${opportunity.countrySlug}/${opportunity.slug}`
                                                            }
                                                            className="opportunity-view-button"
                                                        >

                                                            Explore This Pathway

                                                            <HiOutlineArrowRight />

                                                        </Link>

                                                    </div>

                                                </article>

                                            );

                                        }
                                    )

                                )
                                : (

                                    <div className="no-results">

                                        <HiOutlineGlobeAlt />

                                        <h3>
                                            We need a little more
                                            information.
                                        </h3>

                                        <p>
                                            Try adjusting your
                                            assessment answers.
                                        </p>

                                    </div>

                                )

                        }

                    </section>



                    {/* =================================================
                        RESULT FOOTER
                    ================================================= */}

                    <div className="results-footer-message">

                        <HiOutlineSparkles />

                        <div>

                            <strong>
                                Don't see exactly what you expected?
                            </strong>

                            <span>

                                Your preferred destination doesn't
                                limit your options. Explore the
                                pathways above — there may be a
                                stronger route than the one you
                                initially had in mind.

                            </span>

                        </div>

                    </div>



                    <div className="results-disclaimer">

                        <HiOutlineShieldCheck />

                        <span>

                            These are potential matches based on
                            the information provided and available
                            opportunity data. A match does not
                            guarantee eligibility, employment,
                            admission or visa approval.

                        </span>

                    </div>



                    <div className="results-actions">

                        <button
                            type="button"
                            className="secondary-action"
                            onClick={
                                restartAssessment
                            }
                        >

                            Start Again

                        </button>

                    </div>

                </div>

            </main>

        );

    }



    /* ============================================================
       ASSESSMENT PAGE
    ============================================================ */

    return (

        <main className="assessment-page">


            {/* =================================================
                TOP BAR
            ================================================= */}

            <header className="assessment-topbar">

                <Link
                    to="/"
                    className="assessment-brand"
                >

                    <span className="assessment-brand-mark">
                        CM&T
                    </span>


                    <span className="assessment-brand-name">
                        Colossus Migration & Tours
                    </span>

                </Link>


                <div className="assessment-security">

                    <HiOutlineLockClosed />

                    <span>
                        Secure Assessment
                    </span>

                </div>

            </header>



            {/* =================================================
                MAIN LAYOUT
            ================================================= */}

            <div className="assessment-layout">


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="assessment-sidebar">

                    <div>

                        <span className="sidebar-label">
                            YOUR ASSESSMENT
                        </span>


                        <nav className="assessment-steps">

                            {
                                STEPS.map(
                                    (
                                        step,
                                        index
                                    ) => {

                                        const Icon =
                                            step.icon;


                                        const active =
                                            currentStep ===
                                            index + 1;


                                        const completed =
                                            currentStep >
                                            index + 1;


                                        return (

                                            <div
                                                key={
                                                    step.number
                                                }
                                                className={
                                                    `assessment-sidebar-step ${active
                                                        ? "active"
                                                        : ""
                                                    } ${completed
                                                        ? "completed"
                                                        : ""
                                                    }`
                                                }
                                            >

                                                <div className="sidebar-step-number">

                                                    {
                                                        completed
                                                            ? (
                                                                <HiOutlineCheckCircle />
                                                            )
                                                            : (
                                                                <Icon />
                                                            )
                                                    }

                                                </div>


                                                <div>

                                                    <span>
                                                        {
                                                            step.number
                                                        }
                                                    </span>

                                                    <strong>
                                                        {
                                                            step.title
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                        );

                                    }
                                )
                            }

                        </nav>

                    </div>


                    <div className="sidebar-help">

                        <div className="sidebar-help-icon">

                            <HiOutlineShieldCheck />

                        </div>


                        <strong>
                            Need guidance?
                        </strong>


                        <p>

                            A Colossus Migration & Tours
                            specialist can help you understand
                            your results.

                        </p>


                        <button
                            type="button"
                        >
                            Talk to an Expert
                        </button>

                    </div>

                </aside>



                {/* =================================================
                    CONTENT
                ================================================= */}

                <section className="assessment-content">


                    <div className="assessment-content-top">


                        <div className="mobile-step-label">

                            STEP {currentStep}
                            {" "}
                            OF 5

                        </div>


                        <div className="progress-area">

                            <span>
                                {progress}% complete
                            </span>


                            <div className="progress-track">

                                <span
                                    style={{
                                        width:
                                            `${progress}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </div>


                    <div
                        className="assessment-content-inner"
                        key={currentStep}
                    >

                        {renderStep()}

                    </div>



                    {/* =================================================
                        NAVIGATION
                    ================================================= */}

                    <div className="assessment-actions">


                        <button
                            type="button"
                            className="back-action"
                            onClick={
                                previousStep
                            }
                            disabled={
                                currentStep === 1
                            }
                        >

                            <HiOutlineArrowLeft />

                            Back

                        </button>


                        <button
                            type="button"
                            className="next-action"
                            onClick={
                                nextStep
                            }
                            disabled={

                                (
                                    currentStep === 1
                                    &&
                                    !answers.destination
                                )

                                ||

                                (
                                    currentStep === 2
                                    &&
                                    !answers.goal
                                )

                                ||

                                (
                                    currentStep === 4
                                    &&
                                    (
                                        !answers.destination
                                        ||
                                        !answers.goal
                                        ||
                                        !answers.education
                                        ||
                                        !answers.experience
                                    )
                                )

                            }
                        >

                            {
                                currentStep === 4
                                    ? "Find My Pathways"
                                    : "Continue"
                            }


                            <HiOutlineArrowRight />

                        </button>

                    </div>



                    {/* =================================================
                        TRUST
                    ================================================= */}

                    <div className="assessment-trust-strip">


                        <div>

                            <span className="trust-icon">

                                <HiOutlineCheckCircle />

                            </span>


                            <div>

                                <strong>
                                    Free
                                </strong>

                                <span>
                                    No assessment fee
                                </span>

                            </div>

                        </div>


                        <div>

                            <span className="trust-icon">

                                <HiOutlineSparkles />

                            </span>


                            <div>

                                <strong>
                                    Personalized
                                </strong>

                                <span>
                                    Ranked for you
                                </span>

                            </div>

                        </div>


                        <div>

                            <span className="trust-icon">

                                <HiOutlineShieldCheck />

                            </span>


                            <div>

                                <strong>
                                    Expert Support
                                </strong>

                                <span>
                                    Guidance available
                                </span>

                            </div>

                        </div>


                        <div>

                            <span className="trust-icon">

                                <HiOutlineLockClosed />

                            </span>


                            <div>

                                <strong>
                                    Private
                                </strong>

                                <span>
                                    Your answers are secure
                                </span>

                            </div>

                        </div>


                    </div>

                </section>

            </div>

        </main>

    );

};


export default FreeAssessment;