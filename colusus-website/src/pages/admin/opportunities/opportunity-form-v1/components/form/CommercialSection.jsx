import Field from "./Field";

/* -------------------------------------------------------------------------- */
/* DEFAULT VALUES                                                             */
/* -------------------------------------------------------------------------- */

const DEFAULT_PRICING = {
  amount: "",
  currency: "NGN",
  label: "",
  description: "",
};

const createPaymentStage = () => ({
  title: "",
  description: "",
  amount: "",
  percentage: "",
});

/* -------------------------------------------------------------------------- */
/* COMMERCIAL SECTION                                                         */
/* -------------------------------------------------------------------------- */

const CommercialSection = ({
  form,
  updateField,
  saving = false,
}) => {
  const pricing = {
    ...DEFAULT_PRICING,
    ...(form.pricing || {}),
  };

  const paymentPlan = Array.isArray(form.paymentPlan)
    ? form.paymentPlan
    : [];

  /* ---------------------------------------------------------------------- */
  /* PRICING                                                                */
  /* ---------------------------------------------------------------------- */

  const updatePricing = (key, value) => {
    const nextValue =
      key === "amount" && value !== ""
        ? Number(value)
        : value;

    updateField("pricing", {
      ...pricing,
      [key]: nextValue,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* PAYMENT PLAN                                                           */
  /* ---------------------------------------------------------------------- */

  const updatePaymentStage = (index, key, value) => {
    const stages = paymentPlan.map((stage, stageIndex) => {
      if (stageIndex !== index) {
        return stage;
      }

      let nextValue = value;

      if (
        (key === "percentage" || key === "amount") &&
        value !== ""
      ) {
        nextValue = Number(value);
      }

      return {
        ...stage,
        [key]: nextValue,
      };
    });

    updateField("paymentPlan", stages);
  };

  const addPaymentStage = () => {
    updateField("paymentPlan", [
      ...paymentPlan,
      createPaymentStage(),
    ]);
  };

  const removePaymentStage = (index) => {
    updateField(
      "paymentPlan",
      paymentPlan.filter(
        (_, stageIndex) => stageIndex !== index
      )
    );
  };

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <section className="form-card">
      {/* HEADER */}
      <div className="form-card__header">
        <div className="form-card__number">
          <span>03</span>
        </div>

        <div className="form-card__heading">
          <div className="form-card__eyebrow">
            PRICING & PAYMENT
          </div>

          <h2>Configure the commercial terms</h2>

          <p>
            Configure the advertised price and proposed
            payment stages. Actual charges must be created
            through the Finance workflow.
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="form-card__body">
        {/* PRICING */}
        <div className="form-grid">
          <Field
            label="Pricing label"
            name="pricing-label"
            value={pricing.label}
            onChange={(_, value) =>
              updatePricing("label", value)
            }
            disabled={saving}
            placeholder="e.g. Package fee"
          />

          <Field
            label="Amount"
            name="pricing-amount"
            type="number"
            value={pricing.amount ?? ""}
            onChange={(_, value) =>
              updatePricing("amount", value)
            }
            disabled={saving}
            placeholder="e.g. 500000"
            help="Enter the advertised amount."
          />

          <Field
            label="Currency"
            name="pricing-currency"
            value={pricing.currency}
            onChange={(_, value) =>
              updatePricing(
                "currency",
                value.toUpperCase()
              )
            }
            disabled={saving}
            placeholder="NGN"
          />

          <div className="form-grid__full">
            <Field
              label="Pricing description"
              name="pricing-description"
              value={pricing.description}
              onChange={(_, value) =>
                updatePricing(
                  "description",
                  value
                )
              }
              disabled={saving}
              rows={3}
              placeholder="Explain what the advertised price covers."
            />
          </div>
        </div>

        {/* PAYMENT PLAN */}
        <div className="offer-array-editor">
          <div className="offer-array-editor__header">
            <div>
              <strong>Payment plan stages</strong>

              <p className="field__help">
                Define proposed instalments or milestones
                for this offer.
              </p>
            </div>

            <button
              type="button"
              className="offer-array-editor__add"
              onClick={addPaymentStage}
              disabled={saving}
            >
              + Add stage
            </button>
          </div>

          {paymentPlan.length === 0 ? (
            <div className="offer-array-editor__empty">
              <p>
                No payment stages configured.
              </p>

              <button
                type="button"
                className="offer-array-editor__add"
                onClick={addPaymentStage}
                disabled={saving}
              >
                Add first stage
              </button>
            </div>
          ) : (
            paymentPlan.map((stage, index) => (
              <article
                className="form-card payment-stage-card"
                key={`payment-stage-${index}`}
              >
                <div className="form-card__header">
                  <div className="form-card__heading">
                    <div className="form-card__eyebrow">
                      PAYMENT STAGE {index + 1}
                    </div>

                    <h3>
                      {stage.title ||
                        `Stage ${index + 1}`}
                    </h3>
                  </div>

                  <button
                    type="button"
                    className="payment-stage-card__remove"
                    onClick={() =>
                      removePaymentStage(index)
                    }
                    disabled={saving}
                  >
                    Remove stage
                  </button>
                </div>

                <div className="form-card__body">
                  <div className="form-grid">
                    <Field
                      label="Stage title"
                      name={`payment-stage-${index}-title`}
                      value={stage.title || ""}
                      onChange={(_, value) =>
                        updatePaymentStage(
                          index,
                          "title",
                          value
                        )
                      }
                      disabled={saving}
                      placeholder="e.g. Initial deposit"
                    />

                    <Field
                      label="Amount"
                      name={`payment-stage-${index}-amount`}
                      type="number"
                      value={stage.amount ?? ""}
                      onChange={(_, value) =>
                        updatePaymentStage(
                          index,
                          "amount",
                          value
                        )
                      }
                      disabled={saving}
                      placeholder="e.g. 150000"
                    />

                    <Field
                      label="Percentage"
                      name={`payment-stage-${index}-percentage`}
                      type="number"
                      value={stage.percentage ?? ""}
                      onChange={(_, value) =>
                        updatePaymentStage(
                          index,
                          "percentage",
                          value
                        )
                      }
                      disabled={saving}
                      placeholder="e.g. 30"
                      help="Optional percentage of the total price."
                    />

                    <div className="form-grid__full">
                      <Field
                        label="Description"
                        name={`payment-stage-${index}-description`}
                        value={
                          stage.description || ""
                        }
                        onChange={(_, value) =>
                          updatePaymentStage(
                            index,
                            "description",
                            value
                          )
                        }
                        disabled={saving}
                        rows={3}
                        placeholder="Explain when this payment is expected."
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CommercialSection;