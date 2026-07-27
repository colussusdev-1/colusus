import "./EligibilityAssessment.css";

import { useState, useMemo } from "react";

import { useNavigate } from "react-router-dom";

import {
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
} from "react-icons/hi";

import {
    goals,
    educationLevels,
    experienceLevels,
    englishLevels,
    results,
} from "./data/assessmentData";

/* =========================
   MAIN COMPONENT
========================= */

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

    /* =========================
       DERIVED RESULT
    ========================= */

    const result = useMemo(() => {

        return results[form.goal] || results.work;

    }, [form.goal]);

    /* =========================
       UPDATE STATE
    ========================= */

    const update = (field, value) => {

        setForm((prev) => ({

            ...prev,

            [field]: value,

        }));

    };

    /* =========================
       NAVIGATION
    ========================= */

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

    /* =========================
       AUTO ADVANCE
    ========================= */

    const selectAndNext = (field, value) => {

        update(field, value);

        setTimeout(() => {

            next();

        }, 200);

    };

    /* =========================
       PROGRESS
    ========================= */

    const progress = (step / totalSteps) * 100;

    const navigate = useNavigate();

    const handleBookConsultation = () => {

        navigate("/consultation");

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };

    return (

        <div className="eligibility">

            <div className="container">

                <div className="wizard">

                    {/* HEADER */}

                    <div className="wizard-header">

                        <span className="wizard-tag">

                            FREE ELIGIBILITY ASSESSMENT

                        </span>

                        <h2>

                            Find Your

                            <span> Canada Pathway.</span>

                        </h2>

                        <p>

                            Answer a few quick questions and discover
                            the immigration pathway best suited for your profile.

                        </p>

                    </div>

                    {/* PROGRESS */}

                    <div className="wizard-progress-wrapper">

                        <span>

                            Step {step} of {totalSteps}

                        </span>

                        <span>

                            {Math.round(progress)}%

                        </span>

                    </div>

                    <div className="wizard-progress">

                        <div
                            className="wizard-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* =========================
                        STEP CONTENT
                    ========================= */}

                    {step === 1 && (
                        <div className="wizard-step">
                            <h3>What is your goal?</h3>

                            <div className="goal-grid">

                                {goals.map((item) => {

                                    const Icon = item.icon;

                                    return (
                                        <button
                                            key={item.id}
                                            className={`goal-card ${form.goal === item.id ? "active" : ""}`}
                                            onClick={() => selectAndNext("goal", item.id)}
                                        >
                                            <Icon />
                                            <strong>{item.title}</strong>
                                            <small>{item.subtitle}</small>
                                        </button>
                                    );
                                })}

                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="wizard-step">
                            <h3>How old are you?</h3>

                            <input
                                type="range"
                                min="18"
                                max="60"
                                value={form.age}
                                onChange={(e) => update("age", e.target.value)}
                            />

                            <div className="age-value">
                                {form.age} years
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="wizard-step">
                            <h3>Education level</h3>

                            <div className="option-list">
                                {educationLevels.map((item) => (
                                    <button
                                        key={item}
                                        className={form.education === item ? "active" : ""}
                                        onClick={() => selectAndNext("education", item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="wizard-step">
                            <h3>Work experience</h3>

                            <div className="option-list">
                                {experienceLevels.map((item) => (
                                    <button
                                        key={item}
                                        className={form.experience === item ? "active" : ""}
                                        onClick={() => selectAndNext("experience", item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="wizard-step">
                            <h3>English level</h3>

                            <div className="option-list">
                                {englishLevels.map((item) => (
                                    <button
                                        key={item}
                                        className={form.english === item ? "active" : ""}
                                        onClick={() => selectAndNext("english", item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <div className="wizard-result">

                            <HiOutlineCheckCircle />

                            <h3>Your Recommended Pathway</h3>

                            <h2>{result.title}</h2>

                            <span>{result.score}</span>

                            <p>{result.description}</p>

                            <div className="result-actions">

                                <button

                                    className="primary"

                                    onClick={handleBookConsultation}

                                >

                                    Book Consultation

                                </button>

                            </div>

                        </div>
                    )}

                    {/* NAVIGATION */}

                    {step <= totalSteps && (
                        <div className="wizard-nav">

                            <button
                                onClick={back}
                                disabled={step === 1}
                                className="back"
                            >
                                <HiOutlineArrowLeft />
                                Back
                            </button>

                            <button
                                onClick={next}
                                disabled={
                                    (step === 1 && !form.goal) ||
                                    (step === 3 && !form.education) ||
                                    (step === 4 && !form.experience) ||
                                    (step === 5 && !form.english)
                                }
                                className="next"
                            >
                                {step === totalSteps ? "View Result" : "Next"}
                                <HiOutlineArrowRight />
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default EligibilityAssessment;