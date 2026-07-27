import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

const HeroButtons = () => {

    return (

        <div className="tvHeroButtons">

            <Link
                to="/contact"
                className="tvHeroButtons__primary"
            >

                Book Consultation

                <HiOutlineArrowRight />

            </Link>

            <Link
                to="/services/eligibility"
                className="tvHeroButtons__secondary"
            >

                Free Eligibility Check

            </Link>

        </div>

    );

};

export default HeroButtons;