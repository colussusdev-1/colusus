import {
    useEffect,
} from "react";

import {
    useLocation,
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

    /*
    ============================================================
    HASH / SECTION NAVIGATION

    Supports:
    /#countries
    /#global-opportunities

    Both navigate to the Countries section.
    ============================================================
    */

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
                4. SERVICES
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.1}
                distance={35}
            >
                <Services />
            </ScrollReveal>


            {/* =====================================================
                5. ZERO DEPOSIT PROGRAM
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.1}
                distance={35}
            >
                <ZeroDepositProgram />
            </ScrollReveal>


            {/* =====================================================
                6. SUCCESS STORIES
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.1}
                distance={35}
            >
                <SuccessStories />
            </ScrollReveal>


            {/* =====================================================
                7. ABOUT COLOSSUS
            ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={1.1}
                distance={35}
            >
                <About />
            </ScrollReveal>


            {/* =====================================================
                8. CONTACT CTA
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