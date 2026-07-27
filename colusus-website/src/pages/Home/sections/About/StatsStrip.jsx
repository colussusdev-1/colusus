import "./StatsStrip.css";

import {
    HiOutlineGlobeAlt,
    HiOutlineBriefcase,
    HiOutlineAcademicCap,
    HiOutlineShieldCheck,
    HiOutlineCheckCircle,
    HiOutlineSparkles,
} from "react-icons/hi";

const stats = [
    {
        icon: <HiOutlineGlobeAlt />,
        value: "15+",
        label: "Countries Served",
    },
    {
        icon: <HiOutlineBriefcase />,
        value: "500+",
        label: "Successful Applications",
    },
    {
        icon: <HiOutlineAcademicCap />,
        value: "Study",
        label: "Visa Pathways",
    },
    {
        icon: <HiOutlineShieldCheck />,
        value: "Work",
        label: "Migration Programs",
    },
    {
        icon: <HiOutlineCheckCircle />,
        value: "24/7",
        label: "Expert Support",
    },
    {
        icon: <HiOutlineSparkles />,
        value: "98%",
        label: "Client Satisfaction",
    },
];

const StatsStrip = () => {
    return (
        <section className="stats-strip">

            <div className="stats-track">

                {[...stats, ...stats].map((item, index) => (

                    <div
                        className="stat-item"
                        key={index}
                    >
                        {item.icon}

                        <strong>{item.value}</strong>

                        <span>{item.label}</span>

                    </div>

                ))}

            </div>

        </section>
    );
};

export default StatsStrip;