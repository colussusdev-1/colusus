import { useMemo } from "react";
import { useParams } from "react-router-dom";

import countries from "../Home/sections/Countries/countriesData";

import normalizeOpportunities from "./utils/normalizeOpportunities";

import CountryHero from "./components/CountryHero/CountryHero";
import PathwayExplorer from "./components/PathwayExplorer/PathwayExplorer";

import "./Opportunities.css";


const Opportunities = () => {

    const { country } = useParams();


    /* ==========================================================
       COUNTRY
    ========================================================== */

    const selectedCountry = useMemo(
        () =>
            countries.find(
                (item) => item.slug === country
            ),
        [country]
    );


    /* ==========================================================
       OPPORTUNITIES
    ========================================================== */

    const opportunities = useMemo(
        () =>
            selectedCountry
                ? normalizeOpportunities(selectedCountry)
                : [],
        [selectedCountry]
    );


    /* ==========================================================
       COUNTRY DATA
    ========================================================== */

    const countryData = useMemo(() => {

        if (!selectedCountry) {
            return null;
        }

        return {
            ...selectedCountry,

            opportunities,

            applicants:
                selectedCountry.applicants ||
                "500+",

            processingTime:
                selectedCountry.processingTime ||
                selectedCountry.duration ||
                "Varies",

            opportunityScore:
                selectedCountry.opportunityScore ||
                "High",

            successRate:
                selectedCountry.successRate ||
                "High",

            pathwaysCount:
                opportunities.length,
        };

    }, [
        selectedCountry,
        opportunities,
    ]);


    /* ==========================================================
       COUNTRY NOT FOUND
    ========================================================== */

    if (!countryData) {

        return (

            <main
                className="
                    opportunities-page
                    opportunities-error
                "
            >

                <div
                    className="
                        opportunities-error__content
                    "
                >

                    <span
                        className="
                            opportunities-error__eyebrow
                        "
                    >
                        Global Opportunities
                    </span>


                    <h1>
                        Country Not Found
                    </h1>


                    <p>
                        The destination you're looking
                        for is currently unavailable.
                    </p>

                </div>

            </main>

        );

    }


    /* ==========================================================
       PAGE
    ========================================================== */

    return (

        <main className="opportunities-page">

            {/* ==================================================
                01 — COUNTRY INTELLIGENCE
            ================================================== */}

            <CountryHero
                country={countryData}
            />


            {/* ==================================================
                02 — PATHWAY EXPLORER
            ================================================== */}

            <PathwayExplorer
                country={countryData}
            />

        </main>

    );

};


export default Opportunities;