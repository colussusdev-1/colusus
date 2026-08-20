import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    HiOutlineSearch,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
} from "react-icons/hi";

import OpportunityCard from "../OpportunityCard/OpportunityCard";

import "./ChoosePathwayPanel.css";


const PAGE_SIZE = 6;


const ChoosePathwayPanel = ({
    opportunities = [],
    loading = false,

    search = "",
    category = "",

    categories = [],

    onSearchChange,
    onCategoryChange,
    onSelect,
}) => {

    const [currentPage, setCurrentPage] =
        useState(1);


    // ============================================================
    // TOTAL PAGES
    // ============================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            opportunities.length /
            PAGE_SIZE
        )
    );


    // ============================================================
    // RESET PAGE
    // ============================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        category,
        opportunities.length,
    ]);


    // ============================================================
    // CURRENT PAGE
    // ============================================================

    const safePage = Math.min(
        currentPage,
        totalPages
    );


    // ============================================================
    // VISIBLE OPPORTUNITIES
    // ============================================================

    const visibleOpportunities = useMemo(() => {

        const start =
            (safePage - 1) *
            PAGE_SIZE;


        return opportunities.slice(
            start,
            start + PAGE_SIZE
        );

    }, [
        opportunities,
        safePage,
    ]);


    // ============================================================
    // PAGINATION RANGE
    // ============================================================

    const showingFrom =
        opportunities.length === 0
            ? 0
            : (
                (safePage - 1) *
                PAGE_SIZE
            ) + 1;


    const showingTo =
        Math.min(
            safePage * PAGE_SIZE,
            opportunities.length
        );


    // ============================================================
    // PAGE NAVIGATION
    // ============================================================

    const goToPage = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }


        setCurrentPage(page);


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <section
            className="choose-pathway-panel"
            aria-label="Choose your migration pathway"
        >

            {/* ====================================================
                HEADER
            ==================================================== */}

            <div className="choose-pathway-header">

                <div className="choose-pathway-heading">

                    <div className="choose-pathway-number">
                        1
                    </div>


                    <div>

                        <h2>
                            Choose Your Pathway
                        </h2>

                        <p>
                            Explore migration opportunities
                            available through Colusus.
                        </p>

                    </div>

                </div>


                <div className="choose-pathway-count">

                    <strong>
                        {opportunities.length}
                    </strong>

                    <span>
                        pathways
                    </span>

                </div>

            </div>


            {/* ====================================================
                SEARCH
            ==================================================== */}

            <div className="choose-pathway-search">

                <HiOutlineSearch />

                <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                        onSearchChange?.(
                            event.target.value
                        )
                    }
                    placeholder="Search pathways, countries or visa types..."
                    aria-label="Search migration pathways"
                />

            </div>


            {/* ====================================================
                CATEGORY TABS
            ==================================================== */}

            <div
                className="choose-pathway-categories"
                role="tablist"
                aria-label="Pathway categories"
            >

                <button
                    type="button"
                    className={
                        `choose-pathway-category ${!category
                            ? "active"
                            : ""
                        }`
                    }
                    onClick={() =>
                        onCategoryChange?.("")
                    }
                >
                    All Pathways
                </button>


                {categories.map(
                    (item) => {

                        const value =
                            typeof item === "object"
                                ? item.value
                                : item;


                        const label =
                            typeof item === "object"
                                ? item.label
                                : item;


                        return (

                            <button
                                key={value}
                                type="button"
                                className={
                                    `choose-pathway-category ${category === value
                                        ? "active"
                                        : ""
                                    }`
                                }
                                onClick={() =>
                                    onCategoryChange?.(
                                        value
                                    )
                                }
                            >
                                {label}
                            </button>

                        );

                    }
                )}

            </div>


            {/* ====================================================
                RESULTS
            ==================================================== */}

            <div className="choose-pathway-results">

                {loading ? (

                    <div className="choose-pathway-loading">

                        {Array.from({
                            length: 6,
                        }).map(
                            (_, index) => (

                                <div
                                    key={index}
                                    className="choose-pathway-skeleton"
                                />

                            )
                        )}

                    </div>

                ) : visibleOpportunities.length > 0 ? (

                    <div className="choose-pathway-grid">

                        {visibleOpportunities.map(
                            (opportunity) => (

                                <OpportunityCard
                                    key={
                                        opportunity._id
                                    }
                                    opportunity={
                                        opportunity
                                    }
                                    onSelect={
                                        onSelect
                                    }
                                />

                            )
                        )}

                    </div>

                ) : (

                    <div className="choose-pathway-empty">

                        <div className="choose-pathway-empty-icon">
                            —
                        </div>

                        <h3>
                            No pathways found
                        </h3>

                        <p>
                            Try another search or
                            choose a different pathway
                            category.
                        </p>

                    </div>

                )}

            </div>


            {/* ====================================================
                PAGINATION
            ==================================================== */}

            {!loading &&
                opportunities.length > 0 && (

                    <div className="choose-pathway-footer">

                        <div className="choose-pathway-showing">

                            Showing{" "}

                            <strong>
                                {showingFrom}
                            </strong>

                            {" "}–{" "}

                            <strong>
                                {showingTo}
                            </strong>

                            {" "}of{" "}

                            <strong>
                                {opportunities.length}
                            </strong>

                            {" "}pathways

                        </div>


                        <div className="choose-pathway-pagination">

                            <button
                                type="button"
                                disabled={
                                    safePage === 1
                                }
                                onClick={() =>
                                    goToPage(
                                        safePage - 1
                                    )
                                }
                                aria-label="Previous page"
                            >
                                <HiOutlineChevronLeft />
                            </button>


                            {Array.from(
                                {
                                    length: totalPages,
                                },
                                (_, index) => {

                                    const page =
                                        index + 1;


                                    return (

                                        <button
                                            key={page}
                                            type="button"
                                            className={
                                                page === safePage
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                goToPage(
                                                    page
                                                )
                                            }
                                            aria-label={`Go to page ${page}`}
                                            aria-current={
                                                page === safePage
                                                    ? "page"
                                                    : undefined
                                            }
                                        >
                                            {page}
                                        </button>

                                    );

                                }
                            )}


                            <button
                                type="button"
                                disabled={
                                    safePage ===
                                    totalPages
                                }
                                onClick={() =>
                                    goToPage(
                                        safePage + 1
                                    )
                                }
                                aria-label="Next page"
                            >
                                <HiOutlineChevronRight />
                            </button>

                        </div>

                    </div>

                )}

        </section>

    );

};


export default ChoosePathwayPanel;