import "./FeaturedBundle.css";

import {
    FiCheck,
    FiArrowRight,
    FiDownload
} from "react-icons/fi";

const bundleItems = [

    "Canada Immigration Blueprint",

    "UK Skilled Worker Guide",

    "Professional CV Templates",

    "Cover Letter Templates",

    "Interview Preparation Kit",

    "Relocation Checklist"

];

const FeaturedBundle = () => {

    return (

        <section className="featured-bundle">

            <div className="bundle-container">

                <div className="bundle-content">

                    <span className="bundle-badge">

                        Most Popular Bundle

                    </span>

                    <h2>

                        Ultimate Relocation Bundle

                    </h2>

                    <p>

                        Everything you need to prepare,
                        apply, relocate and succeed abroad
                        in one premium package.

                    </p>

                    <div className="bundle-items">

                        {

                            bundleItems.map(item => (

                                <div
                                    key={item}
                                    className="bundle-item"
                                >

                                    <FiCheck />

                                    <span>

                                        {item}

                                    </span>

                                </div>

                            ))

                        }

                    </div>

                </div>

                <div className="bundle-card">

                    <div className="bundle-icon">

                        <FiDownload />

                    </div>

                    <h3>

                        Save 44%

                    </h3>

                    <div className="bundle-pricing">

                        <span className="old-price">

                            ₦45,000

                        </span>

                        <strong>

                            ₦25,000

                        </strong>

                    </div>

                    <p>

                        Lifetime access +
                        future updates included.

                    </p>

                    <button>

                        Get Bundle

                        <FiArrowRight />

                    </button>

                </div>

            </div>

        </section>

    );

};

export default FeaturedBundle;