import { useState } from "react";

import AboutHero from "./sections/Hero/AboutHero";
import AboutProcess from "./sections/Process/AboutProcess";
import AboutStory from "./sections/Story/AboutStory";
import AboutWhyChooseUs from "./sections/WhyChooseUs/AboutWhyChooseUs";
import AboutValues from "./sections/Values/AboutValues";
import AboutTeam from "./sections/Team/AboutTeam";

import Footer from "../Home/sections/Footer/Footer";

import ServicesMegaMenu 
from "../Home/sections/Hero/ServiceMegaMenu/ServiceMegaMenu";

import {
    servicesLinks
} from "../../components/Navbar/serviceData"



const About = () => {


    const [servicesOpen,setServicesOpen] = useState(false);



    const closeServices = () => {

        setServicesOpen(false);

    };



    return (

        <>


            {
                servicesOpen && (

                    <ServicesMegaMenu

                        services={servicesLinks}

                        onClose={closeServices}

                    />

                )
            }





            <AboutHero

                onOpenServices={() =>
                    setServicesOpen(true)
                }

            />



            <AboutStory />


            <AboutWhyChooseUs />


            <AboutProcess />


            <AboutValues />


            <AboutTeam />



       

        </>

    );

};


export default About;