import { useEffect, useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";

const CUSTOM_VALUE = "__CUSTOM__";

const SelectWithCustom = ({
    label,
    value = "",
    onChange,
    options = [],
    placeholder = "Select an option",
    customLabel = "Custom value",
    hint,
    disabled = false,
}) => {
    const isCustomValue =
        value &&
        !options.some((option) => option.value === value);

    const [mode, setMode] = useState(
        isCustomValue ? CUSTOM_VALUE : value,
    );

    const [customValue, setCustomValue] = useState(
        isCustomValue ? value : "",
    );

    useEffect(() => {
        const custom =
            value &&
            !options.some((option) => option.value === value);

        setMode(custom ? CUSTOM_VALUE : value);
        setCustomValue(custom ? value : "");
    }, [value, options]);

    const handleSelect = (event) => {
        const selected = event.target.value;

        setMode(selected);

        if (selected === CUSTOM_VALUE) {
            onChange(customValue);
            return;
        }

        onChange(selected);
    };

    const handleCustomChange = (event) => {
        const nextValue = event.target.value;

        setCustomValue(nextValue);
        onChange(nextValue);
    };

    return (
        <div className="field select-with-custom">
            {label && (
                <label className="field__label">
                    {label}
                </label>
            )}

            <div className="select-with-custom__select">
                <select
                    value={mode}
                    onChange={handleSelect}
                    disabled={disabled}
                >
                    <option value="">
                        {placeholder}
                    </option>

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}

                    <option value={CUSTOM_VALUE}>
                        {customLabel}
                    </option>
                </select>

                <HiOutlineChevronDown />
            </div>

            {mode === CUSTOM_VALUE && (
                <input
                    type="text"
                    className="field__input select-with-custom__input"
                    value={customValue}
                    onChange={handleCustomChange}
                    placeholder="Enter your custom value..."
                    disabled={disabled}
                />
            )}

            {hint && (
                <p className="field__hint">
                    {hint}
                </p>
            )}
        </div>
    );
};

export default SelectWithCustom;