import {
    HiArrowRight,
    HiOutlinePlay,
    HiOutlineBadgeCheck,
    HiOutlineGlobeAlt
} from "react-icons/hi";


import {
    Link
} from "react-router-dom";


import "./StoryHero.css";



const StoryHero = () => {


    return (

        <section className="story-hero">


            <div className="story-hero-overlay"></div>



            <div className="story-hero-container">



                {/* BADGE */}

                <div className="story-hero-badge">

                    <HiOutlineBadgeCheck />

                    Verified Migration Journeys

                </div>







                {/* TITLE */}

                <h1>

                    Real Stories.

                    <span>
                        Real Results.
                    </span>

                    Real New Beginnings.

                </h1>








                <p>

                    Discover how professionals, students and families
                    successfully achieved their migration goals with
                    the right guidance and pathway.

                </p>









                {/* ACTIONS */}

                <div className="story-hero-actions">



                    <button className="story-primary-btn">


                        Watch Success Stories


                        <HiOutlinePlay />


                    </button>









                    <Link

                        to="/consultation"

                        className="story-secondary-btn"

                    >

                        Book Consultation

                        <HiArrowRight />

                    </Link>



                </div>









                {/* TRUST STRIP */}

                <div className="story-trust-strip">



                    <div className="story-trust-item">

                        <HiOutlineGlobeAlt />

                        <div>

                            <strong>
                                18+
                            </strong>

                            <span>
                                Countries
                            </span>

                        </div>

                    </div>









                    <div className="story-trust-item">

                        <HiOutlineBadgeCheck />

                        <div>

                            <strong>
                                Verified
                            </strong>

                            <span>
                                Client Stories
                            </span>

                        </div>

                    </div>









                    <div className="story-trust-item">

                        <HiOutlinePlay />

                        <div>

                            <strong>
                                Real
                            </strong>

                            <span>
                                Experiences
                            </span>

                        </div>

                    </div>



                </div>





            </div>


        </section>

    );

};


export default StoryHero;