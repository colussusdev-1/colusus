import "./CountriesSection.css";

import canada from "../../../assets/flags/canada.png"
import uk from "../../../../assets/flags/united-kingdom.png";
import australia from "../../../../assets/flags/australia.png";
import germany from "../../../../assets/flags/germany.png";

const countries = [
    {
        flag: canada,
        name: "Canada",
        match: "95%",
        feature: "Post-Study Work",
        tuition: "$15k–35k"
    },
    {
        flag: uk,
        name: "United Kingdom",
        match: "92%",
        feature: "Graduate Route",
        tuition: "$18k–40k"
    },
    {
        flag: australia,
        name: "Australia",
        match: "91%",
        feature: "PR Pathway",
        tuition: "$20k–42k"
    },
    {
        flag: germany,
        name: "Germany",
        match: "89%",
        feature: "Low Tuition",
        tuition: "Affordable"
    }
];

const CountriesSection = () => {
    return (
        <section className="countries">

            <div className="wp-container">

                <div className="countries-header">

                    <span className="section-tag">
                        Explore Destinations
                    </span>

                    <h2>
                        Find Your Perfect
                        <span> Study Destination</span>
                    </h2>

                    <p>
                        Compare top destinations and discover where your
                        academic journey can begin.
                    </p>

                </div>

                <div className="countries-list">

                    {countries.map((country, index) => (

                        <article
                            className="country-card"
                            key={country.name}
                            style={{
                                animationDelay: `${index * .12}s`
                            }}
                        >

                            <div className="country-glow"></div>

                            <div className="country-flag">

                                <img
                                    src={country.flag}
                                    alt={country.name}
                                />

                            </div>

                            <h3>{country.name}</h3>

                            <div className="country-match">
                                {country.match} Match
                            </div>

                            <div className="country-feature">
                                {country.feature}
                            </div>

                            <div className="country-price">
                                {country.tuition}
                            </div>

                            <button>
                                Explore →
                            </button>

                        </article>

                    ))}

                </div>

            </div>

        </section>
    );
};

export default CountriesSection;