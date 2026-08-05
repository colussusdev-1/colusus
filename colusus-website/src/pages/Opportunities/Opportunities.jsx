import { useParams } from "react-router-dom";

import countries from "../Home/sections/Countries/countriesData";

import OpportunityHero from "./components/OpportunityHero/OpportunityHero";
import OpportunityExplorer from "./components/OpportunityExplorer/OpportunityExplorer";

import "./Opportunities.css";


const Opportunities = () => {

    const { country } = useParams();


    const selectedCountry = countries.find(
        (item) => item.slug === country
    );



    if (!selectedCountry) {

        return (

            <main className="opportunities-page opportunities-error">

                <div className="opportunities-error-content">

                    <span>
                        Global Opportunities
                    </span>


                    <h1>
                        Country Not Found
                    </h1>


                    <p>
                        The destination you are looking for is currently unavailable.
                    </p>


                </div>

            </main>

        );

    }



    /*
        Normalize old and new country structures

        Old:
        offers: []

        New:
        opportunities: []
    */


    const opportunities =
        selectedCountry.opportunities ||
        selectedCountry.offers ||
        [];




    const normalizedOpportunities = opportunities.map(
        (item) => ({

            ...item,


            // fallback fields

            image:
                item.image ||
                selectedCountry.image,


            location:
                item.location ||
                selectedCountry.name,


            category:
                item.category ||
                "Jobs",


            duration:
                item.duration ||
                item.timeline ||
                selectedCountry.duration,


            type:
                item.type ||
                selectedCountry.visa,


            salary:
                item.salary ||
                "Available Upon Assessment",


            benefits:
                item.benefits ||
                item.highlights ||
                [],


            requirements:
                item.requirements ||
                [],


            steps:
                item.steps ||
                item.process ||
                [],


        })
    );





    const countryData = {

        ...selectedCountry,


        opportunities:
            normalizedOpportunities,


        // make sure these exist

        applicants:
            selectedCountry.applicants || "500+",


        processingTime:
            selectedCountry.processingTime ||
            selectedCountry.duration,


        opportunityScore:
            selectedCountry.opportunityScore ||
            "High",


        successRate:
            selectedCountry.successRate ||
            "High",


    };





    return (

        <main className="opportunities-page">


            <OpportunityHero

                country={countryData}

            />



            <OpportunityExplorer

                country={countryData}

            />


        </main>

    );

};



export default Opportunities;