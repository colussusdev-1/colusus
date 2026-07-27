import "./ImmigrationLeverage.css";

import leverageData from "./leverageData";

const ImmigrationLeverage = () => {

    return (

        <section className="immigration-leverage">

            <div className="leverage-container">

                {/* LEFT */}

                <div className="leverage-content">

                    <span className="leverage-badge">

                        Business & Immigration

                    </span>

                    <h2>

                        Leverage Your Company For Global Opportunities

                    </h2>

                    <p>

                        In many jurisdictions, business ownership can
                        strengthen your international profile and open
                        pathways for investment, expansion and long-term
                        residency planning.

                    </p>

                    <div className="leverage-features">

                        {

                            leverageData.map(item => {

                                const Icon = item.icon;

                                return (

                                    <article
                                        key={item.id}
                                        className="leverage-card"
                                    >

                                        <div className="leverage-icon">

                                            <Icon />

                                        </div>

                                        <div>

                                            <h3>

                                                {item.title}

                                            </h3>

                                            <p>

                                                {item.description}

                                            </p>

                                        </div>

                                    </article>

                                );

                            })

                        }

                    </div>

                </div>

                {/* RIGHT */}

                <div className="leverage-visual">

                    <div className="visual-card">

                        <span>

                            Strategic Growth

                        </span>

                        <h3>

                            Business → Investment → Expansion

                        </h3>

                        <p>

                            Build a company structure that supports
                            international growth while positioning
                            yourself for future opportunities.

                        </p>

                        <div className="growth-path">

                            <div>

                                Company

                            </div>

                            <div>

                                Growth

                            </div>

                            <div>

                                Global Reach

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default ImmigrationLeverage;