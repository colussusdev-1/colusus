import {
    HiOutlineSearch,
    HiOutlineAdjustments,
    HiOutlineX,
    HiOutlineLocationMarker,
    HiOutlineBriefcase,
    HiOutlineChevronDown,
} from "react-icons/hi";

import "./OpportunityFilters.css";


const OpportunityFilters = ({
    filters = {
        search: "",
        country: "ALL",
        category: "ALL",
        type: "ALL",
    },

    countries = [],
    categories = [],
    types = [],

    resultsCount = 0,

    onChange,
}) => {

    const {
        search = "",
        country = "ALL",
        category = "ALL",
        type = "ALL",
    } = filters;


    /* ============================================================
       FILTER UPDATE
    ============================================================ */

    const updateFilter = (key, value) => {

        onChange?.({
            ...filters,
            [key]: value,
        });

    };


    /* ============================================================
       CLEAR
    ============================================================ */

    const hasActiveFilters =
        search.trim() !== "" ||
        country !== "ALL" ||
        category !== "ALL" ||
        type !== "ALL";


    const clearFilters = () => {

        onChange?.({
            search: "",
            country: "ALL",
            category: "ALL",
            type: "ALL",
        });

    };


    /* ============================================================
       OPTION NORMALIZER
    ============================================================ */

    const getOptionValue = (item) => {

        if (typeof item === "object") {
            return item.value;
        }

        return item;

    };


    const getOptionLabel = (item) => {

        if (typeof item === "object") {
            return item.label;
        }

        return item;

    };


    return (
        <section
            className="opportunity-filters"
            aria-label="Find a migration pathway"
        >

            {/* =====================================================
                TOP ROW
            ===================================================== */}

            <div className="opportunity-filters-top">

                <div className="opportunity-filters-title">

                    <div className="opportunity-filters-icon">
                        <HiOutlineAdjustments />
                    </div>

                    <div>

                        <span className="opportunity-filters-kicker">
                            PATHWAY DISCOVERY
                        </span>

                        <h2>
                            Find a pathway that fits your goals
                        </h2>

                        <p>
                            Compare migration options and find where
                            you have the strongest fit.
                        </p>

                    </div>

                </div>


                <div className="opportunity-filters-result">

                    <strong>
                        {resultsCount}
                    </strong>

                    <span>
                        {resultsCount === 1
                            ? "pathway"
                            : "pathways"}
                    </span>

                </div>

            </div>


            {/* =====================================================
                SEARCH
            ===================================================== */}

            <div className="opportunity-filters-search-row">

                <div className="opportunity-filters-search">

                    <HiOutlineSearch />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            updateFilter(
                                "search",
                                event.target.value
                            )
                        }
                        placeholder="Search by pathway, profession or country..."
                        aria-label="Search migration pathways"
                    />


                    {search && (
                        <button
                            type="button"
                            className="opportunity-filters-search-clear"
                            onClick={() =>
                                updateFilter("search", "")
                            }
                            aria-label="Clear search"
                        >
                            <HiOutlineX />
                        </button>
                    )}

                </div>


                {hasActiveFilters && (
                    <button
                        type="button"
                        className="opportunity-filters-clear"
                        onClick={clearFilters}
                    >
                        <HiOutlineX />

                        <span>
                            Reset
                        </span>
                    </button>
                )}

            </div>


            {/* =====================================================
                FILTERS
            ===================================================== */}

            <div className="opportunity-filters-options">


                {/* COUNTRY */}

                <div className="opportunity-filter">

                    <label htmlFor="opportunity-country">

                        <HiOutlineLocationMarker />

                        Country

                    </label>


                    <div className="opportunity-filter-select">

                        <select
                            id="opportunity-country"
                            value={country}
                            onChange={(event) =>
                                updateFilter(
                                    "country",
                                    event.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All countries
                            </option>

                            {countries.map((item) => {

                                const value =
                                    getOptionValue(item);

                                const label =
                                    getOptionLabel(item);

                                return (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {label}
                                    </option>
                                );

                            })}

                        </select>

                        <HiOutlineChevronDown />

                    </div>

                </div>


                {/* CATEGORY */}

                <div className="opportunity-filter">

                    <label htmlFor="opportunity-category">

                        <HiOutlineBriefcase />

                        Category

                    </label>


                    <div className="opportunity-filter-select">

                        <select
                            id="opportunity-category"
                            value={category}
                            onChange={(event) =>
                                updateFilter(
                                    "category",
                                    event.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All categories
                            </option>

                            {categories.map((item) => {

                                const value =
                                    getOptionValue(item);

                                const label =
                                    getOptionLabel(item);

                                return (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {label}
                                    </option>
                                );

                            })}

                        </select>

                        <HiOutlineChevronDown />

                    </div>

                </div>


                {/* TYPE */}

                <div className="opportunity-filter">

                    <label htmlFor="opportunity-type">

                        <HiOutlineAdjustments />

                        Pathway type

                    </label>


                    <div className="opportunity-filter-select">

                        <select
                            id="opportunity-type"
                            value={type}
                            onChange={(event) =>
                                updateFilter(
                                    "type",
                                    event.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All types
                            </option>

                            {types.map((item) => {

                                const value =
                                    getOptionValue(item);

                                const label =
                                    getOptionLabel(item);

                                return (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {label}
                                    </option>
                                );

                            })}

                        </select>

                        <HiOutlineChevronDown />

                    </div>

                </div>


            </div>


            {/* =====================================================
                ACTIVE FILTER INDICATOR
            ===================================================== */}

            {hasActiveFilters && (
                <div className="opportunity-filters-active">

                    <span className="opportunity-filters-active-dot" />

                    <span>
                        Showing {resultsCount} matching{" "}
                        {resultsCount === 1
                            ? "pathway"
                            : "pathways"}
                    </span>

                </div>
            )}

        </section>
    );
};


export default OpportunityFilters;