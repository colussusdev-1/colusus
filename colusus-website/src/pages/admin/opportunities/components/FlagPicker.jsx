import { useEffect, useMemo, useRef, useState } from "react";
import {
    HiOutlineChevronDown,
    HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

import countries from "../../../../data/countries";

const FlagPicker = ({
    value,
    onChange,
    label = "Country flag",
    hint = "Select the flag associated with this country.",
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const containerRef = useRef(null);

    const selectedCountry = useMemo(() => {
        if (!value) return null;

        return countries.find(
            (country) =>
                country.flagCode === String(value).toLowerCase() ||
                country.code === String(value).toUpperCase(),
        );
    }, [value]);

    const filteredCountries = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return countries;
        }

        return countries.filter((country) =>
            `${country.name} ${country.code}`
                .toLowerCase()
                .includes(query),
        );
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

    const handleSelect = (country) => {
        // Store the ISO country code.
        // Example: NG, GB, CA
        onChange(country.code);

        setOpen(false);
        setSearch("");
    };

    return (
        <div className="flag-picker" ref={containerRef}>
            <label className="field__label">{label}</label>

            <button
                type="button"
                className={`flag-picker__trigger ${open ? "is-open" : ""
                    }`}
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
            >
                {selectedCountry ? (
                    <span className="flag-picker__selected">
                        <span
                            className={`fi fi-${selectedCountry.flagCode} flag-picker__flag`}
                            aria-hidden="true"
                        />

                        <span className="flag-picker__selected-copy">
                            <strong>{selectedCountry.name}</strong>
                            <small>{selectedCountry.code}</small>
                        </span>
                    </span>
                ) : (
                    <span className="flag-picker__selected">
                        <span className="flag-picker__placeholder">
                            🌐
                        </span>

                        <span className="flag-picker__selected-copy">
                            <strong>Select a country flag</strong>
                            <small>
                                Search by country name or code
                            </small>
                        </span>
                    </span>
                )}

                <HiOutlineChevronDown
                    className={`flag-picker__chevron ${open ? "is-open" : ""
                        }`}
                />
            </button>

            {hint && <p className="field__hint">{hint}</p>}

            {open && (
                <div className="flag-picker__dropdown">
                    <div className="flag-picker__search">
                        <HiOutlineMagnifyingGlass />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search country..."
                            autoFocus
                        />
                    </div>

                    <div className="flag-picker__results">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    className={`flag-picker__option ${selectedCountry?.code ===
                                            country.code
                                            ? "is-selected"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        handleSelect(country)
                                    }
                                >
                                    <span
                                        className={`fi fi-${country.flagCode} flag-picker__option-flag`}
                                        aria-hidden="true"
                                    />

                                    <span className="flag-picker__option-copy">
                                        <strong>
                                            {country.name}
                                        </strong>

                                        <small>
                                            {country.code}
                                        </small>
                                    </span>
                                </button>
                            ))
                        ) : (
                            <div className="flag-picker__empty">
                                No countries found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlagPicker;