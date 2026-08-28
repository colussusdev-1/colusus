import {
    useEffect
} from "react";

import {
    useLocation
} from "react-router-dom";


import Hero from "./sections/Hero/Hero";
import About from "./sections/About/About";
import StatsStrip from "./sections/About/StatsStrip";
import Countries from "./sections/Countries/Countries";

import Services from "../../components/Services/Services";
import ZeroDepositProgram from "../../components/ZeroDepositProgram/ZeroDepositProgram";

import SuccessStories from "./sections/SuccessStories/SuccessStories";
import ContactCTA from "./sections/ContactCTA/ContactCTA";

import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

import "./Home.css";


const Home = () => {

    const location = useLocation();


    /* =====================================================
       HASH / SECTION NAVIGATION

       Supports:

       /#countries
       /#global-opportunities

       Both will take the user to the Countries section.
    ===================================================== */

    useEffect(() => {

        const hash = location.hash;

        if (
            hash === "#countries" ||
            hash === "#global-opportunities"
        ) {

            /*
                Wait for the page and ScrollReveal
                wrappers to render before scrolling.
            */

            const timer = setTimeout(() => {

                const target =
                    document.getElementById("countries");

                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });

                }

            }, 250);


            return () => {

                clearTimeout(timer);

            };

        }

    }, [location.hash]);


    return (

        <main className="home-page">


            {/* =====================================================
                HERO
            ===================================================== */}

            <Hero />


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
                GLOBAL OPPORTUNITIES / COUNTRIES

                HERO:

                Explore Pathways
                    ↓
                #countries
                    ↓
                Countries section
            ===================================================== */}

            <div
                id="countries"
                className="home-global-opportunities"
            >

                <ScrollReveal
                    direction="right"
                    duration={1.3}
                    distance={55}
                    delay={0.05}
                >

                    <Countries />

                </ScrollReveal>

            </div>


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