import "./GlobalWorkImmigration.css";

import { Link } from "react-router-dom";

import { globalPrograms } from "./data/globalWorkData";
import Navbar from "../../../components/Navbar/Navbar";
import GlobalWorksHero from "./components/GlobalWorksHero";
import WhyGlobalWork from "./sections/WhyGlobalWork";
import HowItWorks from "./sections/HowItWorks";
// import GlobalCTA from "./sections/GlobalCTA";
import SuccessStories from "./sections/SuccessStories";
import GlobalFAQ from "./sections/GlobalFAQ";
import EligibilityMiniForm from "./sections/EligibilityMiniForm";

const GlobalWorkImmigration = () => {

    return (

        <div className="global-work">

            <div className="container">

                {/* HERO */}

               <GlobalWorksHero/>

               <WhyGlobalWork/>

               <HowItWorks/>

               {/* <GlobalCTA/> */}

              <SuccessStories/>

              <GlobalFAQ/>

        
          

            </div>

        </div>

    );
};

export default GlobalWorkImmigration;