import {
    Filter,
    Search,
} from "lucide-react";

import "./BlogToolbar.css";

const BlogToolbar = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    statusOptions,
}) => {
    return (
        <section
            className="blog-toolbar"
            aria-label="Journal filters"
        >
            <div className="blog-toolbar__search">
                <Search
                    className="blog-toolbar__search-icon"
                    size={16}
                    strokeWidth={1.8}
                />

                <input
                    type="search"
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search articles, categories or authors..."
                    aria-label="Search journal articles"
                />

                {search && (
                    <button
                        type="button"
                        className="blog-toolbar__clear"
                        onClick={() =>
                            onSearchChange({
                                target: {
                                    value: "",
                                },
                            })
                        }
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>

            <div className="blog-toolbar__filters">
                <div className="blog-toolbar__filter-label">
                    <Filter
                        size={14}
                        strokeWidth={1.8}
                    />

                    <span>
                        View
                    </span>
                </div>

                <div
                    className="blog-toolbar__filter-list"
                    role="tablist"
                    aria-label="Filter articles by status"
                >
                    {statusOptions.map(
                        (option) => (
                            <button
                                key={
                                    option.value
                                }
                                type="button"
                                role="tab"
                                aria-selected={
                                    status ===
                                    option.value
                                }
                                className={
                                    status ===
                                        option.value
                                        ? "is-active"
                                        : ""
                                }
                                onClick={() =>
                                    onStatusChange(
                                        option.value,
                                    )
                                }
                            >
                                {
                                    option.label
                                }
                            </button>
                        ),
                    )}
                </div>
            </div>
        </section>
    );
};

export default BlogToolbar;