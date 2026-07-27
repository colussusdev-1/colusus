import { useMemo, useState } from "react";

import "./Countries.css";

import countries from "./countriesData";
import CountryTabs from "./CountryTabs";
import CountryCard from "./CountryCard";

const Countries = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredCountries = useMemo(() => {
    if (activeTab === "Most Popular") {
      return countries.filter((country) =>
        country.category.includes("popular")
      );
    }

    if (activeTab === "Most Affordable") {
      return countries.filter((country) =>
        country.category.includes("affordable")
      );
    }

    return countries;
  }, [activeTab]);

  return (
    <section
      id="global-opportunities"
    className="countries">

      <div className="container">

        <div className="section-header">

          <span className="section-tag">
            Global Opportunities
          </span>


          <h2>
            Find Your Best Immigration Pathway
          </h2>


          <p>
            Explore countries offering work,
            study, travel and relocation opportunities
            designed around your goals.
          </p>


        </div>


        <CountryTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />


        <div className="countries-grid">

          {
            filteredCountries.map((country) => (

              <CountryCard
                key={country.id}
                country={country}
              />

            ))
          }

        </div>


      </div>

    </section>
  );
};

export default Countries;