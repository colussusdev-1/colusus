import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import opportunityService from "../../services/opportunity.service.js";
import applicationService from "../../services/application.service.js";

import WorkflowStepper from "../../components/ClientPortal/applications/NewApplication/WorkflowStepper/WorkflowStepper.jsx";

import NewApplicationHeader from "../../components/ClientPortal/applications/NewApplication/NewApplicationHeader/NewApplicationHeader.jsx";

import ChoosePathwayPanel from "../../components/ClientPortal/applications/NewApplication/ChoosePathwayPanel/ChoosePathwayPanel.jsx";

import OpportunityPreview from "../../components/ClientPortal/applications/NewApplication/OpportunityPreview/OpportunityPreview.jsx";

import "./NewApplication.css";


const NewApplication = () => {

    const navigate = useNavigate();


    // ============================================================
    // OPPORTUNITIES
    // ============================================================

    const [opportunities, setOpportunities] = useState([]);

    const [loading, setLoading] = useState(true);


    // ============================================================
    // SELECTED OPPORTUNITY
    // ============================================================

    const [selectedOpportunity, setSelectedOpportunity] =
        useState(null);

    const [startingApplication, setStartingApplication] =
        useState(false);


    // ============================================================
    // ERROR
    // ============================================================

    const [error, setError] = useState("");


    // ============================================================
    // FILTER STATE
    // ============================================================

    const [filters, setFilters] = useState({
        search: "",
        category: "",
    });


    // ============================================================
    // LOAD OPPORTUNITIES
    // ============================================================

    useEffect(() => {

        let mounted = true;


        const loadOpportunities = async () => {

            try {

                setLoading(true);

                setError("");


                const data =
                    await opportunityService.getOpportunities();


                if (!mounted) {
                    return;
                }


                setOpportunities(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch (error) {

                if (!mounted) {
                    return;
                }


                console.error(
                    "FAILED TO LOAD OPPORTUNITIES:",
                    error
                );


                setError(
                    error?.response?.data?.message ||
                    "Unable to load migration opportunities. Please try again."
                );


                setOpportunities([]);


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

    }, []);


    // ============================================================
    // CATEGORY OPTIONS
    // ============================================================

    const categories = useMemo(() => {

        const values = [];


        opportunities.forEach(
            (opportunity) => {

                if (opportunity?.category) {

                    values.push(
                        opportunity.category
                    );

                }


                if (
                    Array.isArray(
                        opportunity?.countryCategories
                    )
                ) {

                    values.push(
                        ...opportunity.countryCategories
                    );

                }

            }
        );


        return [
            ...new Set(
                values
                    .filter(Boolean)
                    .map((value) =>
                        String(value).trim()
                    )
                    .filter(Boolean)
            ),
        ].sort();

    }, [opportunities]);


    // ============================================================
    // FILTERED OPPORTUNITIES
    // ============================================================

    const filteredOpportunities = useMemo(() => {

        const search =
            filters.search
                .trim()
                .toLowerCase();


        return opportunities.filter(
            (opportunity) => {

                // ------------------------------------------------
                // SEARCH
                // ------------------------------------------------

                const searchableText = [

                    opportunity?.title,

                    opportunity?.countryName,

                    opportunity?.description,

                    opportunity?.category,

                    opportunity?.type,

                    opportunity?.location,

                    opportunity?.salary,

                    opportunity?.demand,

                    ...(Array.isArray(
                        opportunity?.highlights
                    )
                        ? opportunity.highlights
                        : []),

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchableText.includes(search);


                // ------------------------------------------------
                // CATEGORY
                // ------------------------------------------------

                const opportunityCategories =
                    Array.isArray(
                        opportunity?.countryCategories
                    )
                        ? opportunity.countryCategories
                        : [];


                const matchesCategory =
                    !filters.category ||
                    opportunity?.category ===
                    filters.category ||
                    opportunityCategories.includes(
                        filters.category
                    );


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );

    }, [
        opportunities,
        filters,
    ]);


    // ============================================================
    // SEARCH
    // ============================================================

    const handleSearchChange = (value) => {

        setFilters((previous) => ({
            ...previous,
            search: value,
        }));

    };


    // ============================================================
    // CATEGORY
    // ============================================================

    const handleCategoryChange = (value) => {

        setFilters((previous) => ({
            ...previous,
            category: value,
        }));

    };


    // ============================================================
    // SELECT PATHWAY
    // ============================================================

    const handleSelectOpportunity = (
        opportunity
    ) => {

        if (!opportunity) {
            return;
        }


        setError("");

        setSelectedOpportunity(
            opportunity
        );

    };


    // ============================================================
    // CLOSE PREVIEW
    // ============================================================

    const handleClosePreview = () => {

        if (startingApplication) {
            return;
        }


        setSelectedOpportunity(null);

    };


    // ============================================================
    // CREATE APPLICATION
    // ============================================================
    /*
     * IMPORTANT:
     *
     * The frontend only sends the selected opportunity.
     *
     * We intentionally DO NOT send:
     *
     * type: selectedOpportunity.type
     *
     * because Opportunity.type contains public-facing values
     * such as:
     *
     * "Standard Work Permit Package"
     * "Student Route"
     * "Healthcare Worker"
     *
     * while Application.type expects:
     *
     * "WORK_VISA"
     * "STUDENT_VISA"
     * "TOURIST_VISA"
     * "PERMANENT_RESIDENCE"
     *
     * The backend application service is now responsible for
     * deriving the correct internal application type.
     */

    const handleStartApplication = async () => {

        if (
            !selectedOpportunity ||
            startingApplication
        ) {
            return;
        }


        try {

            setStartingApplication(true);

            setError("");


            /*
             * Create the application draft.
             *
             * The backend determines the internal
             * application type from the Opportunity.
             */

            const application =
                await applicationService.createApplication({

                    opportunity:
                        selectedOpportunity._id,

                    destinationCountry:
                        selectedOpportunity.countryName,

                });


            /*
             * Make sure the API returned an
             * actual application.
             */

            if (!application?._id) {

                throw new Error(
                    "The application draft was created, but no application ID was returned."
                );

            }


            /*
             * Close the pathway preview before
             * moving into the application workflow.
             */

            setSelectedOpportunity(null);


            /*
             * The client now owns a real DRAFT
             * application.
             *
             * Continue into the application workflow.
             */

            navigate(
                `/portal/applications/${application._id}`
            );


        } catch (error) {

            console.error(
                "FAILED TO START APPLICATION:",
                error
            );


            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to start your application. Please try again."
            );


        } finally {

            setStartingApplication(false);

        }

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <section className="new-application">

            {/* ====================================================
                WORKFLOW STEPPER
            ==================================================== */}

            <WorkflowStepper
                currentStep={1}
            />


            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            <NewApplicationHeader
                opportunitiesCount={
                    filteredOpportunities.length
                }
            />


            {/* ====================================================
                ERROR
            ==================================================== */}

            {error && (

                <div
                    className="new-application-error"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {/* ====================================================
                CHOOSE YOUR PATHWAY
            ==================================================== */}

            <ChoosePathwayPanel

                opportunities={
                    filteredOpportunities
                }

                loading={
                    loading
                }

                search={
                    filters.search
                }

                category={
                    filters.category
                }

                categories={
                    categories
                }

                onSearchChange={
                    handleSearchChange
                }

                onCategoryChange={
                    handleCategoryChange
                }

                onSelect={
                    handleSelectOpportunity
                }

            />


            {/* ====================================================
                PATHWAY PREVIEW
            ==================================================== */}

            {selectedOpportunity && (

                <OpportunityPreview

                    opportunity={
                        selectedOpportunity
                    }

                    onClose={
                        handleClosePreview
                    }

                    onStartApplication={
                        handleStartApplication
                    }

                    loading={
                        startingApplication
                    }

                />

            )}

        </section>

    );

};


export default NewApplication;