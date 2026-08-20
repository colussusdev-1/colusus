import { Link } from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineGlobeAlt,
    HiOutlinePlus,
} from "react-icons/hi";

import "./ApplicationsEmpty.css";


const ApplicationsEmpty = () => {
    return (
        <section className="applications-empty">

            {/* =====================================================
          VISUAL
      ===================================================== */}

            <div className="applications-empty-visual">

                <div className="applications-empty-orbit applications-empty-orbit-one" />

                <div className="applications-empty-orbit applications-empty-orbit-two" />

                <div className="applications-empty-globe">
                    <HiOutlineGlobeAlt />
                </div>

                <span className="applications-empty-dot applications-empty-dot-one" />
                <span className="applications-empty-dot applications-empty-dot-two" />
                <span className="applications-empty-dot applications-empty-dot-three" />

            </div>


            {/* =====================================================
          CONTENT
      ===================================================== */}

            <div className="applications-empty-content">

                <span className="applications-empty-eyebrow">
                    YOUR MIGRATION JOURNEY
                </span>

                <h2>
                    Your journey starts here.
                </h2>

                <p>
                    You don't have any applications yet.
                    Explore available opportunities and
                    start your first migration journey with
                    Colusus.
                </p>


                {/* =================================================
            ACTION
        ================================================= */}

                <Link
                    to="/portal/applications/new"
                    className="applications-empty-button"
                >

                    <span className="applications-empty-button-icon">
                        <HiOutlinePlus />
                    </span>

                    <span>
                        Start Your First Application
                    </span>

                    <HiOutlineArrowRight />

                </Link>

            </div>

        </section>
    );
};


export default ApplicationsEmpty;