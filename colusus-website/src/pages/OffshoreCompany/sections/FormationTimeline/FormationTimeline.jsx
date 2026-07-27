import "./FormationTimeline.css";

import formationSteps from "./formationSteps";

import TimelineItem from "./TimelineItem/TimelineItem";

const FormationTimeline = () => {

    return (

        <section className="formation-timeline">

            <div className="formation-container">

                <div className="formation-header">

                    <span>

                        Company Formation Process

                    </span>

                    <h2>

                        From Consultation To Global Expansion

                    </h2>

                    <p>

                        Our streamlined process ensures
                        your offshore company is formed
                        efficiently and compliantly.

                    </p>

                </div>

                {/* <div className="timeline-wrapper">

                    {

                        formationSteps.map((step,index)=>(

                            <TimelineItem

                                key={step.id}

                                step={step}

                                index={index}

                            />

                        ))

                    }

                </div> */}

            </div>

        </section>

    );

};

export default FormationTimeline;