import {
    HiOutlineChevronDown,
    HiOutlineFilter,
    HiOutlineSearch,
} from "react-icons/hi";

import "./ApplicationsToolbar.css";


const ApplicationsToolbar = ({
    filters,
    activeFilter,
    onFilterChange,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <section className="applications-toolbar">

            <div className="application-tabs">

                {filters.map((filter) => (
                    <button
                        key={filter.key}
                        type="button"
                        className={
                            activeFilter === filter.key
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
                ))}

            </div>


            <div className="application-tools">

                <label className="application-search">

                    <HiOutlineSearch aria-hidden="true" />

                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                        placeholder="Search applications..."
                        aria-label="Search applications"
                    />

                </label>


                <button
                    type="button"
                    className="application-filter-button"
                    aria-label="Filter applications"
                >
                    <HiOutlineFilter />

                    <span>
                        Filter
                    </span>

                    <HiOutlineChevronDown />
                </button>

            </div>

        </section>
    );
};


export default ApplicationsToolbar;