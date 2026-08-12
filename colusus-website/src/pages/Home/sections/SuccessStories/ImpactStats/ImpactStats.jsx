import {
    HiOutlineUserGroup,
    HiOutlineGlobeAlt,
    HiOutlineDocumentText,
    HiOutlineStar,
} from "react-icons/hi";

import "./ImpactStats.css";


const impactStats = [

    {
        id: 1,

        value: "4,500+",

        label: "Successful Clients",

        icon: HiOutlineUserGroup,

    },

    {
        id: 2,

        value: "18+",

        label: "Countries Served",

        icon: HiOutlineGlobeAlt,

    },

    {
        id: 3,

        value: "98%",

        label: "Application Success",

        icon: HiOutlineDocumentText,

    },

    {
        id: 4,

        value: "4.9/5",

        label: "Client Rating",

        icon: HiOutlineStar,

    },

];


const ImpactStats = () => {

    return (

        <section
            className="impact-stats"
            aria-label="Colossus impact statistics"
        >

            <div className="impact-stats-background">

                <div className="impact-stats-map"></div>

                <div className="impact-stats-glow"></div>

            </div>


            <div className="impact-stats-container">


                {/* =================================================
                    INTRO
                ================================================= */}

                <div className="impact-stats-intro">


                    <span className="impact-stats-eyebrow">

                        Our Impact

                    </span>


                    <h2>

                        Numbers That

                        <br />

                        Reflect Our

                        <span>
                            Commitment
                        </span>

                    </h2>


                    <p>

                        We take pride in the trust our clients
                        place in us and the results we deliver.

                    </p>


                </div>



                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="impact-stats-list">


                    {
                        impactStats.map(
                            (stat, index) => {

                                const Icon = stat.icon;


                                return (

                                    <div
                                        className="impact-stat"
                                        key={stat.id}
                                    >


                                        {/* DIVIDER */}

                                        {
                                            index > 0 && (

                                                <span
                                                    className="impact-stat-divider"
                                                    aria-hidden="true"
                                                />

                                            )
                                        }


                                        {/* ICON */}

                                        <div className="impact-stat-icon">

                                            <Icon />

                                        </div>


                                        {/* VALUE */}

                                        <strong className="impact-stat-value">

                                            {stat.value}

                                        </strong>


                                        {/* LABEL */}

                                        <span className="impact-stat-label">

                                            {stat.label}

                                        </span>


                                    </div>

                                );

                            }
                        )
                    }


                </div>


            </div>


        </section>

    );

};


export default ImpactStats;