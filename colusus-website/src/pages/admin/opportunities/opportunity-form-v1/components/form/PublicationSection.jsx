import React from "react";

const PublicationSection = ({ form, updateField, saving }) => {
  const isPublished = Boolean(form.active);
  const isFeatured = Boolean(form.featured);

  return (
    <section className="form-card">
      <div className="form-card__header">
        <div className="form-card__number">
          <span>05</span>
        </div>

        <div className="form-card__heading">
          <div className="form-card__eyebrow">PUBLICATION</div>

          <h2>Control catalogue visibility</h2>

          <p>
            Manage whether this offer is publicly available and whether it
            receives featured placement.
          </p>
        </div>
      </div>

      <div className="form-card__body">
        {/* Publication status */}
        <label
          className={`visibility-option ${isPublished ? "visibility-option--active" : ""
            }`}
        >
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(event) =>
              updateField("active", event.target.checked)
            }
            disabled={saving}
            aria-label="Publish offer"
          />

          <span className="visibility-option__content">
            <strong>Published</strong>

            <small>
              {isPublished
                ? "This offer is active and available for the public catalogue."
                : "This offer is hidden from the public catalogue."}
            </small>
          </span>

          <span
            className={`visibility-option__badge ${isPublished
                ? "visibility-option__badge--published"
                : "visibility-option__badge--hidden"
              }`}
          >
            {isPublished ? "Published" : "Hidden"}
          </span>
        </label>

        {/* Featured status */}
        <label
          className={`visibility-option ${isFeatured ? "visibility-option--active" : ""
            }`}
        >
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) =>
              updateField("featured", event.target.checked)
            }
            disabled={saving}
            aria-label="Feature offer"
          />

          <span className="visibility-option__content">
            <strong>Featured offer</strong>

            <small>
              {isFeatured
                ? "This offer is marked for featured catalogue placements."
                : "This offer can remain published without featured placement."}
            </small>
          </span>

          <span
            className={`visibility-option__badge ${isFeatured
                ? "visibility-option__badge--featured"
                : ""
              }`}
          >
            {isFeatured ? "Featured" : "Standard"}
          </span>
        </label>

        {/* Publication summary */}
        <div className="publication-summary">
          <strong>Publication summary</strong>

          <p>
            {isPublished
              ? "Applicants can discover this offer in the public catalogue."
              : "Applicants cannot discover this offer in the public catalogue while it is inactive."}
          </p>

          {isFeatured && !isPublished && (
            <p className="publication-summary__warning">
              This offer is featured but unpublished. It may not appear in
              public featured placements until it is activated.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PublicationSection;