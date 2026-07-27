import { useParams } from "react-router-dom";

import countries from "../Home/sections/Countries/countriesData";

import OpportunityHero from "./components/OpportunityHero/OpportunityHero";
import OpportunityExplorer from "./components/OpportunityExplorer/OpportunityExplorer";

import "./Opportunities.css";


const Opportunities = () => {


    const {
        country
    } = useParams();



    const selectedCountry = countries.find(
        item => item.slug === country
    );



    if(!selectedCountry){

        return (

            <main className="opportunities-page opportunities-error">

                <div className="opportunities-error-content">

                    <span>
                        Opportunity Search
                    </span>


                    <h1>
                        Country Not Found
                    </h1>


                    <p>
                        We could not find this destination.
                    </p>

                </div>

            </main>

        );

    }



    return (

        <main className="opportunities-page">


            <OpportunityHero
                country={selectedCountry}
            />



            <OpportunityExplorer
                country={selectedCountry}
            />


        </main>

    );

};


export default Opportunities;