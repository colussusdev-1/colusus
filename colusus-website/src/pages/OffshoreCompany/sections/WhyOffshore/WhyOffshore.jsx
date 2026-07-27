import "./WhyOffshore.css";

import offshoreBenefits from "./offshoreBenefits";

import BenefitCard from "./BenefitCard/BenefitCard";

const WhyOffshore = () => {

    return (

        <section className="why-offshore">

            <div className="why-offshore-container">

                <div className="why-offshore-header">

                    <span>

                        Why Choose Offshore Formation

                    </span>

                    <h2>

                        Build A Strong Global Business Foundation

                    </h2>

                    <p>

                        Offshore company formation unlocks
                        international opportunities, protects
                        your assets and creates a platform for
                        long-term global growth.

                    </p>

                </div>

                <div className="benefits-grid">

                    {

                        offshoreBenefits.map(item => (

                            <BenefitCard

                                key={item.id}

                                benefit={item}

                            />

                        ))

                    }

                </div>

            </div>

        </section>

    );

};

export default WhyOffshore;