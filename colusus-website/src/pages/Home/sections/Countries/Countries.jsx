import { useMemo, useState } from "react";

import "./Countries.css";

import countries from "./countriesData";
import CountryTabs from "./CountryTabs";
import CountryCard from "./components/CountryCard/CountryCard";


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
      className="countries"
    >

      <div className="container">


        {/* Header */}

        <div className="section-header">


          <span className="section-tag">
            Global Opportunities
          </span>



          <h2>
            Explore Countries That Match Your Migration Goals
          </h2>



          <p>
            Discover trusted destinations for work, study,
            relocation, and future opportunities abroad.
            Compare pathways and find the option that fits
            your personal goals.
          </p>


        </div>




        {/* Quick Stats */}

        <div className="countries-stats">


          <div className="country-stat">

            <h3>
              {countries.length}+
            </h3>

            <p>
              Destinations
            </p>

          </div>



          <div className="country-stat">

            <h3>
              Work
            </h3>

            <p>
              Opportunities
            </p>

          </div>



          <div className="country-stat">

            <h3>
              Study
            </h3>

            <p>
              Pathways
            </p>

          </div>



          <div className="country-stat">

            <h3>
              PR
            </h3>

            <p>
              Settlement Options
            </p>

          </div>


        </div>





        {/* Filters */}

        <CountryTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />





        {/* Countries */}

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