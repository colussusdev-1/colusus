import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import SelectWithCustom from "./SelectWithCustom";

const CATEGORY_OPTIONS = [
    { value: "Work", label: "Work" },
    { value: "Skilled Migration", label: "Skilled Migration" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Nursing", label: "Nursing" },
    { value: "Caregiving", label: "Caregiving" },
    { value: "Education", label: "Education" },
    { value: "Study", label: "Study" },
    { value: "Family Migration", label: "Family Migration" },
    { value: "Business", label: "Business" },
    { value: "Investment", label: "Investment" },
    { value: "Permanent Residence", label: "Permanent Residence" },
    { value: "Technology", label: "Technology" },
    { value: "Engineering", label: "Engineering" },
    { value: "Hospitality", label: "Hospitality" },
    { value: "Construction", label: "Construction" },
    { value: "Agriculture", label: "Agriculture" },
    { value: "Finance", label: "Finance" },
    { value: "Legal", label: "Legal" },
    { value: "Transport & Logistics", label: "Transport & Logistics" },
    { value: "Other", label: "Other" },
];

const CategoryPicker = ({ value = [], onChange }) => {
    const categories = Array.isArray(value) ? value : [];

    const updateCategory = (index, nextValue) => {
        const updated = [...categories];
        updated[index] = nextValue;
        onChange(updated);
    };

    const addCategory = () => {
        onChange([...categories, ""]);
    };

    const removeCategory = (index) => {
        onChange(categories.filter((_, itemIndex) => itemIndex !== index));
    };

    return (
        <div className="category-picker">
            <div className="category-picker__header">
                <div>
                    <label className="field__label">
                        Country categories
                    </label>

                    <p className="field__hint">
                        Add the migration, work, study, or service
                        categories that apply to this country.
                    </p>
                </div>

                <button
                    type="button"
                    className="category-picker__add"
                    onClick={addCategory}
                >
                    <HiOutlinePlus />
                    <span>Add category</span>
                </button>
            </div>

            {categories.length === 0 ? (
                <div className="category-picker__empty">
                    <p>No categories added yet.</p>

                    <button
                        type="button"
                        onClick={addCategory}
                    >
                        <HiOutlinePlus />
                        Add the first category
                    </button>
                </div>
            ) : (
                <div className="category-picker__list">
                    {categories.map((category, index) => (
                        <div
                            className="category-picker__row"
                            key={`category-${index}`}
                        >
                            <div className="category-picker__number">
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="category-picker__field">
                                <SelectWithCustom
                                    value={category}
                                    onChange={(nextValue) =>
                                        updateCategory(
                                            index,
                                            nextValue,
                                        )
                                    }
                                    options={CATEGORY_OPTIONS}
                                    placeholder="Select category"
                                    customLabel="Custom category"
                                />
                            </div>

                            <button
                                type="button"
                                className="category-picker__remove"
                                onClick={() =>
                                    removeCategory(index)
                                }
                                aria-label={`Remove category ${index + 1
                                    }`}
                                title="Remove category"
                            >
                                <HiOutlineTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPicker;