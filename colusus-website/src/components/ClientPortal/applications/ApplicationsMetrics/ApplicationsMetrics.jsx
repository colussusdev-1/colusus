import {
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineDocumentText,
    HiOutlineRefresh,
} from "react-icons/hi";

import "./ApplicationsMetrics.css";


const ApplicationsMetrics = ({
    totalApplications = 0,
    activeApplications = 0,
    completedApplications = 0,
    submittedApplications = 0,
}) => {

    const metrics = [
        {
            key: "total",
            label: "Total Applications",
            value: totalApplications,
            description: "All applications",
            icon: HiOutlineDocumentText,
            tone: "blue",
        },
        {
            key: "active",
            label: "In Progress",
            value: activeApplications,
            description: "Currently active",
            icon: HiOutlineClock,
            tone: "orange",
        },
        {
            key: "completed",
            label: "Completed",
            value: completedApplications,
            description: "Finished journeys",
            icon: HiOutlineCheckCircle,
            tone: "green",
        },
        {
            key: "submitted",
            label: "Submitted",
            value: submittedApplications,
            description: "Awaiting review",
            icon: HiOutlineRefresh,
            tone: "purple",
        },
    ];


    return (
        <section
            className="applications-metrics"
            aria-label="Application summary"
        >

            {metrics.map((metric) => {

                const Icon = metric.icon;

                return (
                    <article
                        key={metric.key}
                        className={`application-metric application-metric-${metric.tone}`}
                    >

                        {/* ICON */}

                        <div className="application-metric-icon">
                            <Icon />
                        </div>


                        {/* CONTENT */}

                        <div className="application-metric-content">

                            <span className="application-metric-label">
                                {metric.label}
                            </span>

                            <strong className="application-metric-value">
                                {metric.value}
                            </strong>

                            <span className="application-metric-description">
                                {metric.description}
                            </span>

                        </div>

                    </article>
                );
            })}

        </section>
    );
};


export default ApplicationsMetrics;