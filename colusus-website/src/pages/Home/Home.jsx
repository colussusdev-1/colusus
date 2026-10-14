import {
    useEffect,
} from "react";

import {
    useLocation,
} from "react-router-dom";

/* ======================================================
   HOME SECTIONS
====================================================== */

import Hero from "./sections/Hero/Hero";
import About from "./sections/About/About";
import StatsStrip from "./sections/About/StatsStrip";
import Countries from "./sections/Countries/Countries";

import MigrationJourney
    from "./sections/MigrationJourney/MigrationJourney";

/* ======================================================
   SHARED COMPONENTS
====================================================== */

import Services from "../../components/Services/Services";

import ZeroDepositProgram
    from "../../components/ZeroDepositProgram/ZeroDepositProgram";

import SuccessStories
    from "./sections/SuccessStories/SuccessStories";

import ContactCTA
    from "./sections/ContactCTA/ContactCTA";

import ScrollReveal
    from "../../components/ScrollReveal/ScrollReveal";

/* ======================================================
   STYLES
====================================================== */

import "./Home.css";


const Home = () => {
    const location = useLocation();

    /* ======================================================
       HASH / SECTION NAVIGATION

       Supports:
       /#countries
       /#global-opportunities

       Both navigate to the Countries section.
    ====================================================== */

    useEffect(() => {
        const hash = location.hash;

        if (
            hash === "#countries" ||
            hash === "#global-opportunities"
        ) {
            const timer = setTimeout(() => {
                const target = document.getElementById("countries");

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
                1. HERO
            ===================================================== */}

            <Hero />


            {/* =====================================================
                2. STATS / TRUST INDICATORS
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.1}
                distance={35}
            >
                <StatsStrip />
            </ScrollReveal>


            {/* =====================================================
                3. DESTINATIONS / GLOBAL OPPORTUNITIES
            ===================================================== */}

            <div
                id="countries"
                className="home-global-opportunities"
            >
                <ScrollReveal
                    direction="up"
                    duration={1.1}
                    distance={35}
                >
                    <Countries />
                </ScrollReveal>
            </div>


            {/* =====================================================
                4. MIGRATION JOURNEY
                8 STEPS TO YOUR DREAM DESTINATION
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.1}
                distance={35}
            >
                <MigrationJourney />
            </ScrollReveal>


            {/* =====================================================
                5. SERVICES
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.1}
                distance={35}
            >
                <Services />
            </ScrollReveal>


            {/* =====================================================
                6. ZERO DEPOSIT PROGRAM
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.1}
                distance={35}
            >
                <ZeroDepositProgram />
            </ScrollReveal>


            {/* =====================================================
                7. SUCCESS STORIES
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.1}
                distance={35}
            >
                <SuccessStories />
            </ScrollReveal>


            {/* =====================================================
                8. ABOUT COLOSSUS
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.1}
                distance={35}
            >
                <About />
            </ScrollReveal>


            {/* =====================================================
                9. CONTACT CTA
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.1}
                distance={35}
            >
                <ContactCTA />
            </ScrollReveal>

        </main>
    );
};


export default Home;