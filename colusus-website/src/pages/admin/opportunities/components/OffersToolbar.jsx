import {
    FiChevronDown,
    FiFilter,
    FiSearch,
    FiSliders,
    FiX,
} from "react-icons/fi";

import "./OffersToolbar.css";

function OffersToolbar({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    countryFilter,
    setCountryFilter,
    categoryFilter,
    setCategoryFilter,
    countries = [],
    categories = [],
    onClearFilters,
    hasActiveFilters,
}) {
    const activeFilterCount = [
        statusFilter !== "ALL",
        countryFilter !== "ALL",
        categoryFilter !== "ALL",
    ].filter(Boolean).length;

    return (
        <section className="offers-toolbar">
            <div className="offers-toolbar__header">
                <div className="offers-toolbar__identity">
                    <div className="offers-toolbar__identity-icon">
                        <FiSliders />
                    </div>

                    <div className="offers-toolbar__identity-copy">
                        <div className="offers-toolbar__eyebrow">
                            OFFER CATALOGUE
                        </div>

                        <div className="offers-toolbar__title-row">
                            <h2 className="offers-toolbar__title">
                                Browse offers
                            </h2>

                            {hasActiveFilters && (
                                <span className="offers-toolbar__active-badge">
                                    <span />
                                    {activeFilterCount} active
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        className="offers-toolbar__reset"
                        onClick={onClearFilters}
                    >
                        <FiX />
                        <span>Reset filters</span>
                    </button>
                )}
            </div>

            <div className="offers-toolbar__bar">
                <label className="offers-toolbar__search">
                    <FiSearch className="offers-toolbar__search-icon" />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by offer, country, category..."
                        aria-label="Search offers"
                    />

                    {search && (
                        <button
                            type="button"
                            className="offers-toolbar__search-clear"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            <FiX />
                        </button>
                    )}
                </label>

                <div className="offers-toolbar__filters">
                    <div className="offers-toolbar__filter-label">
                        <FiFilter />
                        <span>Filters</span>
                    </div>

                    <label className="offers-toolbar__select">
                        <span>Status</span>

                        <div className="offers-toolbar__select-wrap">
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                            >
                                <option value="ALL">All offers</option>
                                <option value="PUBLISHED">
                                    Published
                                </option>
                                <option value="INACTIVE">
                                    Inactive
                                </option>
                            </select>

                            <FiChevronDown />
                        </div>
                    </label>

                    <label className="offers-toolbar__select">
                        <span>Destination</span>

                        <div className="offers-toolbar__select-wrap">
                            <select
                                value={countryFilter}
                                onChange={(event) =>
                                    setCountryFilter(event.target.value)
                                }
                            >
                                <option value="ALL">
                                    All destinations
                                </option>

                                {countries.map((country) => (
                                    <option
                                        key={country}
                                        value={country}
                                    >
                                        {country}
                                    </option>
                                ))}
                            </select>

                            <FiChevronDown />
                        </div>
                    </label>

                    <label className="offers-toolbar__select">
                        <span>Category</span>

                        <div className="offers-toolbar__select-wrap">
                            <select
                                value={categoryFilter}
                                onChange={(event) =>
                                    setCategoryFilter(event.target.value)
                                }
                            >
                                <option value="ALL">
                                    All categories
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}
                            </select>

                            <FiChevronDown />
                        </div>
                    </label>
                </div>
            </div>
        </section>
    );
}

export default OffersToolbar;