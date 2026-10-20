const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  rows,
  help,
  options,
}) => {
  const common = {
    id: name,
    name,
    value: value ?? "",
    disabled,
    required,
    onChange: (event) => onChange(name, event.target.value),
    className: "field__input",
  };

  return (
    <div className="field">
      <div className="field__top">
        <label className="field__label" htmlFor={name}>{label}</label>
        {required && <span className="field__required">Required</span>}
      </div>

      {options ? (
        <div className="select-wrapper">
          <select {...common}>
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option) => {
              const optionValue = typeof option === "string" ? option : option.value;
              const optionLabel = typeof option === "string" ? option : option.label;
              return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
            })}
          </select>
        </div>
      ) : rows ? (
        <textarea {...common} rows={rows} placeholder={placeholder} />
      ) : (
        <input {...common} type={type} placeholder={placeholder} />
      )}

      {help && <small className="field__help">{help}</small>}
    </div>
  );
};

export default Field;
