import "./CTA.css";

import { FiArrowRight } from "react-icons/fi";

const CTA = () => {

    return (

        <section className="shop-cta">

            <div className="shop-cta-container">

                <span>

                    Start Your Journey Today

                </span>

                <h2>

                    Get Instant Access To Premium Resources

                </h2>

                <p>

                    Join thousands of professionals using our
                    guides, templates and relocation resources
                    to accelerate their international goals.

                </p>

                <button>

                    Browse Products

                    <FiArrowRight />

                </button>

            </div>

        </section>

    );

};

export default CTA;