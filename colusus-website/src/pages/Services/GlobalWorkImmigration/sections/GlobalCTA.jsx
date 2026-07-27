import "./GlobalCTA.css";

import { HiOutlinePhone, HiOutlineMail, HiOutlineArrowRight } from "react-icons/hi";

const GlobalCTA = () => {

    return (

        <section className="gwCTA">

            <div className="gwCTA__container">

                <div className="gwCTA__card">

                    {/* LEFT */}
                    <div className="gwCTA__left">

                        <span className="gwCTA__badge">
                            START YOUR GLOBAL JOURNEY
                        </span>

                        <h2 className="gwCTA__title">
                            Get Your Personalized Immigration Assessment
                        </h2>

                        <p className="gwCTA__desc">
                            Speak with a certified consultant and discover the best pathway for your profile, goals, and timeline.
                        </p>

                        <div className="gwCTA__actions">

                            <button className="gwCTA__btn gwCTA__btn--primary">
                                Book Consultation
                                <HiOutlineArrowRight />
                            </button>

                            <button className="gwCTA__btn gwCTA__btn--secondary">
                                Check Eligibility
                            </button>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="gwCTA__right">

                        <div className="gwCTA__header">
                            Contact Details
                        </div>

                        <div className="gwCTA__item">

                            <HiOutlineMail />

                            <div>
                                <span>Email</span>
                                <p>admin@colossusmigration.com</p>
                            </div>

                        </div>

                        <div className="gwCTA__item">

                            <HiOutlinePhone />

                            <div>
                                <span>Phone</span>
                                <p>+234-703-520-9306</p>
                                <p>+234-902-695-3513</p>
                            </div>

                        </div>

                        <div className="gwCTA__note">
                            Response within 24 hours • Global support available
                        </div>

                    </div>

                </div>

            </div>

        </section>

    );
};

export default GlobalCTA;