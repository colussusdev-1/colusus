import "./ZeroDepositProgram.css";

import {
    HiOutlineGlobeAlt,
    HiOutlineCheckCircle,
    HiArrowRight
} from "react-icons/hi";

const ZeroDepositProgram = () => {

    const scrollToCountries = () => {

        document
            .getElementById("global-opportunities")
            ?.scrollIntoView({
                behavior: "smooth",
                block:"start"
            });

    };


    const countries = [

        "🇩🇪 Germany",
        "🇷🇸 Serbia",
        "🇧🇬 Bulgaria",
        "🇭🇺 Hungary"

    ];


    return (

        <section className="zero-deposit">

            <div className="container">

                <div className="zero-header">

                    <span className="section-tag dark">

                        Zero Deposit Initiative

                    </span>

                    <h2>

                        Start Your Migration Journey

                        <span>

                            Without Upfront Fees

                        </span>

                    </h2>

                    <p>

                        We assess your eligibility, review your documents and
                        match you with genuine migration opportunities before
                        discussing service fees.

                    </p>

                </div>



                <div className="zero-card">



                    <div className="zero-left">

                        <p className="intro">

                            Our Zero Deposit Program is designed for qualified
                            applicants who want to begin their migration journey
                            without immediate financial pressure. We focus on
                            helping you understand your eligibility first before
                            recommending the right pathway.

                        </p>



                        <div className="steps">

                            <div className="step">

                                <HiOutlineCheckCircle />

                                <span>

                                    Free eligibility assessment

                                </span>

                            </div>

                            <div className="step">

                                <HiOutlineCheckCircle />

                                <span>

                                    Professional document review

                                </span>

                            </div>

                            <div className="step">

                                <HiOutlineCheckCircle />

                                <span>

                                    Opportunity matching based on your profile

                                </span>

                            </div>

                            <div className="step">

                                <HiOutlineCheckCircle />

                                <span>

                                    Pay only after qualification

                                </span>

                            </div>

                        </div>

                    </div>





                    <div className="zero-right">



                        <div className="highlight-box">

                            <div className="hb-top">

                                <HiOutlineGlobeAlt className="globe-icon" />

                                <div>

                                    <h3>
                                        Currently Available
                                    </h3>

                                    <p>
                                        Countries participating in the Zero Deposit Program
                                    </p>

                                </div>

                            </div>



                            <div className="country-grid">

                                {
                                    countries.map((item) => (

                                        <div
                                            key={item}
                                            className="country-pill"
                                        >
                                            {item}
                                        </div>

                                    ))
                                }

                            </div>



                            <div className="hb-status">

                                <span className="status-dot"></span>

                                <span>
                                    Program Currently Open
                                </span>

                            </div>

                        </div>





                        <button

                            className="primary-btn"

                            onClick={scrollToCountries}

                        >

                            Explore Eligible Opportunities

                            <HiArrowRight />

                        </button>



                    </div>



                </div>

            </div>

        </section>

    );

};

export default ZeroDepositProgram;