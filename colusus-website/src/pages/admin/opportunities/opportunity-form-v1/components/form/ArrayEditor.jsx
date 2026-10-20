import Field from "./Field";

const ArrayEditor = ({
  title,
  items = [],
  onChange,
  placeholder = "Add an item",
  addLabel = "Add item",
}) => {
  const safeItems = Array.isArray(items) ? items : [];

  const updateItem = (index, value) => {
    onChange(safeItems.map((item, itemIndex) => itemIndex === index ? value : item));
  };

  const removeItem = (index) => {
    onChange(safeItems.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="offer-array-editor">
      <div className="offer-array-editor__header">
        <strong>{title}</strong>
        <button type="button" onClick={() => onChange([...safeItems, ""])} className="offer-array-editor__add">
          + {addLabel}
        </button>
      </div>

      {safeItems.length === 0 && (
        <p className="offer-array-editor__empty">No items added yet.</p>
      )}

      {safeItems.map((item, index) => (
        <div className="offer-array-editor__row" key={`${title}-${index}`}>
          <input
            className="field__input"
            value={typeof item === "string" ? item : item?.name || item?.title || item?.description || ""}
            onChange={(event) => updateItem(index, event.target.value)}
            placeholder={placeholder}
            aria-label={`${title} item ${index + 1}`}
          />
          <button type="button" onClick={() => removeItem(index)} aria-label={`Remove ${title} item ${index + 1}`}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default ArrayEditor;
