import {
    useState
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

import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

import {
    servicesLinks
} from "../../components/Navbar/serviceData";

import "./Home.css";


const Home = () => {

    const [showServices, setShowServices] = useState(false);


    const openServices = () => {

        setShowServices(true);

    };


    const closeServices = () => {

        setShowServices(false);

    };


    return (

        <main className="home-page">


            {/* =====================================================
                HERO
            ===================================================== */}

            <Hero
                openServices={openServices}
            />


            {/* =====================================================
                STATS
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.25}
                distance={65}
            >

                <StatsStrip />

            </ScrollReveal>


            {/* =====================================================
                ABOUT
            ===================================================== */}

            <ScrollReveal
                direction="left"
                duration={1.3}
                distance={55}
                delay={0.05}
            >

                <About />

            </ScrollReveal>


            {/* =====================================================
                SERVICE MEGA MENU
            ===================================================== */}

            {
                showServices && (

                    <ServiceMegaMenu
                        services={servicesLinks}
                        onClose={closeServices}
                    />

                )
            }


            {/* =====================================================
                COUNTRIES
            ===================================================== */}

            <ScrollReveal
                direction="right"
                duration={1.3}
                distance={55}
                delay={0.05}
            >

                <Countries />

            </ScrollReveal>


            {/* =====================================================
                SERVICES
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.35}
                distance={65}
                delay={0.08}
            >

                <Services />

            </ScrollReveal>


            {/* =====================================================
                ZERO DEPOSIT PROGRAM
            ===================================================== */}

            <ScrollReveal
                direction="left"
                duration={1.3}
                distance={55}
                delay={0.08}
            >

                <ZeroDepositProgram />

            </ScrollReveal>


            {/* =====================================================
                SUCCESS STORIES
            ===================================================== */}

            <ScrollReveal
                direction="right"
                duration={1.35}
                distance={55}
                delay={0.1}
            >

                <SuccessStories />

            </ScrollReveal>


            {/* =====================================================
                CONTACT CTA
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.25}
                distance={60}
                delay={0.08}
            >

                <ContactCTA />

            </ScrollReveal>


        </main>

    );

};


export default Home;