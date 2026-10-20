import Field from "./Field";

/* -------------------------------------------------------------------------- */
/* DESTINATION SECTION                                                        */
/* -------------------------------------------------------------------------- */

const DestinationSection = ({
  form,
  destinations = [],
  onDestinationChange,
  disabled = false,
}) => {
  const selectedDestination = destinations.find(
    (destination) =>
      destination.countrySlug === form.countrySlug
  );

  return (
    <section className="form-card form-card--destination">
      {/* HEADER */}
      <div className="form-card__header">
        <div className="form-card__number">
          <span>01</span>
        </div>

        <div className="form-card__heading">
          <div className="form-card__eyebrow">
            DESTINATION
          </div>

          <h2>Where does this offer belong?</h2>

          <p>
            Select the destination associated with this
            migration offer. Shared country information
            is managed separately.
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="form-card__body">
        <Field
          label="Destination"
          name="countrySlug"
          value={form.countrySlug || ""}
          required
          disabled={disabled}
          onChange={(_, countrySlug) =>
            onDestinationChange(countrySlug)
          }
          options={destinations.map((destination) => ({
            value: destination.countrySlug,
            label: [
              destination.countryFlag,
              destination.countryName,
              `(${destination.countrySlug})`,
            ]
              .filter(Boolean)
              .join(" "),
          }))}
        />

        {/* DESTINATION IDENTITY */}
        <div className="form-grid">
          <Field
            label="Country name"
            name="countryName"
            value={form.countryName || ""}
            onChange={() => { }}
            disabled
          />

          <Field
            label="Country ID"
            name="countryId"
            value={form.countryId ?? ""}
            onChange={() => { }}
            disabled
          />

          <Field
            label="Country flag"
            name="countryFlag"
            value={form.countryFlag || ""}
            onChange={() => { }}
            disabled
          />

          <Field
            label="Country slug"
            name="countrySlugDisplay"
            value={form.countrySlug || ""}
            onChange={() => { }}
            disabled
          />
        </div>

        {/* DESTINATION PREVIEW */}
        {selectedDestination && (
          <div className="destination-preview">
            {selectedDestination.countryImage && (
              <img
                className="destination-preview__image"
                src={selectedDestination.countryImage}
                alt={selectedDestination.countryName}
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            )}

            <div className="destination-preview__content">
              <span className="destination-preview__eyebrow">
                SELECTED DESTINATION
              </span>

              <strong>
                {selectedDestination.countryFlag}{" "}
                {selectedDestination.countryName}
              </strong>

              <span>
                /{selectedDestination.countrySlug}
              </span>
            </div>
          </div>
        )}

        <p className="field__help">
          Destination identity is copied from the selected
          destination record. To change shared country
          information, use Destination Management.
        </p>
      </div>
    </section>
  );
};

export default DestinationSection;