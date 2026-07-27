import "./TouristHero.css";

import TouristHeroContent from "./TouristHeroContent";
import TravelDashboard from "./TravelDashboard";

const TouristHero = () => {

    return (

        <section className="tvHero">

            <div className="tvHero__container">

                <div className="tvHero__grid">

                    <TouristHeroContent />

                    <TravelDashboard />

                </div>

            </div>

        </section>

    );

};

export default TouristHero;