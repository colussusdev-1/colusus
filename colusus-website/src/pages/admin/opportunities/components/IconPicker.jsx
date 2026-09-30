import { useEffect, useMemo, useRef, useState } from "react";
import {
    HiOutlineAcademicCap,
    HiOutlineBanknotes,
    HiOutlineBeaker,
    HiOutlineBriefcase,
    HiOutlineBuildingLibrary,
    HiOutlineBuildingOffice2,
    HiOutlineCheckBadge,
    HiOutlineChevronDown,
    HiOutlineClipboardDocumentCheck,
    HiOutlineComputerDesktop,
    HiOutlineCurrencyDollar,
    HiOutlineDocumentText,
    HiOutlineHeart,
    HiOutlineHome,
    HiOutlineIdentification,
    HiOutlineMagnifyingGlass,
    HiOutlineMapPin,
    HiOutlineShieldCheck,
    HiOutlineTruck,
    HiOutlineUser,
    HiOutlineUserGroup,
    HiOutlineUsers,
    HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";

const ICON_OPTIONS = [
    {
        name: "Briefcase",
        value: "briefcase",
        icon: HiOutlineBriefcase,
        keywords: [
            "work",
            "job",
            "employment",
            "career",
            "business",
            "professional",
        ],
    },
    {
        name: "Academic Cap",
        value: "academic-cap",
        icon: HiOutlineAcademicCap,
        keywords: [
            "education",
            "study",
            "school",
            "university",
            "student",
            "degree",
        ],
    },
    {
        name: "Heart",
        value: "heart",
        icon: HiOutlineHeart,
        keywords: [
            "health",
            "healthcare",
            "medical",
            "nurse",
            "nursing",
            "care",
        ],
    },
    {
        name: "Beaker",
        value: "beaker",
        icon: HiOutlineBeaker,
        keywords: [
            "science",
            "laboratory",
            "lab",
            "research",
            "medical",
            "chemist",
        ],
    },
    {
        name: "Building Office",
        value: "building-office",
        icon: HiOutlineBuildingOffice2,
        keywords: [
            "office",
            "company",
            "corporate",
            "business",
            "workplace",
        ],
    },
    {
        name: "Building Library",
        value: "building-library",
        icon: HiOutlineBuildingLibrary,
        keywords: [
            "education",
            "school",
            "university",
            "institution",
            "library",
        ],
    },
    {
        name: "Computer",
        value: "computer",
        icon: HiOutlineComputerDesktop,
        keywords: [
            "technology",
            "tech",
            "software",
            "developer",
            "it",
            "computer",
            "digital",
        ],
    },
    {
        name: "Truck",
        value: "truck",
        icon: HiOutlineTruck,
        keywords: [
            "transport",
            "logistics",
            "driver",
            "delivery",
            "truck",
            "warehouse",
            "dispatch",
        ],
    },
    {
        name: "Home",
        value: "home",
        icon: HiOutlineHome,
        keywords: [
            "housing",
            "property",
            "real estate",
            "home",
            "accommodation",
        ],
    },
    {
        name: "Map Pin",
        value: "map-pin",
        icon: HiOutlineMapPin,
        keywords: [
            "location",
            "city",
            "place",
            "country",
            "address",
            "travel",
        ],
    },
    {
        name: "User",
        value: "user",
        icon: HiOutlineUser,
        keywords: [
            "person",
            "worker",
            "employee",
            "candidate",
            "individual",
        ],
    },
    {
        name: "User Group",
        value: "user-group",
        icon: HiOutlineUserGroup,
        keywords: [
            "team",
            "group",
            "workers",
            "employees",
            "people",
            "community",
        ],
    },
    {
        name: "Users",
        value: "users",
        icon: HiOutlineUsers,
        keywords: [
            "people",
            "team",
            "workers",
            "staff",
            "employees",
            "community",
        ],
    },
    {
        name: "Identification",
        value: "identification",
        icon: HiOutlineIdentification,
        keywords: [
            "identity",
            "passport",
            "id",
            "document",
            "verification",
            "immigration",
        ],
    },
    {
        name: "Document",
        value: "document",
        icon: HiOutlineDocumentText,
        keywords: [
            "document",
            "paper",
            "application",
            "form",
            "immigration",
        ],
    },
    {
        name: "Clipboard Check",
        value: "clipboard-check",
        icon: HiOutlineClipboardDocumentCheck,
        keywords: [
            "application",
            "checklist",
            "process",
            "approval",
            "verification",
            "completed",
        ],
    },
    {
        name: "Shield Check",
        value: "shield-check",
        icon: HiOutlineShieldCheck,
        keywords: [
            "security",
            "approved",
            "verified",
            "protection",
            "compliance",
        ],
    },
    {
        name: "Check Badge",
        value: "check-badge",
        icon: HiOutlineCheckBadge,
        keywords: [
            "verified",
            "approved",
            "success",
            "quality",
            "trusted",
        ],
    },
    {
        name: "Wrench",
        value: "wrench",
        icon: HiOutlineWrenchScrewdriver,
        keywords: [
            "construction",
            "technical",
            "maintenance",
            "engineering",
            "mechanic",
            "skilled",
        ],
    },
    {
        name: "Currency Dollar",
        value: "currency-dollar",
        icon: HiOutlineCurrencyDollar,
        keywords: [
            "salary",
            "money",
            "finance",
            "payment",
            "income",
            "dollar",
        ],
    },
    {
        name: "Banknotes",
        value: "banknotes",
        icon: HiOutlineBanknotes,
        keywords: [
            "salary",
            "money",
            "finance",
            "payment",
            "income",
            "cash",
        ],
    },
];

const IconPicker = ({
    value = "",
    onChange,
    label = "Opportunity icon",
    hint = "Search by icon name or what the icon represents.",
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef(null);

    const selectedIcon = useMemo(
        () =>
            ICON_OPTIONS.find(
                (option) => option.value === value,
            ),
        [value],
    );

    const filteredIcons = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return ICON_OPTIONS;
        }

        return ICON_OPTIONS.filter((option) => {
            const searchableText = [
                option.name,
                option.value,
                ...option.keywords,
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [search]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick,
            );
        };
    }, []);

    const handleSelect = (option) => {
        onChange(option.value);
        setOpen(false);
        setSearch("");
    };

    return (
        <div className="icon-picker" ref={containerRef}>
            <label className="field__label">{label}</label>

            {hint && (
                <p className="field__hint">{hint}</p>
            )}

            <button
                type="button"
                className={`icon-picker__trigger ${open ? "is-open" : ""
                    }`}
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
            >
                {selectedIcon ? (
                    <>
                        <span className="icon-picker__selected-icon">
                            <selectedIcon.icon />
                        </span>

                        <span className="icon-picker__selected-copy">
                            <strong>{selectedIcon.name}</strong>
                            <small>
                                {selectedIcon.keywords
                                    .slice(0, 3)
                                    .join(" · ")}
                            </small>
                        </span>
                    </>
                ) : (
                    <>
                        <span className="icon-picker__placeholder">
                            ✦
                        </span>

                        <span className="icon-picker__selected-copy">
                            <strong>Select an icon</strong>
                            <small>
                                Search by meaning or keyword
                            </small>
                        </span>
                    </>
                )}

                <HiOutlineChevronDown
                    className={`icon-picker__chevron ${open ? "is-open" : ""
                        }`}
                />
            </button>

            {open && (
                <div className="icon-picker__dropdown">
                    <div className="icon-picker__search">
                        <HiOutlineMagnifyingGlass />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search icons, e.g. nurse, truck, education..."
                            autoFocus
                        />
                    </div>

                    <div className="icon-picker__results">
                        {filteredIcons.length > 0 ? (
                            filteredIcons.map((option) => {
                                const Icon = option.icon;

                                return (
                                    <button
                                        type="button"
                                        key={option.value}
                                        className={`icon-picker__option ${selectedIcon?.value ===
                                                option.value
                                                ? "is-selected"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            handleSelect(option)
                                        }
                                    >
                                        <span className="icon-picker__option-icon">
                                            <Icon />
                                        </span>

                                        <span className="icon-picker__option-copy">
                                            <strong>
                                                {option.name}
                                            </strong>

                                            <small>
                                                {option.keywords
                                                    .slice(0, 4)
                                                    .join(" · ")}
                                            </small>
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="icon-picker__empty">
                                No matching icons found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconPicker;