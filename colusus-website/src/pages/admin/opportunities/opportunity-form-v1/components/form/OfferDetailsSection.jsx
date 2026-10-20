import Field from "./Field";
import ArrayEditor from "./ArrayEditor";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeSalary = (salary) => {
  if (typeof salary === "string" || typeof salary === "number") {
    return salary;
  }

  if (salary && typeof salary === "object") {
    if (salary.display) {
      return salary.display;
    }

    if (salary.amount !== undefined) {
      const currency = salary.currency
        ? `${salary.currency} `
        : "";

      return `${currency}${salary.amount}`;
    }

    if (
      salary.min !== undefined ||
      salary.max !== undefined
    ) {
      const min =
        salary.min !== undefined
          ? salary.min
          : "—";

      const max =
        salary.max !== undefined
          ? salary.max
          : "—";

      return `${min} – ${max}`;
    }
  }

  return "";
};

const normalizeSteps = (steps) => {
  if (!Array.isArray(steps)) {
    return [];
  }

  return steps.map((step) => {
    if (typeof step === "string") {
      return {
        title: step,
        description: "",
        duration: "",
      };
    }

    return {
      title: step?.title || "",
      description: step?.description || "",
      duration: step?.duration || "",
    };
  });
};

/* -------------------------------------------------------------------------- */
/* JOURNEY STEPS EDITOR                                                       */
/* -------------------------------------------------------------------------- */

const JourneyStepsEditor = ({
  steps = [],
  onChange,
  disabled,
}) => {
  const normalizedSteps = normalizeSteps(steps);

  const updateStep = (index, field, value) => {
    const updatedSteps = normalizedSteps.map(
      (step, stepIndex) =>
        stepIndex === index
          ? {
            ...step,
            [field]: value,
          }
          : step
    );

    onChange(updatedSteps);
  };

  const addStep = () => {
    onChange([
      ...normalizedSteps,
      {
        title: "",
        description: "",
        duration: "",
      },
    ]);
  };

  const removeStep = (index) => {
    onChange(
      normalizedSteps.filter(
        (_, stepIndex) => stepIndex !== index
      )
    );
  };

  return (
    <div className="journey-steps-editor">
      <div className="journey-steps-editor__header">
        <div>
          <h3>Application journey steps</h3>

          <p>
            Explain the stages applicants will pass
            through, including descriptions and durations.
          </p>
        </div>

        <button
          type="button"
          className="journey-steps-editor__add"
          onClick={addStep}
          disabled={disabled}
        >
          + Add step
        </button>
      </div>

      {normalizedSteps.length === 0 ? (
        <div className="journey-steps-editor__empty">
          <p>No journey steps added yet.</p>

          <button
            type="button"
            onClick={addStep}
            disabled={disabled}
          >
            Add your first step
          </button>
        </div>
      ) : (
        <div className="journey-steps-editor__list">
          {normalizedSteps.map((step, index) => (
            <article
              className="journey-step-card"
              key={`journey-step-${index}`}
            >
              <div className="journey-step-card__header">
                <strong>
                  Step {index + 1}
                </strong>

                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  disabled={disabled}
                  aria-label={`Remove step ${index + 1}`}
                >
                  Remove
                </button>
              </div>

              <div className="form-grid">
                <div className="form-grid__full">
                  <Field
                    label="Step title"
                    name={`step-title-${index}`}
                    value={step.title}
                    required
                    disabled={disabled}
                    placeholder="e.g. Document verification"
                    onChange={(_, value) =>
                      updateStep(
                        index,
                        "title",
                        value
                      )
                    }
                  />
                </div>

                <div className="form-grid__full">
                  <Field
                    label="Description"
                    name={`step-description-${index}`}
                    value={step.description}
                    disabled={disabled}
                    rows={3}
                    placeholder="Explain what happens during this stage."
                    onChange={(_, value) =>
                      updateStep(
                        index,
                        "description",
                        value
                      )
                    }
                  />
                </div>

                <div className="form-grid__full">
                  <Field
                    label="Expected duration"
                    name={`step-duration-${index}`}
                    value={step.duration}
                    disabled={disabled}
                    placeholder="e.g. 2–4 weeks"
                    onChange={(_, value) =>
                      updateStep(
                        index,
                        "duration",
                        value
                      )
                    }
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* OFFER DETAILS SECTION                                                      */
/* -------------------------------------------------------------------------- */

const OfferDetailsSection = ({
  form,
  updateField,
  saving,
}) => {
  return (
    <section className="form-card">
      {/* HEADER */}
      <div className="form-card__header">
        <div className="form-card__number">
          <span>02</span>
        </div>

        <div className="form-card__heading">
          <div className="form-card__eyebrow">
            OFFER DETAILS
          </div>

          <h2>Define the opportunity</h2>

          <p>
            Describe the offer applicants will see
            in the public catalogue.
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="form-card__body">
        <div className="form-grid">
          <div className="form-grid__full">
            <Field
              label="Offer title"
              name="title"
              value={form.title}
              onChange={updateField}
              required
              disabled={saving}
              placeholder="e.g. Germany Nursing Placement"
            />
          </div>

          <Field
            label="URL slug"
            name="slug"
            value={form.slug}
            onChange={updateField}
            required
            disabled={saving}
            help="Must be unique within the selected destination."
            placeholder="germany-nursing-placement"
          />

          <Field
            label="Category"
            name="category"
            value={form.category}
            onChange={updateField}
            required
            disabled={saving}
            placeholder="Nursing, Caregiving, Study..."
          />

          <Field
            label="Opportunity type"
            name="type"
            value={form.type}
            onChange={updateField}
            required
            disabled={saving}
            placeholder="Employment, Study, Visa assistance..."
          />

          <Field
            label="Location"
            name="location"
            value={form.location}
            onChange={updateField}
            disabled={saving}
            placeholder="e.g. Berlin, Germany"
          />

          <Field
            label="Duration"
            name="duration"
            value={form.duration}
            onChange={updateField}
            disabled={saving}
            placeholder="e.g. 6–12 months"
          />

          <Field
            label="Salary / compensation"
            name="salary"
            value={normalizeSalary(form.salary)}
            onChange={updateField}
            disabled={saving}
            placeholder="e.g. €35,000–€45,000 per year"
          />

          <Field
            label="Demand"
            name="demand"
            value={form.demand}
            onChange={updateField}
            disabled={saving}
            placeholder="e.g. High demand"
          />

          <Field
            label="Contract"
            name="contract"
            value={form.contract}
            onChange={updateField}
            disabled={saving}
            placeholder="e.g. Full-time, 2-year contract"
          />

          <Field
            label="Icon"
            name="icon"
            value={form.icon}
            onChange={updateField}
            disabled={saving}
            placeholder="e.g. Briefcase"
          />

          <div className="form-grid__full">
            <Field
              label="Description"
              name="description"
              value={form.description}
              onChange={updateField}
              required
              disabled={saving}
              rows={7}
              placeholder="Explain what the offer includes, who it is for and what applicants should expect."
            />
          </div>

          <div className="form-grid__full">
            <Field
              label="Offer image URL"
              name="image"
              value={
                typeof form.image === "string"
                  ? form.image
                  : form.image?.url || ""
              }
              onChange={updateField}
              disabled={saving}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* HIGHLIGHTS, REQUIREMENTS AND BENEFITS */}
        <div className="form-grid">
          <ArrayEditor
            title="Highlights"
            items={form.highlights}
            onChange={(items) =>
              updateField("highlights", items)
            }
            placeholder="Offer highlight"
          />

          <ArrayEditor
            title="Requirements"
            items={form.requirements}
            onChange={(items) =>
              updateField("requirements", items)
            }
            placeholder="Eligibility or requirement"
          />

          <ArrayEditor
            title="Benefits"
            items={form.benefits}
            onChange={(items) =>
              updateField("benefits", items)
            }
            placeholder="Included benefit"
          />

          <ArrayEditor
            title="Terms"
            items={form.terms}
            onChange={(items) =>
              updateField("terms", items)
            }
            placeholder="Offer term or condition"
          />
        </div>

        {/* JOURNEY STEPS */}
        <JourneyStepsEditor
          steps={form.steps}
          disabled={saving}
          onChange={(steps) =>
            updateField("steps", steps)
          }
        />
      </div>
    </section>
  );
};

export default OfferDetailsSection;