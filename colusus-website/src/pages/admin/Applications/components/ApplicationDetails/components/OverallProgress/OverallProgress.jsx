import React from "react";

import "./OverallProgress.css";


const OverallProgress = ({
    application,
}) => {

    const progress =
        Math.min(
            Math.max(
                Number(
                    application?.progress
                ) || 0,
                0
            ),
            100
        );


    return (

        <section className="overallProgress">

            <div className="overallProgress__header">

                <span>
                    PROGRESS
                </span>

                <h2>
                    Progress
                </h2>

            </div>


            <div className="overallProgress__circle">

                <svg
                    viewBox="0 0 120 120"
                    className="overallProgress__svg"
                >

                    <circle
                        className="overallProgress__track"
                        cx="60"
                        cy="60"
                        r="47"
                    />

                    <circle
                        className="overallProgress__fill"
                        cx="60"
                        cy="60"
                        r="47"
                        style={{
                            strokeDasharray: `${295.3}`,
                            strokeDashoffset:
                                `${295.3 - (
                                    295.3 * progress
                                ) / 100}`,
                        }}
                    />

                </svg>


                <div className="overallProgress__value">

                    <strong>
                        {progress}%
                    </strong>

                    <span>
                        Overall Progress
                    </span>

                </div>

            </div>

        </section>

    );

};


export default OverallProgress;