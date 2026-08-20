import {
    HiOutlineArrowRight,
    HiOutlineCheck,
} from "react-icons/hi";

import "./WorkflowStepper.css";


const WorkflowStepper = ({
    currentStep = 1,
}) => {

    const steps = [
        {
            number: 1,
            label: "Choose Pathway",
        },
        {
            number: 2,
            label: "Pathway Overview",
        },
        {
            number: 3,
            label: "Create Application",
        },
        {
            number: 4,
            label: "Complete Application",
        },
        {
            number: 5,
            label: "Journey Tracking",
        },
    ];


    return (
        <nav
            className="workflow-stepper"
            aria-label="Application workflow"
        >

            <div className="workflow-stepper-inner">

                {steps.map((step, index) => {

                    const isActive =
                        currentStep === step.number;

                    const isCompleted =
                        currentStep > step.number;


                    return (
                        <div
                            className="workflow-stepper-item"
                            key={step.number}
                        >

                            <div
                                className={`
                                    workflow-step
                                    ${isActive ? "active" : ""}
                                    ${isCompleted ? "completed" : ""}
                                `}
                            >

                                <span className="workflow-step-number">

                                    {isCompleted ? (
                                        <HiOutlineCheck />
                                    ) : (
                                        step.number
                                    )}

                                </span>


                                <span className="workflow-step-label">
                                    {step.label}
                                </span>

                            </div>


                            {index < steps.length - 1 && (
                                <div
                                    className={`
                                        workflow-step-connector
                                        ${currentStep >
                                            step.number
                                            ? "completed"
                                            : ""
                                        }
                                    `}
                                    aria-hidden="true"
                                >

                                    <span />

                                    <HiOutlineArrowRight />

                                </div>
                            )}

                        </div>
                    );

                })}

            </div>

        </nav>
    );
};


export default WorkflowStepper;