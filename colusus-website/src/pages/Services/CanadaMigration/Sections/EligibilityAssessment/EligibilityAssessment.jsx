import "./EligibilityAssessment.css";

import { useState, useMemo } from "react";

import { useNavigate } from "react-router-dom";

import {
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineShieldCheck,
    HiOutlineGlobeAlt,
    HiOutlineSparkles,
    HiOutlineUserGroup,
    HiOutlineAcademicCap,
    HiOutlineBriefcase,
    HiOutlineChatAlt2,
    HiOutlineLocationMarker,
    HiOutlineRefresh,
    HiOutlineCalendar,
} from "react-icons/hi";

import {
    goals,
    educationLevels,
    experienceLevels,
    englishLevels,
    results,
} from "./data/assessmentData";

import eligibilityBackground from "../../../../../assets/images/countries/eligibility-background.png";


/* =========================================================
   STEP INFORMATION
========================================================= */

const stepInformation = [
    {
        number: "01",
        label: "Migration Goal",
        shortLabel: "Goal",
        icon: HiOutlineGlobeAlt,
    },
    {
        number: "02",
        label: "Age",
        shortLabel: "Age",
        icon: HiOutlineUserGroup,
    },
    {
        number: "03",
        label: "Education",
        shortLabel: "Education",
        icon: HiOutlineAcademicCap,
    },
    {
        number: "04",
        label: "Experience",
        shortLabel: "Experience",
        icon: HiOutlineBriefcase,
    },
    {
        number: "05",
        label: "English",
        shortLabel: "English",
        icon: HiOutlineChatAlt2,
    },
];


/* =========================================================
   QUESTION INFORMATION
========================================================= */

const questionInformation = {

    1: {
        eyebrow: "STEP 01 OF 05",
        number: "01",
        title: "What are you hoping",
        accent: "to achieve?",
        description:
            "Choose the option that best describes your current migration goal.",
    },

    2: {
        eyebrow: "STEP 02 OF 05",
        number: "02",
        title: "How old are",
        accent: "you?",
        description:
            "Your age can influence eligibility for several Canadian immigration programs.",
    },

    3: {
        eyebrow: "STEP 03 OF 05",
        number: "03",
        title: "What is your highest",
        accent: "education level?",
        description:
            "Select your highest completed level of education.",
    },

    4: {
        eyebrow: "STEP 04 OF 05",
        number: "04",
        title: "How much work",
        accent: "experience do you have?",
        description:
            "Tell us about your professional work experience.",
    },

    5: {
        eyebrow: "STEP 05 OF 05",
        number: "05",
        title: "How would you describe",
        accent: "your English level?",
        description:
            "Choose the option that best reflects your current English proficiency.",
    },

};


/* =========================================================
   COMPONENT
========================================================= */

