import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlineCheck,
    HiOutlineDocumentText,
    HiOutlineLocationMarker,
    HiOutlineAcademicCap,
    HiOutlineBriefcase,
} from "react-icons/hi";

import "./ApplicationWizard.css";


/*
============================================================
INITIAL APPLICATION CONFIGURATION

For now this is local configuration.

Later this will come from the selected Opportunity
from the backend.
============================================================
*/

const applicationConfig = {

    title: "Start Your Migration Application",

    description:
        "Tell us what you are planning and we will guide you through the application process.",

    goals: [

        {
            id: "STUDENT_VISA",

            title: "Study",

            description:
                "Apply to study at an institution abroad.",

            icon: HiOutlineAcademicCap,
        },

        {
            id: "WORK_VISA",

            title: "Work",

            description:
                "Explore employment and work opportunities abroad.",

            icon: HiOutlineBriefcase,
        },

        {
            id: "TOURIST_VISA",

            title: "Visit",

            description:
                "Plan a temporary visit, holiday or family trip.",

            icon: HiOutlineLocationMarker,
        },

        {
            id: "PERMANENT_RESIDENCE",

            title: "Permanent Residence",

            description:
                "Explore long-term migration and residency options.",

            icon: HiOutlineDocumentText,
        },

    ],

};


/*
============================================================
WIZARD STEPS

These are generic.

The actual steps will eventually be supplied by the
selected opportunity configuration.
============================================================
*/

const steps = [

    {
        id: "goal",
        label: "Goal",
    },

    {
        id: "destination",
        label: "Destination",
    },

    {
        id: "information",
        label: "Information",
    },

    {
        id: "documents",
        label: "Documents",
    },

    {
        id: "review",
        label: "Review",
    },

];


