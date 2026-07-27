import "./Newsletter.css";

const Newsletter = () => {

    return (

        <section className="newsletterSection">

            <div className="newsletterSection__card">

                <span className="newsletterSection__badge">
                    Global Updates
                </span>

                <h2 className="newsletterSection__title">
                    Never Miss An Immigration,
                    Job Or Business Opportunity
                </h2>

                <p className="newsletterSection__text">
                    Join thousands receiving overseas job alerts,
                    immigration updates and business expansion insights.
                </p>

                <form className="newsletterSection__form">

                    <input
                        className="newsletterSection__input"
                        type="email"
                        placeholder="Enter your email"
                    />

                    <button
                        className="newsletterSection__button"
                        type="submit"
                    >
                        Subscribe
                    </button>

                </form>

                <div className="newsletterSection__trust">

                    <span>✓ Weekly insights</span>

                    <span>✓ No spam</span>

                    <span>✓ Unsubscribe anytime</span>

                </div>

            </div>

        </section>

    );

};

export default Newsletter;