const EligibilityAssessment = () => {

    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        goal: "",
        age: 28,
        education: "",
        experience: "",
        english: "",
    });

    const totalSteps = 5;

    const navigate = useNavigate();


    /* =====================================================
       RESULT
    ===================================================== */

    const result = useMemo(() => {

        return results[form.goal] || results.work;

    }, [form.goal]);


    /* =====================================================
       UPDATE
    ===================================================== */

    const update = (field, value) => {

        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

    };


    /* =====================================================
       NAVIGATION
    ===================================================== */

    const next = () => {

        if (step < totalSteps + 1) {

            setStep((prev) => prev + 1);

        }

    };


    const back = () => {

        if (step > 1) {

            setStep((prev) => prev - 1);

        }

    };


    /* =====================================================
       SELECT + AUTO ADVANCE
    ===================================================== */

    const selectAndNext = (field, value) => {

        update(field, value);

        setTimeout(() => {
            setStep((prev) => prev + 1);
        }, 360);

    };


    /* =====================================================
       PROGRESS
    ===================================================== */

    const progress =
        step <= totalSteps
            ? ((step - 1) / totalSteps) * 100
            : 100;


    /* =====================================================
       VALIDATION
    ===================================================== */

    const canContinue = () => {

        if (step === 1) {
            return Boolean(form.goal);
        }

        if (step === 2) {
            return Boolean(form.age);
        }

        if (step === 3) {
            return Boolean(form.education);
        }

        if (step === 4) {
            return Boolean(form.experience);
        }

        if (step === 5) {
            return Boolean(form.english);
        }

        return true;

    };


    /* =====================================================
       CONSULTATION
    ===================================================== */

    const handleBookConsultation = () => {

        navigate("/consultation");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    /* =====================================================
       RETAKE
    ===================================================== */

    const handleRetake = () => {

        setForm({
            goal: "",
            age: 28,
            education: "",
            experience: "",
            english: "",
        });

        setStep(1);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    const currentQuestion =
        step <= totalSteps
            ? questionInformation[step]
            : null;


    return (

        <section
            className="eligibility"
            style={{
                "--eligibility-background":
                    `url(${eligibilityBackground})`,
            }}
        >


            {/* =================================================
                CANADA BACKGROUND
            ================================================= */}

            <div
                className="eligibility-background"
                aria-hidden="true"
            >

                <div className="eligibility-background-image"></div>

                <div className="eligibility-background-shade"></div>

                <div className="eligibility-background-glow"></div>

                <span className="eligibility-orbit eligibility-orbit-one" />
                <span className="eligibility-orbit eligibility-orbit-two" />
                <span className="eligibility-orbit eligibility-orbit-three" />

                <span className="eligibility-route eligibility-route-one" />
                <span className="eligibility-route eligibility-route-two" />

                <span className="eligibility-particle eligibility-particle-one" />
                <span className="eligibility-particle eligibility-particle-two" />
                <span className="eligibility-particle eligibility-particle-three" />
                <span className="eligibility-particle eligibility-particle-four" />

            </div>


            {/* =================================================
                PREMIUM ASSESSMENT SHELL
            ================================================= */}

            <div className="eligibility-shell">


                {/* =================================================
                    LEFT SIDEBAR
                ================================================= */}

                <aside className="eligibility-sidebar">


                    {/* BRAND */}

                    <div className="eligibility-brand">

                        <div className="eligibility-brand-mark">

                            <HiOutlineGlobeAlt />

                        </div>

                        <div className="eligibility-brand-copy">

                            <strong>
                                Canada Pathways
                            </strong>

                            <span>
                                Eligibility Assessment
                            </span>

                        </div>

                    </div>


                    {/* SIDEBAR INTRO */}

                    <div className="eligibility-sidebar-copy">

                        <span className="sidebar-eyebrow">
                            YOUR NEXT DESTINATION
                        </span>

                        <h2>

                            Discover your

                            <span>
                                Canada pathway.
                            </span>

                        </h2>

                        <p>
                            Answer five simple questions and discover
                            the immigration option that may fit your
                            profile.
                        </p>

                    </div>


                    {/* =================================================
                        DESTINATION CARD
                    ================================================= */}

                    <div className="eligibility-destination-card">


                        <div className="destination-visual">


                            <div className="destination-globe">

                                <HiOutlineGlobeAlt />

                            </div>


                            <span className="destination-route route-a" />

                            <span className="destination-route route-b" />


                            <span className="destination-point destination-point-a" />

                            <span className="destination-point destination-point-b" />


                            <div className="destination-plane">

                                <HiOutlineArrowRight />

                            </div>


                        </div>


                        <div className="destination-copy">

                            <span>
                                DESTINATION
                            </span>

                            <strong>
                                Canada
                            </strong>

                            <small>
                                Your journey starts with understanding
                                your options.
                            </small>

                        </div>


                    </div>


                    {/* =================================================
                        SIDEBAR STEPS
                    ================================================= */}

                    <div className="sidebar-step-list">


                        {stepInformation.map((item, index) => {

                            const Icon = item.icon;

                            const itemStep = index + 1;

                            const active =
                                step === itemStep;

                            const completed =
                                step > itemStep;


                            return (

                                <div
                                    key={item.number}
                                    className={`
                                        sidebar-step
                                        ${active ? "active" : ""}
                                        ${completed ? "completed" : ""}
                                    `}
                                >

                                    <div className="sidebar-step-icon">

                                        {completed ? (

                                            <HiOutlineCheckCircle />

                                        ) : (

                                            <Icon />

                                        )}

                                    </div>


                                    <div className="sidebar-step-copy">

                                        <span>
                                            {item.number}
                                        </span>

                                        <strong>
                                            {item.label}
                                        </strong>

                                    </div>

                                </div>

                            );

                        })}


                    </div>


                    {/* =================================================
                        SECURITY
                    ================================================= */}

                    <div className="eligibility-trust">

                        <div className="trust-icon">

                            <HiOutlineShieldCheck />

                        </div>

                        <div>

                            <strong>
                                Private & Secure
                            </strong>

                            <span>
                                Your answers remain confidential.
                            </span>

                        </div>

                    </div>


                </aside>


                {/* =================================================
                    RIGHT MAIN PANEL
                ================================================= */}

                <main className="eligibility-main">


                    {/* =================================================
                        TOP BAR
                    ================================================= */}

                    <div className="eligibility-topbar">


                        <div className="assessment-counter">

                            <span>

                                {step <= totalSteps
                                    ? `QUESTION ${String(step).padStart(2, "0")}`
                                    : "ASSESSMENT COMPLETE"
                                }

                            </span>

                        </div>


                        <div className="assessment-time">

                            <HiOutlineSparkles />

                            <span>
                                Takes about 2 minutes
                            </span>

                        </div>


                    </div>


                    {/* =================================================
                        HEADER + PROGRESS
                    ================================================= */}

                    {step <= totalSteps && (

                        <>

                            <div className="assessment-intro">


                                <div className="assessment-intro-copy">

                                    <span className="assessment-tag">

                                        <span>
                                            🇨🇦
                                        </span>

                                        FREE ELIGIBILITY ASSESSMENT

                                    </span>


                                    <h1>

                                        Find Your

                                        <span>
                                            Canada Pathway.
                                        </span>

                                    </h1>


                                    <p>
                                        Answer a few quick questions
                                        and discover the immigration
                                        pathway best suited for your
                                        profile.
                                    </p>

                                </div>


                                <div className="assessment-art">


                                    <div className="art-flag">
                                        🇨🇦
                                    </div>


                                    <div className="art-shield">

                                        <HiOutlineShieldCheck />

                                    </div>


                                    <span className="art-star star-one" />
                                    <span className="art-star star-two" />
                                    <span className="art-star star-three" />

                                </div>


                            </div>


                            <div className="assessment-progress-area">


                                <div className="assessment-progress-labels">

                                    <span>
                                        Step {step} of {totalSteps}
                                    </span>

                                    <strong>
                                        {Math.round(progress)}% Complete
                                    </strong>

                                </div>


                                <div className="assessment-progress-track">

                                    <div
                                        className="assessment-progress-fill"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />

                                </div>


                                <div className="assessment-step-indicators">


                                    {stepInformation.map(
                                        (item, index) => {

                                            const Icon = item.icon;

                                            const itemStep =
                                                index + 1;

                                            const active =
                                                step === itemStep;

                                            const completed =
                                                step > itemStep;


                                            return (

                                                <div
                                                    key={item.number}
                                                    className={`
                                                        assessment-step-indicator
                                                        ${active ? "active" : ""}
                                                        ${completed ? "completed" : ""}
                                                    `}
                                                >

                                                    <div className="indicator-circle">

                                                        {completed ? (

                                                            <HiOutlineCheckCircle />

                                                        ) : (

                                                            <Icon />

                                                        )}

                                                    </div>

                                                    <span>
                                                        {item.shortLabel}
                                                    </span>

                                                </div>

                                            );

                                        }
                                    )}


                                </div>


                            </div>

                        </>

                    )}


                    {/* =================================================
                        QUESTION AREA
                    ================================================= */}

                    {step <= totalSteps && currentQuestion && (

                        <div
                            key={step}
                            className={`
                                assessment-question-area
                                question-step-${step}
                            `}
                        >


                            {/* QUESTION HEADER */}

                            <div className="assessment-question-header">


                                <div className="question-number">

                                    <span>
                                        {currentQuestion.number}
                                    </span>

                                </div>


                                <div className="question-copy">

                                    <span className="question-eyebrow">
                                        {currentQuestion.eyebrow}
                                    </span>

                                    <h2>

                                        {currentQuestion.title}

                                        <span>
                                            {currentQuestion.accent}
                                        </span>

                                    </h2>

                                    <p>
                                        {currentQuestion.description}
                                    </p>

                                </div>


                            </div>


                            {/* =================================================
                                STEP 1 — GOAL
                            ================================================= */}

                            {step === 1 && (

                                <div className="assessment-options goal-options">


                                    {goals.map((item, index) => {

                                        const Icon = item.icon;

                                        const selected =
                                            form.goal === item.id;


                                        return (

                                            <button
                                                key={item.id}
                                                type="button"
                                                className={`
                                                    assessment-option
                                                    goal-option
                                                    ${selected ? "selected" : ""}
                                                `}
                                                onClick={() =>
                                                    selectAndNext(
                                                        "goal",
                                                        item.id
                                                    )
                                                }
                                                style={{
                                                    "--option-index":
                                                        index,
                                                }}
                                            >


                                                <div className="option-icon">

                                                    <Icon />

                                                </div>


                                                <div className="option-copy">

                                                    <strong>
                                                        {item.title}
                                                    </strong>

                                                    <span>
                                                        {item.subtitle}
                                                    </span>

                                                </div>


                                                <div className="option-arrow">

                                                    {selected ? (

                                                        <HiOutlineCheckCircle />

                                                    ) : (

                                                        <HiOutlineArrowRight />

                                                    )}

                                                </div>


                                            </button>

                                        );

                                    })}


                                </div>

                            )}


                            {/* =================================================
                                STEP 2 — AGE
                            ================================================= */}

                            {step === 2 && (

                                <div className="age-assessment">


                                    <div className="age-display">

                                        <span>
                                            YOUR AGE
                                        </span>

                                        <div>

                                            <strong>
                                                {form.age}
                                            </strong>

                                            <small>
                                                years old
                                            </small>

                                        </div>

                                    </div>


                                    <div className="age-slider-wrapper">


                                        <div className="age-slider-labels">

                                            <span>
                                                18
                                            </span>

                                            <strong>
                                                Select your age
                                            </strong>

                                            <span>
                                                60
                                            </span>

                                        </div>


                                        <input
                                            type="range"
                                            min="18"
                                            max="60"
                                            value={form.age}
                                            onChange={(e) =>
                                                update(
                                                    "age",
                                                    Number(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                            className="assessment-range"
                                            style={{
                                                "--range-progress":
                                                    `${(
                                                        (form.age - 18) /
                                                        42
                                                    ) * 100}%`,
                                            }}
                                        />


                                        <div className="age-scale">

                                            <span>
                                                18
                                            </span>

                                            <span>
                                                25
                                            </span>

                                            <span>
                                                35
                                            </span>

                                            <span>
                                                45
                                            </span>

                                            <span>
                                                60
                                            </span>

                                        </div>


                                    </div>


                                    <div className="age-note">

                                        <HiOutlineSparkles />

                                        <span>
                                            Age is one of several factors
                                            considered during an immigration
                                            assessment.
                                        </span>

                                    </div>


                                </div>

                            )}


                            {/* =================================================
                                STEP 3 — EDUCATION
                            ================================================= */}

                            {step === 3 && (

                                <div className="assessment-options pill-options">


                                    {educationLevels.map(
                                        (item, index) => {

                                            const selected =
                                                form.education === item;


                                            return (

                                                <button
                                                    key={item}
                                                    type="button"
                                                    className={`
                                                        assessment-pill-option
                                                        ${selected
                                                            ? "selected"
                                                            : ""
                                                        }
                                                    `}
                                                    onClick={() =>
                                                        selectAndNext(
                                                            "education",
                                                            item
                                                        )
                                                    }
                                                >


                                                    <span className="pill-number">

                                                        {String(
                                                            index + 1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )}

                                                    </span>


                                                    <span>
                                                        {item}
                                                    </span>


                                                    <i>

                                                        {selected ? (

                                                            <HiOutlineCheckCircle />

                                                        ) : (

                                                            <HiOutlineArrowRight />

                                                        )}

                                                    </i>


                                                </button>

                                            );

                                        }
                                    )}


                                </div>

                            )}


                            {/* =================================================
                                STEP 4 — EXPERIENCE
                            ================================================= */}

                            {step === 4 && (

                                <div className="assessment-options pill-options">


                                    {experienceLevels.map(
                                        (item, index) => {

                                            const selected =
                                                form.experience === item;


                                            return (

                                                <button
                                                    key={item}
                                                    type="button"
                                                    className={`
                                                        assessment-pill-option
                                                        ${selected
                                                            ? "selected"
                                                            : ""
                                                        }
                                                    `}
                                                    onClick={() =>
                                                        selectAndNext(
                                                            "experience",
                                                            item
                                                        )
                                                    }
                                                >

                                                    <span className="pill-number">

                                                        {String(
                                                            index + 1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )}

                                                    </span>


                                                    <span>
                                                        {item}
                                                    </span>


                                                    <i>

                                                        {selected ? (

                                                            <HiOutlineCheckCircle />

                                                        ) : (

                                                            <HiOutlineArrowRight />

                                                        )}

                                                    </i>


                                                </button>

                                            );

                                        }
                                    )}


                                </div>

                            )}


                            {/* =================================================
                                STEP 5 — ENGLISH
                            ================================================= */}

                            {step === 5 && (

                                <div className="assessment-options pill-options">


                                    {englishLevels.map(
                                        (item, index) => {

                                            const selected =
                                                form.english === item;


                                            return (

                                                <button
                                                    key={item}
                                                    type="button"
                                                    className={`
                                                        assessment-pill-option
                                                        ${selected
                                                            ? "selected"
                                                            : ""
                                                        }
                                                    `}
                                                    onClick={() =>
                                                        selectAndNext(
                                                            "english",
                                                            item
                                                        )
                                                    }
                                                >

                                                    <span className="pill-number">

                                                        {String(
                                                            index + 1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )}

                                                    </span>


                                                    <span>
                                                        {item}
                                                    </span>


                                                    <i>

                                                        {selected ? (

                                                            <HiOutlineCheckCircle />

                                                        ) : (

                                                            <HiOutlineArrowRight />

                                                        )}

                                                    </i>


                                                </button>

                                            );

                                        }
                                    )}


                                </div>

                            )}


                            {/* =================================================
                                NAVIGATION
                            ================================================= */}

                            <div className="assessment-navigation">


                                <button
                                    type="button"
                                    onClick={back}
                                    disabled={step === 1}
                                    className="assessment-back"
                                >

                                    <HiOutlineArrowLeft />

                                    <span>
                                        Back
                                    </span>

                                </button>


                                <div className="navigation-helper">

                                    <span>

                                        {step === totalSteps
                                            ? "Ready to see your result?"
                                            : "Your answers are saved automatically."
                                        }

                                    </span>

                                </div>


                                <button
                                    type="button"
                                    onClick={next}
                                    disabled={!canContinue()}
                                    className="assessment-next"
                                >

                                    <span>

                                        {step === totalSteps
                                            ? "See My Result"
                                            : "Continue"
                                        }

                                    </span>

                                    <HiOutlineArrowRight />

                                </button>


                            </div>


                        </div>

                    )}


                    {/* =================================================
                        RESULT
                    ================================================= */}

                    {step === 6 && (

                        <div className="assessment-result">


                            <div className="result-success-icon">

                                <HiOutlineCheckCircle />

                            </div>


                            <span className="result-eyebrow">
                                ASSESSMENT COMPLETE
                            </span>


                            <h1>

                                Your Canada pathway

                                <span>
                                    starts here.
                                </span>

                            </h1>


                            <p className="result-intro">

                                Based on the information you provided,
                                this is the pathway that best matches
                                your current profile.

                            </p>


                            {/* RESULT RECOMMENDATION */}

                            <div className="result-recommendation">


                                <div className="result-recommendation-icon">

                                    <HiOutlineGlobeAlt />

                                </div>


                                <div className="result-recommendation-copy">

                                    <span>
                                        RECOMMENDED PATHWAY
                                    </span>

                                    <h2>
                                        {result.title}
                                    </h2>

                                    <p>
                                        {result.description}
                                    </p>

                                </div>


                                <div className="result-score">

                                    <strong>
                                        {result.score}
                                    </strong>

                                    <span>
                                        Match
                                    </span>

                                </div>


                            </div>


                            {/* PROFILE SNAPSHOT */}

                            <div className="result-profile">


                                <div className="result-profile-heading">

                                    <span>
                                        YOUR PROFILE
                                    </span>

                                    <strong>
                                        Assessment snapshot
                                    </strong>

                                </div>


                                <div className="result-profile-items">


                                    <div>

                                        <HiOutlineGlobeAlt />

                                        <span>
                                            {
                                                goals.find(
                                                    item =>
                                                        item.id ===
                                                        form.goal
                                                )?.title ||
                                                "Not selected"
                                            }
                                        </span>

                                    </div>


                                    <div>

                                        <HiOutlineUserGroup />

                                        <span>
                                            {form.age} years old
                                        </span>

                                    </div>


                                    <div>

                                        <HiOutlineAcademicCap />

                                        <span>
                                            {form.education ||
                                                "Not selected"}
                                        </span>

                                    </div>


                                    <div>

                                        <HiOutlineBriefcase />

                                        <span>
                                            {form.experience ||
                                                "Not selected"}
                                        </span>

                                    </div>


                                    <div>

                                        <HiOutlineChatAlt2 />

                                        <span>
                                            {form.english ||
                                                "Not selected"}
                                        </span>

                                    </div>


                                </div>


                            </div>


                            {/* ACTIONS */}

                            <div className="result-actions">


                                <button
                                    type="button"
                                    className="result-primary"
                                    onClick={
                                        handleBookConsultation
                                    }
                                >

                                    <HiOutlineCalendar />

                                    <span>
                                        Book Free Consultation
                                    </span>

                                    <HiOutlineArrowRight />

                                </button>


                                <button
                                    type="button"
                                    className="result-secondary"
                                    onClick={handleRetake}
                                >

                                    <HiOutlineRefresh />

                                    <span>
                                        Retake Assessment
                                    </span>

                                </button>


                            </div>


                            {/* TRUST */}

                            <div className="result-trust-row">


                                <div>

                                    <HiOutlineShieldCheck />

                                    <span>
                                        Private & Secure
                                    </span>

                                </div>


                                <div>

                                    <HiOutlineUserGroup />

                                    <span>
                                        Expert Guidance
                                    </span>

                                </div>


                                <div>

                                    <HiOutlineLocationMarker />

                                    <span>
                                        Canada Focused
                                    </span>

                                </div>


                            </div>


                        </div>

                    )}


                </main>


            </div>


        </section>

    );

};


export default EligibilityAssessment;