const ApplicationWizard = () => {

    const navigate = useNavigate();


    const [currentStep, setCurrentStep] =
        useState(0);


    const [application, setApplication] =
        useState({

            type: "",

            destinationCountry: "",

            personalInformation: {

                fullName: "",

                phone: "",

                email: "",

            },

        });


    const selectedGoal =
        applicationConfig.goals.find(
            (goal) =>
                goal.id === application.type
        );


    /*
    ========================================================
    SELECT APPLICATION GOAL
    ========================================================
    */

    const handleGoalSelect = (goal) => {

        setApplication((previous) => ({

            ...previous,

            type: goal.id,

        }));

    };


    /*
    ========================================================
    UPDATE APPLICATION
    ========================================================
    */

    const updateApplication = (field, value) => {

        setApplication((previous) => ({

            ...previous,

            [field]: value,

        }));

    };


    /*
    ========================================================
    UPDATE PERSONAL INFORMATION
    ========================================================
    */

    const updatePersonalInformation = (
        field,
        value
    ) => {

        setApplication((previous) => ({

            ...previous,

            personalInformation: {

                ...previous.personalInformation,

                [field]: value,

            },

        }));

    };


    /*
    ========================================================
    NEXT STEP
    ========================================================
    */

    const nextStep = () => {

        if (currentStep === 0 && !application.type) {

            return;

        }


        if (
            currentStep === 1 &&
            !application.destinationCountry
        ) {

            return;

        }


        if (
            currentStep === 2 &&
            (
                !application.personalInformation.fullName ||
                !application.personalInformation.phone
            )
        ) {

            return;

        }


        setCurrentStep(
            (previous) =>
                Math.min(
                    previous + 1,
                    steps.length - 1
                )
        );

    };


    /*
    ========================================================
    PREVIOUS STEP
    ========================================================
    */

    const previousStep = () => {

        setCurrentStep(
            (previous) =>
                Math.max(previous - 1, 0)
        );

    };


    /*
    ========================================================
    SUBMIT

    For now we only prepare the application object.

    The next step will connect this to the real backend
    POST /applications endpoint.
    ========================================================
    */

    const handleSubmit = async () => {

        console.log(
            "APPLICATION READY:",
            application
        );

        navigate("/portal/applications");

    };


    return (

        <div className="application-wizard">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="wizard-header">

                <button
                    type="button"
                    className="wizard-back-button"
                    onClick={() =>
                        navigate("/portal/applications")
                    }
                >

                    <HiOutlineArrowLeft />

                    Applications

                </button>


                <div className="wizard-heading">

                    <span>
                        NEW APPLICATION
                    </span>

                    <h1>
                        {applicationConfig.title}
                    </h1>

                    <p>
                        {applicationConfig.description}
                    </p>

                </div>

            </div>


            {/* =================================================
                STEPPER
            ================================================= */}

            <div className="wizard-stepper">

                {steps.map((step, index) => {

                    const completed =
                        index < currentStep;

                    const active =
                        index === currentStep;


                    return (

                        <div
                            key={step.id}
                            className="wizard-step-wrapper"
                        >

                            <div
                                className={`wizard-step ${active
                                        ? "active"
                                        : ""
                                    } ${completed
                                        ? "completed"
                                        : ""
                                    }`}
                            >

                                <div className="wizard-step-number">

                                    {completed ? (
                                        <HiOutlineCheck />
                                    ) : (
                                        index + 1
                                    )}

                                </div>


                                <span>
                                    {step.label}
                                </span>

                            </div>


                            {index <
                                steps.length - 1 && (

                                    <div
                                        className={`wizard-step-line ${completed
                                                ? "completed"
                                                : ""
                                            }`}
                                    />

                                )}

                        </div>

                    );

                })}

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="wizard-card">


                {/* =================================================
                    STEP 1 — GOAL
                ================================================= */}

                {currentStep === 0 && (

                    <div className="wizard-content">

                        <div className="wizard-section-heading">

                            <span>
                                STEP 1
                            </span>

                            <h2>
                                What are you planning to do?
                            </h2>

                            <p>
                                Select the option that best
                                describes your migration goal.
                            </p>

                        </div>


                        <div className="goal-grid">

                            {applicationConfig.goals.map(
                                (goal) => {

                                    const Icon =
                                        goal.icon;

                                    const selected =
                                        application.type ===
                                        goal.id;


                                    return (

                                        <button
                                            type="button"
                                            key={goal.id}
                                            className={`goal-card ${selected
                                                    ? "selected"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                handleGoalSelect(
                                                    goal
                                                )
                                            }
                                        >

                                            <div className="goal-icon">

                                                <Icon />

                                            </div>


                                            <div>

                                                <h3>
                                                    {goal.title}
                                                </h3>

                                                <p>
                                                    {goal.description}
                                                </p>

                                            </div>


                                            <div className="goal-radio">

                                                {selected && (
                                                    <HiOutlineCheck />
                                                )}

                                            </div>

                                        </button>

                                    );

                                }
                            )}

                        </div>

                    </div>

                )}


                {/* =================================================
                    STEP 2 — DESTINATION
                ================================================= */}

                {currentStep === 1 && (

                    <div className="wizard-content">

                        <div className="wizard-section-heading">

                            <span>
                                STEP 2
                            </span>

                            <h2>
                                Where do you want to go?
                            </h2>

                            <p>
                                Select the destination for
                                your migration application.
                            </p>

                        </div>


                        <div className="wizard-form">

                            <label>
                                Destination Country
                            </label>

                            <input
                                type="text"
                                value={
                                    application.destinationCountry
                                }
                                onChange={(event) =>
                                    updateApplication(
                                        "destinationCountry",
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Canada"
                            />

                        </div>

                    </div>

                )}


                {/* =================================================
                    STEP 3 — INFORMATION
                ================================================= */}

                {currentStep === 2 && (

                    <div className="wizard-content">

                        <div className="wizard-section-heading">

                            <span>
                                STEP 3
                            </span>

                            <h2>
                                Tell us about yourself
                            </h2>

                            <p>
                                We'll use this information
                                to begin your application.
                            </p>

                        </div>


                        <div className="wizard-form-grid">

                            <div className="wizard-form">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        application
                                            .personalInformation
                                            .fullName
                                    }
                                    onChange={(event) =>
                                        updatePersonalInformation(
                                            "fullName",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Your full name"
                                />

                            </div>


                            <div className="wizard-form">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    value={
                                        application
                                            .personalInformation
                                            .phone
                                    }
                                    onChange={(event) =>
                                        updatePersonalInformation(
                                            "phone",
                                            event.target.value
                                        )
                                    }
                                    placeholder="+234..."
                                />

                            </div>


                            <div className="wizard-form">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={
                                        application
                                            .personalInformation
                                            .email
                                    }
                                    onChange={(event) =>
                                        updatePersonalInformation(
                                            "email",
                                            event.target.value
                                        )
                                    }
                                    placeholder="you@example.com"
                                />

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    STEP 4 — DOCUMENTS
                ================================================= */}

                {currentStep === 3 && (

                    <div className="wizard-content">

                        <div className="wizard-section-heading">

                            <span>
                                STEP 4
                            </span>

                            <h2>
                                Your Documents
                            </h2>

                            <p>
                                Documents required for your
                                application will appear here.
                            </p>

                        </div>


                        <div className="documents-placeholder">

                            <HiOutlineDocumentText />

                            <h3>
                                Document requirements
                            </h3>

                            <p>
                                Required documents will be
                                generated from the selected
                                opportunity.
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================================
                    STEP 5 — REVIEW
                ================================================= */}

                {currentStep === 4 && (

                    <div className="wizard-content">

                        <div className="wizard-section-heading">

                            <span>
                                STEP 5
                            </span>

                            <h2>
                                Review Your Application
                            </h2>

                            <p>
                                Review the information you've
                                provided before continuing.
                            </p>

                        </div>


                        <div className="review-grid">

                            <div className="review-item">

                                <span>
                                    Application Type
                                </span>

                                <strong>
                                    {selectedGoal?.title ||
                                        "—"}
                                </strong>

                            </div>


                            <div className="review-item">

                                <span>
                                    Destination
                                </span>

                                <strong>
                                    {application.destinationCountry ||
                                        "—"}
                                </strong>

                            </div>


                            <div className="review-item">

                                <span>
                                    Full Name
                                </span>

                                <strong>
                                    {application
                                        .personalInformation
                                        .fullName ||
                                        "—"}
                                </strong>

                            </div>


                            <div className="review-item">

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {application
                                        .personalInformation
                                        .phone ||
                                        "—"}
                                </strong>

                            </div>

                        </div>

                    </div>

                )}

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="wizard-actions">

                <button
                    type="button"
                    className="wizard-secondary-button"
                    onClick={previousStep}
                    disabled={currentStep === 0}
                >

                    <HiOutlineArrowLeft />

                    Back

                </button>


                {currentStep < steps.length - 1 ? (

                    <button
                        type="button"
                        className="wizard-primary-button"
                        onClick={nextStep}
                    >

                        Continue

                        <HiOutlineArrowRight />

                    </button>

                ) : (

                    <button
                        type="button"
                        className="wizard-primary-button"
                        onClick={handleSubmit}
                    >

                        Submit Application

                        <HiOutlineCheck />

                    </button>

                )}

            </div>

        </div>

    );

};


export default ApplicationWizard;