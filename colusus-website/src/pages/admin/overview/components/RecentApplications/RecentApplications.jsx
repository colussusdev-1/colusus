import React from "react";

import {
    HiOutlineArrowRight,
    HiOutlineDocumentText,
} from "react-icons/hi";

import RecentApplicationRow
    from "./RecentApplicationRow";

import "./RecentApplications.css";


const RecentApplications = ({
    applications = [],
    onApplicationClick,
    onViewAll,
}) => {

    return (

        <section className="adminOverviewPanel recentApplications">

            <div className="recentApplications__header">

                <div>

                    <span className="recentApplications__label">
                        LATEST ACTIVITY
                    </span>

                    <h2>
                        Recent applications
                    </h2>

                    <p>
                        The latest applications entering the system.
                    </p>

                </div>


                <button
                    type="button"
                    className="recentApplications__viewAll"
                    onClick={onViewAll}
                >

                    View all

                    <HiOutlineArrowRight />

                </button>

            </div>


            {applications.length === 0 ? (

                <div className="recentApplications__empty">

                    <div className="recentApplications__emptyIcon">
                        <HiOutlineDocumentText />
                    </div>

                    <strong>
                        No applications yet
                    </strong>

                    <span>
                        New applications will appear here.
                    </span>

                </div>

            ) : (

                <div className="recentApplications__list">

                    {applications.map((application) => (

                        <RecentApplicationRow
                            key={application._id}
                            application={application}
                            onClick={() =>
                                onApplicationClick(
                                    application._id
                                )
                            }
                        />

                    ))}

                </div>

            )}

        </section>

    );

};


export default RecentApplications;