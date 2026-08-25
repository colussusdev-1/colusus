import {
    HiOutlineSearch,
} from "react-icons/hi";

import "./ApplicationsToolbar.css";


const ApplicationsToolbar = ({
    filters = [],
    activeFilter,
    onFilterChange,
    searchQuery = "",
    onSearchChange,
}) => {

    return (
        <section className="applications-toolbar">

            {/* =====================================================
                APPLICATION STATUS TABS
            ===================================================== */}

            <div className="application-tabs">

                {filters.map((filter) => {

                    const isActive =
                        activeFilter === filter.key;

                    return (
                        <button
                            key={filter.key}
                            type="button"
                            className={
                                isActive
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                onFilterChange(filter.key)
                            }
                        >

                            <span className="application-tab-label">
                                {filter.label}
                            </span>


                            <span className="application-tab-count">
                                {filter.count}
                            </span>

                        </button>
                    );

                })}

            </div>


            {/* =====================================================
                SEARCH
            ===================================================== */}

            <div className="application-tools">

                <label
                    className="application-search"
                    htmlFor="applications-search"
                >

                    <HiOutlineSearch
                        aria-hidden="true"
                    />


                    <input
                        id="applications-search"
                        type="search"
                        value={searchQuery}
                        onChange={(event) =>
                            onSearchChange(
                                event.target.value
                            )
                        }
                        placeholder="Search applications..."
                        aria-label="Search applications"
                        autoComplete="off"
                    />

                </label>

            </div>

        </section>
    );
};


export default ApplicationsToolbar;