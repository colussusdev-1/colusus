import { Link } from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineShieldCheck,
    HiOutlineDocumentText,
    HiOutlineGlobeAlt,
    HiOutlineStar,
    HiOutlineCheckCircle,
} from "react-icons/hi";

import "./TouristHeroContent.css";

const TouristHeroContent = () => {

    return (

        <div className="tvHeroContent">

            <span className="tvHeroContent__badge">
                TOURIST VISA SERVICES
            </span>

            <h1>
                Travel Smarter.
                <span> Explore Further.</span>
            </h1>

            <p>
                Professional tourist visa guidance for individuals, families,
                and holidaymakers applying to the world's most popular destinations.
            </p>

            <div className="tvHeroContent__buttons">

                <Link
                    to="/contact"
                    className="tvHeroContent__primary"
                >
                    Book Consultation
                    <HiOutlineArrowRight />
                </Link>


            </div>

            {/* Trust Strip */}

            <div className="tvHeroContent__trust">

                <div>
                    <HiOutlineShieldCheck />
                    <span>Expert Guidance</span>
                </div>

                <div>
                    <HiOutlineDocumentText />
                    <span>Document Review</span>
                </div>

                <div>
                    <HiOutlineGlobeAlt />
                    <span>Multiple Destinations</span>
                </div>

            </div>

            {/* Testimonial Card */}

            <div className="tvHeroContent__testimonial">

                <div className="tvHeroContent__testimonialTop">

                    <div className="tvHeroContent__avatar">

                        BO

                    </div>

                    <div className="tvHeroContent__person">

                        <h4>

                            Brian O.

                        </h4>

                        <span>

                            Tourist Visa Applicant

                        </span>

                    </div>

                    <HiOutlineCheckCircle className="tvHeroContent__verified" />

                </div>

                <div className="tvHeroContent__stars">

                    <HiOutlineStar />
                    <HiOutlineStar />
                    <HiOutlineStar />
                    <HiOutlineStar />
                    <HiOutlineStar />

                </div>

                <p className="tvHeroContent__quote">

                    "The document review process helped me avoid mistakes I
                    would have missed. Everything felt organized and
                    professional from start to finish."

                </p>

            </div>

        </div>

    );

};

export default TouristHeroContent;