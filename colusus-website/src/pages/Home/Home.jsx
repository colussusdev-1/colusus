import { useState } from "react";


import Hero from "./sections/Hero/Hero";

import About from "./sections/About/About";

import StatsStrip from "./sections/About/StatsStrip";

import Countries from "./sections/Countries/Countries";

import Services from "../../components/Services/Services";

import ZeroDepositProgram from "../../components/ZeroDepositProgram/ZeroDepositProgram";

import SuccessStories from "./sections/SuccessStories/SuccessStories";

import ContactCTA from "./sections/ContactCTA/ContactCTA";

import ServiceMegaMenu from "./sections/Hero/ServiceMegaMenu/ServiceMegaMenu";


import {
    servicesLinks
} from "../../components/Navbar/serviceData";



const Home = () => {



    const [showServices,setShowServices] = useState(false);

    const openServices = () => {

        setShowServices(true);

    };

    const closeServices = () => {

        setShowServices(false);

    };





    return (


        <>



            <main>




                <Hero

                    openServices={openServices}

                />





                <StatsStrip />





                <About

                    openServices={openServices}

                />

                {
                    showServices && (

                        <ServiceMegaMenu

                            services={servicesLinks}

                            onClose={closeServices}

                        />

                    )
                }






                <Countries />



                <Services />



                <ZeroDepositProgram />



                <SuccessStories />



                <ContactCTA />



            </main>




        </>

    );

};



export default Home;