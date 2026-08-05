import "./GlobalWorkImmigration.css";


import GlobalWorksHero from "./components/GlobalWorksHero";

import TrustStats from "./sections/TrustStats";

import WhyGlobalWork from "./sections/WhyGlobalWork";

import WorkOpportunities from "./sections/WorkOpportunities";

import Benefits from "./sections/Benefits";

import HowItWorks from "./sections/HowItWorks";

import EligibilityMiniForm from "./sections/EligibilityMiniForm";

import SuccessStories from "./sections/SuccessStories";

import GlobalFAQ from "./sections/GlobalFAQ";

import GlobalCTA from "./sections/GlobalCTA";



const GlobalWorkImmigration = () => {


    return (


        <main className="global-work">


            {/* FULL SCREEN HERO */}

            <GlobalWorksHero />



            {/* TRUST */}

            <TrustStats />



            {/* WHY GLOBAL WORK */}

            <WhyGlobalWork />



            {/* AVAILABLE PATHWAYS */}

            <WorkOpportunities />



            {/* BENEFITS */}

            <Benefits />



            {/* PROCESS */}

            <HowItWorks />



            {/* ELIGIBILITY */}

            {/* <EligibilityMiniForm /> */}



            {/* SUCCESS STORIES */}

            <SuccessStories />



            {/* FAQ */}

            <GlobalFAQ />



            {/* FINAL CONVERSION */}

            <GlobalCTA />



        </main>


    );


};


export default GlobalWorkImmigration;