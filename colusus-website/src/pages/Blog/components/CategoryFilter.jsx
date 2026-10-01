
import {
    Check,
    ChevronDown,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import "./CategoryFilter.css";


const CategoryFilter = ({
    categories = [],
    activeCategory = "all",
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);


    const items = useMemo(() => {
        const mappedCategories = categories
            .filter(Boolean)
            .map((category) => {
                if (typeof category === "string") {
                    return {
                        name: category,
                        label: category,
                        count: null,
                    };
                }

                return {
                    name: category.name,
                    label: category.name,
                    count: category.count ?? null,
                };
            })
            .filter((category) => category.name);


        const totalCount = mappedCategories.reduce(
            (total, category) =>
                total + (Number(category.count) || 0),
            0,
        );


        return [
            {
                name: "all",
                label: "All articles",
                count: totalCount || null,
            },
            ...mappedCategories,
        ];
    }, [categories]);


    const filteredItems = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return items;
        }

        return items.filter((item) =>
            item.label
                .toLowerCase()
                .includes(query),
        );
    }, [items, search]);


    const activeItem =
        items.find(
            (item) =>
                item.name === activeCategory,
        ) || items[0];


    const handleChange = (nextCategory) => {
        onChange?.(nextCategory);
        setIsOpen(false);
        setSearch("");
    };


    const clearFilter = () => {
        onChange?.("all");
        setIsOpen(false);
        setSearch("");
    };


    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target,
                )
            ) {
                setIsOpen(false);
            }
        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick,
        );


        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick,
            );
        };
    }, []);


    useEffect(() => {
        if (!isOpen) {
            setSearch("");
            return;
        }


        requestAnimationFrame(() => {
            searchInputRef.current?.focus();
        });
    }, [isOpen]);


    useEffect(() => {
        const handleEscape = (event) => {
            if (
                event.key === "Escape" &&
                isOpen
            ) {
                setIsOpen(false);
            }
        };


        document.addEventListener(
            "keydown",
            handleEscape,
        );


        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape,
            );
        };
    }, [isOpen]);


    return (
        <section className="blog-category-filter">

            <div className="blog-category-filter__header">

                <div className="blog-category-filter__heading">

                    <span className="blog-category-filter__mark">
                        <SlidersHorizontal size={14} />
                    </span>

                    <div className="blog-category-filter__heading-copy">

                        <span>
                            Browse the journal
                        </span>

                        <strong>
                            Explore by topic
                        </strong>

                    </div>

                </div>


                <div
                    className={`blog-category-filter__dropdown ${isOpen ? "is-open" : ""
                        }`}
                    ref={dropdownRef}
                >

                    <button
                        type="button"
                        className={`blog-category-filter__trigger ${isOpen ? "is-open" : ""
                            }`}
                        onClick={() =>
                            setIsOpen(
                                (current) =>
                                    !current,
                            )
                        }
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                    >

                        <span className="blog-category-filter__trigger-prefix">
                            Topic
                        </span>

                        <span className="blog-category-filter__trigger-value">
                            {activeItem?.label ||
                                "All articles"}
                        </span>

                        {activeItem?.count !== null &&
                            activeItem?.count !==
                            undefined && (
                                <span className="blog-category-filter__trigger-count">
                                    {activeItem.count}
                                </span>
                            )}

                        <ChevronDown
                            size={15}
                            className="blog-category-filter__chevron"
                        />

                    </button>


                    {isOpen && (
                        <div
                            className="blog-category-filter__menu"
                            role="listbox"
                            aria-label="Filter articles by topic"
                        >

                            <div className="blog-category-filter__menu-top">

                                <div>
                                    <span>
                                        Journal index
                                    </span>

                                    <strong>
                                        Select a topic
                                    </strong>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsOpen(
                                            false,
                                        )
                                    }
                                    aria-label="Close filter"
                                >
                                    <X size={14} />
                                </button>

                            </div>


                            <div className="blog-category-filter__search">

                                <Search size={14} />

                                <input
                                    ref={
                                        searchInputRef
                                    }
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target
                                                .value,
                                        )
                                    }
                                    placeholder="Find a topic..."
                                    aria-label="Search topics"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        aria-label="Clear search"
                                    >
                                        <X size={13} />
                                    </button>
                                )}

                            </div>


                            <div className="blog-category-filter__options">

                                {filteredItems.length > 0 ? (
                                    filteredItems.map(
                                        (item) => {
                                            const isActive =
                                                activeCategory ===
                                                item.name;

                                            return (
                                                <button
                                                    key={
                                                        item.name
                                                    }
                                                    type="button"
                                                    className={`blog-category-filter__option ${isActive
                                                            ? "is-active"
                                                            : ""
                                                        }`}
                                                    onClick={() =>
                                                        handleChange(
                                                            item.name,
                                                        )
                                                    }
                                                    role="option"
                                                    aria-selected={
                                                        isActive
                                                    }
                                                >

                                                    <span className="blog-category-filter__option-left">

                                                        <span className="blog-category-filter__option-indicator" />

                                                        <span className="blog-category-filter__option-name">
                                                            {
                                                                item.label
                                                            }
                                                        </span>

                                                    </span>


                                                    <span className="blog-category-filter__option-right">

                                                        {item.count !==
                                                            null && (
                                                                <small>
                                                                    {
                                                                        item.count
                                                                    }
                                                                </small>
                                                            )}

                                                        {isActive && (
                                                            <Check
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        )}

                                                    </span>

                                                </button>
                                            );
                                        },
                                    )
                                ) : (
                                    <div className="blog-category-filter__empty">
                                        <Search size={16} />

                                        <span>
                                            No matching topics
                                        </span>
                                    </div>
                                )}

                            </div>

                        </div>
                    )}

                </div>

            </div>


            <div className="blog-category-filter__status">

                <div className="blog-category-filter__status-copy">

                    <span className="blog-category-filter__status-label">
                        Reading
                    </span>

                    <span className="blog-category-filter__status-dot" />

                    <strong>
                        {activeItem?.label ||
                            "All articles"}
                    </strong>

                </div>


                {activeCategory !== "all" && (
                    <button
                        type="button"
                        className="blog-category-filter__clear"
                        onClick={clearFilter}
                    >
                        <X size={12} />
                        Clear
                    </button>
                )}

            </div>

        </section>
    );
};


export default CategoryFilter;
