import { useParams } from "react-router-dom";

import countries from "../../Home/sections/Countries/countriesData";

import DetailsHero from "./DetailsHero/DetailsHero";
import DetailsFacts from "./DetailsFacts/DetailsFacts";
import Benefits from "./Benefits/Benefits";
import Requirements from "./Requirements/Requirements";
import Documents from "./Documents/Documents";

import RelatedOpportunities from "../components/RelatedOpportunities/RelatedOpportunities";

import LeadCTA from "./LeadCTA/LeadCTA";
import "./OpportunityDetails.css";


const OpportunityDetails = () => {


    const {
        country,
        slug
    } = useParams();



    const selectedCountry = countries.find(
        item => item.slug === country
    );



    const opportunity =
        selectedCountry?.opportunities?.find(
            item => item.slug === slug
        );



    if (!selectedCountry || !opportunity) {

        return (

            <main className="opportunity-not-found">

                <div className="opportunity-not-found__inner">

                    <span>
                        Opportunity
                    </span>

                    <h1>
                        Opportunity Not Found
                    </h1>

                    <p>
                        The pathway you are looking for
                        is currently unavailable.
                    </p>

                </div>

            </main>

        );

    }



    const relatedOpportunities =
        selectedCountry.opportunities.filter(
            item => item.slug !== slug
        );



    return (

        <main className="opportunity-details-page">


            {/* HERO */}

            <DetailsHero
                country={selectedCountry}
                opportunity={opportunity}
            />



            {/* QUICK FACTS */}

            <DetailsFacts
                country={selectedCountry}
                opportunity={opportunity}
            />



            {/* BENEFITS */}

            <Benefits
                opportunity={opportunity}
            />



            {/* REQUIREMENTS */}

            <Requirements
                opportunity={opportunity}
            />



            {/* DOCUMENTS */}

            <Documents
                opportunity={opportunity}
            />



            {/* RELATED OPPORTUNITIES */}

            {
                relatedOpportunities.length > 0 && (

                    <RelatedOpportunities
                        opportunities={relatedOpportunities}
                        countrySlug={selectedCountry.slug}
                    />

                )
            }



            {/* LEAD CTA */}

            <LeadCTA
                country={selectedCountry}
                opportunity={opportunity}
            />



        </main>

    );

};


export default OpportunityDetails;