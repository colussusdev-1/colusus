import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    HiOutlineArrowRight,
    HiOutlineCheck,
    HiOutlineGlobeAlt,
    HiOutlineRefresh,
    HiOutlineSparkles,
} from "react-icons/hi";

import {
    createAssessment,
} from "./engine/assessmentEngine";

import "./Assessment.css";


/*
|--------------------------------------------------------------------------
| ASSESSMENT
|--------------------------------------------------------------------------
*/

const Assessment = () => {
    const assessment = useMemo(
        () => createAssessment(),
        [],
    );

    const [assessmentState, setAssessmentState] = useState({
        answers: {},
        currentQuestion: null,
        completed: false,
        results: [],
        loading: true,
        error: null,
    });

    const [selectedValue, setSelectedValue] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [retryKey, setRetryKey] = useState(0);

    /*
    |--------------------------------------------------------------------------
    | INITIALIZE ASSESSMENT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let cancelled = false;

        const initialize = async () => {
            setAssessmentState((previous) => ({
                ...previous,
                loading: true,
                error: null,
            }));

            try {
                const nextState = await assessment.start();

                if (!cancelled) {
                    setAssessmentState(nextState);
                    setSelectedValue(null);
                }
            } catch (error) {
                if (!cancelled) {
                    setAssessmentState((previous) => ({
                        ...previous,
                        loading: false,
                        currentQuestion: null,
                        error:
                            error?.message ||
                            "We couldn't load the available pathways. Please try again.",
                    }));
                }
            }
        };

        initialize();

        return () => {
            cancelled = true;
        };
    }, [assessment, retryKey]);

    /*
    |--------------------------------------------------------------------------
    | CURRENT QUESTION
    |--------------------------------------------------------------------------
    */

    const question = assessmentState.currentQuestion;

    /*
    |--------------------------------------------------------------------------
    | ANSWERED COUNT
    |--------------------------------------------------------------------------
    */

    const answeredCount = Object.keys(
        assessmentState.answers || {},
    ).length;

    /*
    |--------------------------------------------------------------------------
    | TOTAL QUESTIONS
    |--------------------------------------------------------------------------
    */

    const totalQuestions = 6;

    /*
    |--------------------------------------------------------------------------
    | PROGRESS
    |--------------------------------------------------------------------------
    */

    const progress = assessmentState.completed
        ? 100
        : Math.min(
            Math.round(
                (answeredCount / totalQuestions) * 100,
            ),
            95,
        );

    /*
    |--------------------------------------------------------------------------
    | STEP
    |--------------------------------------------------------------------------
    */

    const stepNumber = assessmentState.completed
        ? totalQuestions
        : answeredCount + 1;

    /*
    |--------------------------------------------------------------------------
    | SYNC SELECTED VALUE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!question) {
            setSelectedValue(null);
            return;
        }

        setSelectedValue(
            assessmentState.answers?.[question.id] ?? null,
        );
    }, [question, assessmentState.answers]);

    /*
    |--------------------------------------------------------------------------
    | SELECT ANSWER
    |--------------------------------------------------------------------------
    */

    const handleSelect = (option) => {
        if (
            isTransitioning ||
            assessmentState.loading ||
            !question
        ) {
            return;
        }

        setSelectedValue(option.value);
        setIsTransitioning(true);

        window.setTimeout(() => {
            try {
                const nextState = assessment.answer(
                    question.id,
                    option.value,
                );

                setAssessmentState(nextState);
            } finally {
                setIsTransitioning(false);
            }
        }, 320);
    };

    /*
    |--------------------------------------------------------------------------
    | RESET
    |--------------------------------------------------------------------------
    */

    const handleReset = async () => {
        if (assessmentState.loading) {
            return;
        }

        setSelectedValue(null);
        setIsTransitioning(false);

        try {
            const nextState = await assessment.reset();

            setAssessmentState(nextState);
        } catch (error) {
            setAssessmentState((previous) => ({
                ...previous,
                loading: false,
                currentQuestion: null,
                error:
                    error?.message ||
                    "Unable to restart the assessment. Please try again.",
            }));
        }
    };

    /*
    |--------------------------------------------------------------------------
    | RETRY
    |--------------------------------------------------------------------------
    */

    const handleRetry = () => {
        setSelectedValue(null);
        setRetryKey((previous) => previous + 1);
    };

    /*
    |--------------------------------------------------------------------------
    | RESULTS
    |--------------------------------------------------------------------------
    */

    if (assessmentState.completed) {
        return (
            <AssessmentResults
                results={assessmentState.results}
                onReset={handleReset}
            />
        );
    }

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <main className="assessment-page">

            {/* ATMOSPHERE */}

            <div
                className="assessment-atmosphere"
                aria-hidden="true"
            >
                <span className="assessment-orb assessment-orb-one" />
                <span className="assessment-orb assessment-orb-two" />
                <span className="assessment-light assessment-light-one" />
                <span className="assessment-light assessment-light-two" />
            </div>

            <div className="assessment-container">

                {/* TOP BAR */}

                <header className="assessment-topbar">

                    <div className="assessment-brand-mark">

                        <span>
                            <HiOutlineGlobeAlt />
                        </span>

                        <div>
                            <strong>YOUR JOURNEY</strong>

                            <small>
                                Personalized pathway assessment
                            </small>
                        </div>

                    </div>

                    <div className="assessment-progress-counter">

                        <span>STEP</span>

                        <strong>
                            {String(stepNumber).padStart(2, "0")}
                        </strong>

                        <i>/</i>

                        <span>
                            {String(totalQuestions).padStart(2, "0")}
                        </span>

                    </div>

                </header>

                {/* PROGRESS */}

                <div className="assessment-progress-wrap">

                    <div className="assessment-progress-track">
                        <span
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>

                    <div className="assessment-progress-meta">

                        <span>
                            {assessmentState.loading
                                ? "Preparing your assessment"
                                : assessmentState.error
                                    ? "Unable to continue"
                                    : progress === 0
                                        ? "Let's begin"
                                        : progress >= 95
                                            ? "Almost there"
                                            : "Building your profile"}
                        </span>

                        <strong>{progress}%</strong>

                    </div>

                </div>

                {/* LOADING */}

                {assessmentState.loading && (
                    <section className="assessment-question is-entering">

                        <div className="assessment-copy">

                            <h1>
                                Preparing your journey.
                            </h1>

                            <p>
                                We're loading the latest available
                                pathways so your recommendations reflect
                                current opportunities.
                            </p>

                        </div>

                        <div
                            role="status"
                            aria-live="polite"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginTop: "32px",
                            }}
                        >

                            <span
                                aria-hidden="true"
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    border: "2px solid currentColor",
                                    borderRightColor: "transparent",
                                    borderRadius: "50%",
                                    animation:
                                        "assessment-spin 0.8s linear infinite",
                                    flexShrink: 0,
                                }}
                            />

                            Loading current opportunities...

                        </div>

                    </section>
                )}

                {/* ERROR */}

                {!assessmentState.loading && assessmentState.error && (
                    <section className="assessment-question is-entering">

                        <div className="assessment-copy">

                            <h1>
                                We couldn't load your pathways.
                            </h1>

                            <p>
                                {assessmentState.error}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={handleRetry}
                            className="assessment-result-link"
                            style={{
                                marginTop: "28px",
                                cursor: "pointer",
                            }}
                        >

                            <span>Try again</span>

                            <span>
                                <HiOutlineRefresh />
                            </span>

                        </button>

                    </section>
                )}

                {/* QUESTION */}

                {!assessmentState.loading &&
                    !assessmentState.error &&
                    question && (
                        <section
                            key={question.id}
                            className={`assessment-question ${isTransitioning
                                    ? "is-leaving"
                                    : "is-entering"
                                }`}
                        >

                            {/* HEADING */}

                            <div className="assessment-question-heading">

                                <div className="assessment-step-pill">

                                    <span>
                                        {String(stepNumber).padStart(2, "0")}
                                    </span>

                                    <i />

                                    <span>
                                        {question.eyebrow || "YOUR JOURNEY"}
                                    </span>

                                </div>

                                <div className="assessment-live-indicator">
                                    <span />
                                    Tailoring your journey
                                </div>

                            </div>

                            {/* TITLE */}

                            <div className="assessment-copy">

                                <h1>{question.title}</h1>

                                <p>{question.subtitle}</p>

                            </div>

                            {/* OPTIONS */}

                            <div
                                className={`assessment-options ${question.options?.length > 4
                                        ? "is-dense"
                                        : ""
                                    }`}
                            >

                                {question.options?.map((option, index) => {
                                    const isSelected =
                                        selectedValue === option.value;

                                    return (
                                        <button
                                            type="button"
                                            key={option.value}
                                            className={`assessment-option ${isSelected
                                                    ? "is-selected"
                                                    : ""
                                                }`}
                                            style={{
                                                "--option-index": index,
                                            }}
                                            disabled={isTransitioning}
                                            onClick={() => handleSelect(option)}
                                        >

                                            <span className="assessment-option-index">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <span className="assessment-option-icon">
                                                <span>{option.icon}</span>
                                            </span>

                                            <span className="assessment-option-content">

                                                <strong>{option.label}</strong>

                                                {option.description && (
                                                    <small>
                                                        {option.description}
                                                    </small>
                                                )}

                                            </span>

                                            <span className="assessment-option-end">

                                                <span className="assessment-option-check">
                                                    {isSelected
                                                        ? <HiOutlineCheck />
                                                        : <HiOutlineArrowRight />}
                                                </span>

                                            </span>

                                            <span className="assessment-option-shine" />

                                        </button>
                                    );
                                })}

                            </div>

                            {/* FOOTER */}

                            <div className="assessment-question-footer">

                                <div className="assessment-trust">

                                    <span className="assessment-trust-icon">
                                        <HiOutlineSparkles />
                                    </span>

                                    <span>
                                        Your answers help us
                                        personalize what comes next.
                                    </span>

                                </div>

                                <div className="assessment-key-hint">

                                    <span>SELECT AN OPTION</span>

                                    <i />

                                    <span>CONTINUE</span>

                                </div>

                            </div>

                        </section>
                    )}

            </div>

            <style>
                {`
                    @keyframes assessment-spin {
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>

        </main>
    );
};


/*
|--------------------------------------------------------------------------
| RESULTS
|--------------------------------------------------------------------------
*/

const AssessmentResults = ({
    results = [],
    onReset,
}) => {
    return (
        <main className="assessment-results-page">

            <div
                className="assessment-atmosphere"
                aria-hidden="true"
            >
                <span className="assessment-orb assessment-orb-one" />
                <span className="assessment-orb assessment-orb-two" />
                <span className="assessment-light assessment-light-one" />
                <span className="assessment-light assessment-light-two" />
            </div>

            <div className="assessment-results-container">

                {/* RESULT INTRO */}

                <header className="assessment-results-header">

                    <div className="assessment-result-badge">
                        <span>
                            <HiOutlineSparkles />
                        </span>

                        Assessment complete
                    </div>

                    <h1>
                        We found pathways
                        <span> worth exploring.</span>
                    </h1>

                    <p>
                        Your answers helped us narrow down
                        opportunities that may fit the direction
                        you're considering.
                    </p>

                    <div className="assessment-result-stats">

                        <div>
                            <strong>{results.length}</strong>
                            <span>pathways</span>
                        </div>

                        <i />

                        <div>
                            <strong>
                                {new Set(
                                    results.map((item) => item.countryId),
                                ).size}
                            </strong>

                            <span>destinations</span>
                        </div>

                    </div>

                </header>

                {/* RESULTS */}

                {results.length > 0 ? (

                    <section className="assessment-results-grid">

                        {results.map((opportunity, index) => (
                            <OpportunityResultCard
                                key={`${opportunity.countrySlug}-${opportunity.id}-${index}`}
                                opportunity={opportunity}
                                index={index}
                            />
                        ))}

                    </section>

                ) : (

                    <div className="assessment-empty">

                        <div>
                            <HiOutlineGlobeAlt />
                        </div>

                        <h2>
                            More possibilities are waiting.
                        </h2>

                        <p>
                            Let's take another look at your
                            journey and explore a wider range
                            of pathways.
                        </p>

                    </div>

                )}

                {/* FOOTER */}

                <footer className="assessment-results-footer">

                    <div>

                        <span className="assessment-footer-label">
                            KEEP EXPLORING
                        </span>

                        <strong>
                            Your first result isn't necessarily
                            your final destination.
                        </strong>

                        <p>
                            Compare pathways and discover
                            where your profile could take you.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onReset}
                    >
                        <HiOutlineRefresh />
                        Start again
                    </button>

                </footer>

            </div>

        </main>
    );
};


/*
|--------------------------------------------------------------------------
| RESULT CARD
|--------------------------------------------------------------------------
*/

const OpportunityResultCard = ({
    opportunity,
    index,
}) => {
    const image =
        opportunity.image ||
        opportunity.countryImage;

    const flag =
        opportunity.countryFlag ||
        opportunity.icon ||
        "🌍";

    const countrySlug = opportunity.countrySlug;
    const opportunitySlug = opportunity.slug;

    const href =
        countrySlug && opportunitySlug
            ? `/opportunities/${encodeURIComponent(countrySlug)}/${encodeURIComponent(opportunitySlug)}`
            : "/opportunities";

    return (
        <article
            className="assessment-result-card"
            style={{
                "--result-index": index,
            }}
        >

            {/* IMAGE */}

            <div className="assessment-result-image">

                {image ? (

                    <img
                        src={image}
                        alt={opportunity.title || "Opportunity"}
                        loading={index < 2 ? "eager" : "lazy"}
                    />

                ) : (

                    <div className="assessment-result-image-fallback">
                        <HiOutlineGlobeAlt />
                    </div>

                )}

                <div className="assessment-result-image-overlay" />

                <div className="assessment-result-country">

                    <span>{flag}</span>

                    <strong>{opportunity.countryName}</strong>

                </div>

                <span className="assessment-result-number">
                    {String(index + 1).padStart(2, "0")}
                </span>

            </div>

            {/* CONTENT */}

            <div className="assessment-result-content">

                <div className="assessment-result-category">

                    <span>
                        {opportunity.category || "Opportunity"}
                    </span>

                    {opportunity.demand && (
                        <span>{opportunity.demand}</span>
                    )}

                </div>

                <h2>{opportunity.title}</h2>

                <p>
                    {opportunity.description ||
                        "Explore this pathway and discover whether it fits your journey."}
                </p>

                <div className="assessment-result-details">

                    {opportunity.salary && (
                        <div>
                            <small>Potential</small>
                            <strong>{opportunity.salary}</strong>
                        </div>
                    )}

                    {opportunity.duration && (
                        <div>
                            <small>Timeline</small>
                            <strong>{opportunity.duration}</strong>
                        </div>
                    )}

                </div>

                <a
                    href={href}
                    className="assessment-result-link"
                >
                    <span>Explore pathway</span>

                    <span>
                        <HiOutlineArrowRight />
                    </span>
                </a>

            </div>

        </article>
    );
};

export default Assessment;