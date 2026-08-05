import {
    useState,
    useRef,
    useEffect
} from "react";


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



    const [showServices, setShowServices] = useState(false);


    const serviceMenuRef = useRef(null);







    const openServices = () => {

        setShowServices(true);

    };







    const closeServices = () => {

        setShowServices(false);

    };







    useEffect(() => {


        if (showServices) {


            setTimeout(() => {


                serviceMenuRef.current?.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });


            }, 50);


        }


    }, [showServices]);









    return (


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


                    <div

                        ref={serviceMenuRef}

                        className="service-menu-anchor"

                    >



                        <ServiceMegaMenu

                            services={servicesLinks}

                            onClose={closeServices}

                        />



                    </div>


                )
            }








            <Countries />







            <Services />







            <ZeroDepositProgram />







            <SuccessStories />







            <ContactCTA />






        </main>


    );

};



export default Home;