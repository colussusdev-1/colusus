import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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

import Services from "../../components/Services/HomeServices";

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
import HomeServices from "../../components/Services/HomeServices";

const Home = () => {
    const location = useLocation();


    /* ======================================================
       HASH / SECTION NAVIGATION
    
       Supports:
       /#countries
       /#global-opportunities
    ====================================================== */

    useEffect(() => {
        const hash = location.hash;

        if (
            hash !== "#countries" &&
            hash !== "#global-opportunities"
        ) {
            return;
        }

        let attempts = 0;
        let timer;

        const scrollToCountries = () => {
            const target = document.getElementById("countries");

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                return;
            }

            attempts += 1;

            if (attempts < 10) {
                timer = window.setTimeout(
                    scrollToCountries,
                    50
                );
            }
        };

        timer = window.setTimeout(scrollToCountries, 0);

        return () => {
            window.clearTimeout(timer);
        };
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
                duration={0.45}
                distance={18}
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
                    duration={0.45}
                    distance={18}
                >
                    <Countries />
                </ScrollReveal>
            </div>

            {/* =====================================================
            4. MIGRATION JOURNEY
        ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={0.45}
                distance={18}
            >
                <MigrationJourney />
            </ScrollReveal>

            {/* =====================================================
            5. SERVICES
        ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={0.45}
                distance={18}
            >
                <HomeServices/>
            </ScrollReveal>

            {/* =====================================================
            6. ZERO DEPOSIT PROGRAM
        ===================================================== */}
{/* 
            <ScrollReveal
                direction="up"
                duration={0.45}
                distance={18}
            >
                <ZeroDepositProgram />
            </ScrollReveal> */}

            {/* =====================================================
            7. SUCCESS STORIES
        ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={0.45}
                distance={18}
            >
                <SuccessStories />
            </ScrollReveal>

            {/* =====================================================
            8. ABOUT COLOSSUS
        ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={0.45}
                distance={18}
            >
                <About />
            </ScrollReveal>

            {/* =====================================================
            9. CONTACT CTA
        ===================================================== */}

            <ScrollReveal
                direction="up"
                duration={0.45}
                distance={18}
            >
                <ContactCTA />
            </ScrollReveal>

        </main>
    );


};

export default Home;
