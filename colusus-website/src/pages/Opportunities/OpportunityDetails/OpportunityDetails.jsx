import { useParams } from "react-router-dom";

import countries from "../../Home/sections/Countries/countriesData";

import DetailsHero from "./DetailsHero/DetailsHero";
import DetailsFacts from "./DetailsFacts/DetailsFacts";

import Positions from "./Positions/Positions";
import Benefits from "./Benefits/Benefits";
import Requirements from "./Requirements/Requirements";
import Documents from "./Documents/Documents";

import ProcessTimeline from "./ProcessTimeline/ProcessTimeline";

import Pricing from "./Pricing/Pricing";
import PaymentPlan from "./PaymentPlan/PaymentPlan";

import RelatedOpportunities from "../components/RelatedOpportunities/RelatedOpportunities";

import LeadCTA from "./LeadCTA/LeadCTA";

import "./OpportunityDetails.css";



const OpportunityDetails = () => {


    const {
        country,
        slug
    } = useParams();




    const selectedCountry =
        countries.find(
            item => item.slug === country
        );





    const opportunities =
        selectedCountry?.opportunities ||
        selectedCountry?.offers ||
        [];





    const opportunity =
        opportunities.find(
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
        opportunities.filter(
            item =>
                item.slug !== slug
        );






    return (

        <main className="opportunity-details-page">


            {/* 1. Hero - Understand the opportunity immediately */}
            <DetailsHero

                country={selectedCountry}

                opportunity={opportunity}

            />




            {/* 2. Quick facts - Salary, visa, location, duration */}
            <DetailsFacts

                country={selectedCountry}

                opportunity={opportunity}

            />





            {/* 3. Available positions - What roles are available */}
            {
                opportunity.positions?.length > 0 &&

                <Positions

                    opportunity={opportunity}

                />
            }





            {/* 4. Requirements - Am I eligible */}
            {
                opportunity.requirements?.length > 0 &&

                <Requirements

                    opportunity={opportunity}

                />
            }





            {/* 5. Process Timeline - Explain the journey */}
            {
                opportunity.steps?.length > 0 &&

                <ProcessTimeline

                    opportunity={opportunity}

                />
            }





            {/* 6. Benefits - Why choose this pathway */}
            {
                opportunity.benefits?.length > 0 &&

                <Benefits

                    opportunity={opportunity}

                />
            }





            {/* 7. Documents - What do I need to prepare */}
            {
                opportunity.documents?.length > 0 &&

                <Documents

                    opportunity={opportunity}

                />
            }





            {/* 8. Pricing - Cost transparency */}
            {
                opportunity.pricing &&

                <Pricing

                    opportunity={opportunity}

                />
            }





            {/* 9. Payment options */}
            {
                opportunity.paymentPlan?.length > 0 &&

                <PaymentPlan

                    opportunity={opportunity}

                />
            }





            {/* 10. Other pathways */}
            {
                relatedOpportunities.length > 0 &&

                <RelatedOpportunities

                    opportunities={relatedOpportunities}

                    countrySlug={selectedCountry.slug}

                />
            }





            {/* 11. Conversion point */}
            <LeadCTA

                country={selectedCountry}

                opportunity={opportunity}

            />


        </main>

    );

};



export default OpportunityDetails;