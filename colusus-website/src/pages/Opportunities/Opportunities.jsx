import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "react-router-dom";

import opportunityService
    from "../../services/opportunity.service";

import normalizeOpportunities
    from "./utils/normalizeOpportunities";

import CountryHero
    from "./components/CountryHero/CountryHero";

import PathwayExplorer
    from "./components/PathwayExplorer/PathwayExplorer";

import "./Opportunities.css";


const Opportunities = () => {

    const {
        country,
    } = useParams();


    const [countryData, setCountryData] =
        useState(null);

    const [opportunities, setOpportunities] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* ==========================================================
       LOAD COUNTRY + OPPORTUNITIES
    ========================================================== */

    useEffect(() => {

        let mounted = true;


        const loadOpportunities = async () => {

            try {

                setLoading(true);
                setError("");

                setCountryData(null);
                setOpportunities([]);


                /* ==================================================
                   NORMALIZE COUNTRY SLUG
                ================================================== */

                const normalizedCountry =
                    String(country || "")
                        .trim()
                        .toLowerCase();


                if (!normalizedCountry) {

                    if (!mounted) {
                        return;
                    }

                    setError("COUNTRY_NOT_FOUND");
                    setLoading(false);

                    return;
                }


                /* ==================================================
                   LOAD COUNTRY DIRECTORY
                ==================================================
                   
                   Country-level information comes from MongoDB.

                   Example:

                   {
                       slug: "ireland",
                       name: "Ireland",
                       image: "...",
                       flag: "...",
                       applicants: "...",
                       visa: "...",
                       duration: "...",
                       processingTime: "..."
                   }

                ================================================== */

                const countries =
                    await opportunityService.getCountries();


                if (!mounted) {
                    return;
                }


                const selectedCountry =
                    countries.find(
                        (item) =>
                            String(
                                item?.slug || ""
                            )
                                .trim()
                                .toLowerCase() ===
                            normalizedCountry
                    );


                /* ==================================================
                   COUNTRY NOT FOUND
                ================================================== */

                if (!selectedCountry) {

                    setCountryData(null);
                    setOpportunities([]);

                    setError(
                        "COUNTRY_NOT_FOUND"
                    );

                    return;
                }


                /* ==================================================
                   LOAD OPPORTUNITIES FOR COUNTRY
                ==================================================

                   This now comes directly from MongoDB.

                   GET:

                   /api/v1/opportunities?country=ireland

                ================================================== */

                const countryOpportunities =
                    await opportunityService.getOpportunities(
                        {
                            country:
                                selectedCountry.slug,
                        }
                    );


                if (!mounted) {
                    return;
                }


                /* ==================================================
                   NORMALIZE MONGODB OPPORTUNITIES
                ==================================================

                   The second argument is intentional.

                   normalizeOpportunities(
                       country,
                       opportunities
                   )

                   This prevents us from pretending the MongoDB
                   records are still stored inside countriesData.
                ================================================== */

                const normalizedOpportunities =
                    normalizeOpportunities(
                        selectedCountry,
                        Array.isArray(
                            countryOpportunities
                        )
                            ? countryOpportunities
                            : []
                    );


                /* ==================================================
                   FINAL COUNTRY DATA
                ================================================== */

                const finalCountryData = {

                    ...selectedCountry,

                    opportunities:
                        normalizedOpportunities,

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
                        normalizedOpportunities.length,
                };


                setOpportunities(
                    normalizedOpportunities
                );


                setCountryData(
                    finalCountryData
                );


            } catch (loadError) {

                console.error(
                    "Failed to load country opportunities:",
                    loadError
                );


                if (!mounted) {
                    return;
                }


                setCountryData(null);
                setOpportunities([]);

                setError(
                    "LOAD_FAILED"
                );

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }

        };


        loadOpportunities();


        return () => {

            mounted = false;

        };

    }, [
        country,
    ]);


    /* ==========================================================
       COUNTRY NOT FOUND
    ========================================================== */

    if (
        !loading &&
        error === "COUNTRY_NOT_FOUND"
    ) {

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
       LOAD ERROR
    ========================================================== */

    if (
        !loading &&
        error === "LOAD_FAILED"
    ) {

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
                        Unable to load opportunities
                    </h1>


                    <p>
                        We couldn't load this destination
                        right now. Please refresh the page
                        and try again.
                    </p>

                </div>

            </main>

        );

    }


    /* ==========================================================
       LOADING
    ========================================================== */

    if (
        loading ||
        !countryData
    ) {

        return (

            <main
                className="
                    opportunities-page
                    opportunities-loading
                "
            >

                <div
                    className="
                        opportunities-loading__content
                    "
                >

                    <span>
                        Global Opportunities
                    </span>


                    <h1>
                        Loading destination...
                    </h1>


                    <p>
                        We're loading the available
                        migration pathways.
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