import { useCallback, useEffect, useMemo, useState } from "react";
import Field from "./Field";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const DOCUMENT_TYPES = [
  "PASSPORT",
  "IDENTIFICATION",
  "ACADEMIC_CERTIFICATE",
  "FINANCIAL_DOCUMENT",
  "EMPLOYMENT_DOCUMENT",
  "OTHER",
];

const DEFAULT_APPLICATION_CONFIG = {
  steps: ["DOCUMENTS", "REVIEW"],
  questions: [],
  requiredDocuments: [],
  workflow: [],
};

const createDocument = () => ({
  name: "",
  type: "OTHER",
  description: "",
  required: true,
});

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeConfig = (config = {}) => ({
  ...DEFAULT_APPLICATION_CONFIG,
  ...config,

  steps:
    Array.isArray(config.steps) && config.steps.length > 0
      ? config.steps
      : [...DEFAULT_APPLICATION_CONFIG.steps],

  questions: Array.isArray(config.questions)
    ? config.questions
    : [],

  requiredDocuments: Array.isArray(config.requiredDocuments)
    ? config.requiredDocuments.map((document) => {
      if (typeof document === "string") {
        return {
          name: document,
          type: "OTHER",
          description: "",
          required: true,
        };
      }

      return {
        name: document?.name || "",
        type: DOCUMENT_TYPES.includes(document?.type)
          ? document.type
          : "OTHER",
        description: document?.description || "",
        required: document?.required !== false,
      };
    })
    : [],

  workflow: Array.isArray(config.workflow)
    ? config.workflow
    : [],
});

const parseJsonArray = (value) => {
  const parsed = JSON.parse(value);

  if (!Array.isArray(parsed)) {
    throw new Error("The value must be a JSON array.");
  }

  return parsed;
};

const formatJson = (value) => JSON.stringify(value, null, 2);

/* -------------------------------------------------------------------------- */
/* APPLICATION CONFIGURATION SECTION                                         */
/* -------------------------------------------------------------------------- */

const ApplicationConfigSection = ({
  form,
  updateField,
  saving = false,
  onValidationChange,
}) => {
  const config = useMemo(
    () => normalizeConfig(form.applicationConfig),
    [form.applicationConfig]
  );

  /* ------------------------------------------------------------------------ */
  /* JSON EDITOR STATE                                                        */
  /* ------------------------------------------------------------------------ */

  const [questionsText, setQuestionsText] = useState(() =>
    formatJson(config.questions)
  );

  const [workflowText, setWorkflowText] = useState(() =>
    formatJson(config.workflow)
  );

  const [questionsError, setQuestionsError] = useState("");
  const [workflowError, setWorkflowError] = useState("");

  /*
   * Track editor drafts independently from the normalized form state.
   * This prevents valid keystrokes from repeatedly replacing the text
   * currently being edited.
   */
  const [questionsDraftDirty, setQuestionsDraftDirty] = useState(false);
  const [workflowDraftDirty, setWorkflowDraftDirty] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* KEEP EDITORS SYNCHRONIZED WITH LOADED CONFIGURATION                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (questionsDraftDirty) return;

    setQuestionsText(formatJson(config.questions));
    setQuestionsError("");
  }, [config.questions, questionsDraftDirty]);

  useEffect(() => {
    if (workflowDraftDirty) return;

    setWorkflowText(formatJson(config.workflow));
    setWorkflowError("");
  }, [config.workflow, workflowDraftDirty]);

  /* ------------------------------------------------------------------------ */
  /* VALIDATION                                                               */
  /* ------------------------------------------------------------------------ */

  const hasInvalidDocument = config.requiredDocuments.some(
    (document) => !String(document.name || "").trim()
  );

  const hasInvalidJson = Boolean(questionsError || workflowError);

  const validationErrors = useMemo(() => {
    const errors = [];

    if (questionsError) {
      errors.push(`Applicant questions: ${questionsError}`);
    }

    if (workflowError) {
      errors.push(`Application workflow: ${workflowError}`);
    }

    if (hasInvalidDocument) {
      errors.push(
        "Every required-document entry must have a name, or be removed."
      );
    }

    if (
      !Array.isArray(config.steps) ||
      config.steps.length === 0 ||
      config.steps.some((step) => !String(step).trim())
    ) {
      errors.push("Add at least one valid application step.");
    }

    return errors;
  }, [
    questionsError,
    workflowError,
    hasInvalidDocument,
    config.steps,
  ]);

  /*
   * Send current validation status to the parent.
   * The parent uses this to prevent submission when child editors
   * contain invalid data.
   */
  useEffect(() => {
    onValidationChange?.(validationErrors);
  }, [validationErrors, onValidationChange]);

  /* ------------------------------------------------------------------------ */
  /* CONFIGURATION UPDATES                                                    */
  /* ------------------------------------------------------------------------ */

  const updateConfig = useCallback(
    (key, value) => {
      updateField("applicationConfig", {
        ...normalizeConfig(form.applicationConfig),
        [key]: value,
      });
    },
    [form.applicationConfig, updateField]
  );

  /* ------------------------------------------------------------------------ */
  /* APPLICATION STEPS                                                       */
  /* ------------------------------------------------------------------------ */

  const updateSteps = (value) => {
    const steps = value
      .split("\n")
      .map((step) => step.trim())
      .filter(Boolean);

    updateConfig("steps", steps);
  };

  /* ------------------------------------------------------------------------ */
  /* REQUIRED DOCUMENTS                                                       */
  /* ------------------------------------------------------------------------ */

  const updateDocument = (index, key, value) => {
    const documents = config.requiredDocuments.map(
      (document, documentIndex) =>
        documentIndex === index
          ? {
            ...document,
            [key]: value,
          }
          : document
    );

    updateConfig("requiredDocuments", documents);
  };

  const addDocument = () => {
    updateConfig("requiredDocuments", [
      ...config.requiredDocuments,
      createDocument(),
    ]);
  };

  const removeDocument = (index) => {
    updateConfig(
      "requiredDocuments",
      config.requiredDocuments.filter(
        (_, documentIndex) => documentIndex !== index
      )
    );
  };

  /* ------------------------------------------------------------------------ */
  /* APPLICANT QUESTIONS JSON EDITOR                                          */
  /* ------------------------------------------------------------------------ */

  const updateQuestionsText = (value) => {
    setQuestionsText(value);
    setQuestionsDraftDirty(true);

    try {
      const questions = parseJsonArray(value);

      setQuestionsError("");
      updateConfig("questions", questions);
    } catch (error) {
      setQuestionsError(
        error instanceof SyntaxError
          ? "Invalid JSON. Correct the syntax before saving."
          : error.message
      );
    }
  };

  const finishQuestionsEditing = () => {
    if (questionsError) return;

    setQuestionsDraftDirty(false);
    setQuestionsText(
      formatJson(normalizeConfig(form.applicationConfig).questions)
    );
  };

  /* ------------------------------------------------------------------------ */
  /* WORKFLOW JSON EDITOR                                                     */
  /* ------------------------------------------------------------------------ */

  const updateWorkflowText = (value) => {
    setWorkflowText(value);
    setWorkflowDraftDirty(true);

    try {
      const workflow = parseJsonArray(value);

      setWorkflowError("");
      updateConfig("workflow", workflow);
    } catch (error) {
      setWorkflowError(
        error instanceof SyntaxError
          ? "Invalid JSON. Correct the syntax before saving."
          : error.message
      );
    }
  };

  const finishWorkflowEditing = () => {
    if (workflowError) return;

    setWorkflowDraftDirty(false);
    setWorkflowText(
      formatJson(normalizeConfig(form.applicationConfig).workflow)
    );
  };

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <section className="form-card">
      {/* HEADER */}

      <div className="form-card__header">
        <div className="form-card__number">
          <span>04</span>
        </div>

        <div className="form-card__heading">
          <div className="form-card__eyebrow">
            APPLICATION CONFIGURATION
          </div>

          <h2>
            Define what happens after an applicant starts
          </h2>

          <p>
            Configure application steps, required documents,
            applicant questions, and workflow stages. Changes
            apply to new applications; existing application
            snapshots are not automatically rewritten.
          </p>
        </div>
      </div>

      {/* BODY */}

      <div className="form-card__body">
        {/* APPLICATION STEPS */}

        <div className="application-config-block">
          <div className="application-config-block__heading">
            <h3>Application steps</h3>

            <p>
              Define the steps an applicant must complete.
              Enter one supported step identifier per line.
            </p>
          </div>

          <Field
            label="Application steps (one per line)"
            name="application-steps"
            value={config.steps.join("\n")}
            onChange={(_, value) => updateSteps(value)}
            disabled={saving}
            rows={4}
            help="For example: DOCUMENTS and REVIEW. Use identifiers supported by your backend."
          />
        </div>

        {/* REQUIRED DOCUMENTS */}

        <div className="offer-array-editor">
          <div className="offer-array-editor__header">
            <div>
              <strong>Required documents</strong>

              <p className="field__help">
                Specify the documents applicants must submit
                with their applications.
              </p>
            </div>

            <button
              type="button"
              className="offer-array-editor__add"
              onClick={addDocument}
              disabled={saving}
            >
              + Add document
            </button>
          </div>

          {config.requiredDocuments.length === 0 ? (
            <div className="offer-array-editor__empty">
              <p>No application documents configured.</p>

              <button
                type="button"
                className="offer-array-editor__add"
                onClick={addDocument}
                disabled={saving}
              >
                Add first document
              </button>
            </div>
          ) : (
            config.requiredDocuments.map((document, index) => (
              <article
                className="form-card application-document-card"
                key={`required-document-${index}`}
              >
                <div className="form-card__header">
                  <div className="form-card__heading">
                    <div className="form-card__eyebrow">
                      DOCUMENT {index + 1}
                    </div>

                    <h3>{document.name || "New document"}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    disabled={saving}
                  >
                    Remove
                  </button>
                </div>

                <div className="form-card__body">
                  <div className="form-grid">
                    <Field
                      label="Document name"
                      name={`doc-${index}-name`}
                      value={document.name}
                      onChange={(_, value) =>
                        updateDocument(index, "name", value)
                      }
                      disabled={saving}
                      required
                      placeholder="e.g. International passport"
                    />

                    <Field
                      label="Document type"
                      name={`doc-${index}-type`}
                      value={document.type}
                      onChange={(_, value) =>
                        updateDocument(index, "type", value)
                      }
                      disabled={saving}
                      options={DOCUMENT_TYPES.map((type) => ({
                        value: type,
                        label: type
                          .replaceAll("_", " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (letter) =>
                            letter.toUpperCase()
                          ),
                      }))}
                    />

                    <div className="form-grid__full">
                      <Field
                        label="Description"
                        name={`doc-${index}-description`}
                        value={document.description}
                        onChange={(_, value) =>
                          updateDocument(
                            index,
                            "description",
                            value
                          )
                        }
                        disabled={saving}
                        rows={3}
                        placeholder="Explain what the applicant should upload."
                      />
                    </div>

                    <div className="application-document-card__required">
                      <label>
                        <input
                          type="checkbox"
                          checked={document.required !== false}
                          onChange={(event) =>
                            updateDocument(
                              index,
                              "required",
                              event.target.checked
                            )
                          }
                          disabled={saving}
                        />

                        <span>Required document</span>
                      </label>

                      <small>
                        {document.required !== false
                          ? "Applicants must provide this document."
                          : "This document is optional."}
                      </small>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}

          {hasInvalidDocument && (
            <p
              className="application-config-error"
              role="alert"
            >
              Every document must have a name, or be removed before
              saving.
            </p>
          )}
        </div>

        {/* APPLICANT QUESTIONS */}

        <div className="application-config-block">
          <div className="application-config-block__heading">
            <h3>Applicant questions</h3>

            <p>
              Define the additional information applicants must
              provide. Enter a valid JSON array matching the
              structure consumed by your backend.
            </p>
          </div>

          <Field
            label="Application questions (JSON)"
            name="application-questions"
            value={questionsText}
            onChange={(_, value) => updateQuestionsText(value)}
            onBlur={finishQuestionsEditing}
            disabled={saving}
            rows={8}
            help='Example: [{"name":"experience","label":"Years of experience","type":"number","required":true}]'
          />

          {questionsError && (
            <p
              className="application-config-error"
              role="alert"
            >
              {questionsError}
            </p>
          )}
        </div>

        {/* WORKFLOW */}

        <div className="application-config-block">
          <div className="application-config-block__heading">
            <h3>Application workflow</h3>

            <p>
              Configure the workflow stages used to process
              applications. The object structure must match what
              your backend workflow engine expects.
            </p>
          </div>

          <Field
            label="Workflow stages (JSON)"
            name="application-workflow"
            value={workflowText}
            onChange={(_, value) => updateWorkflowText(value)}
            onBlur={finishWorkflowEditing}
            disabled={saving}
            rows={8}
            help="Enter a valid JSON array. Workflow stage fields depend on your backend implementation."
          />

          {workflowError && (
            <p
              className="application-config-error"
              role="alert"
            >
              {workflowError}
            </p>
          )}
        </div>

        {/* SUMMARY */}

        <div className="application-config-summary">
          <div>
            <span>Application steps</span>
            <strong>{config.steps.length}</strong>
          </div>

          <div>
            <span>Required documents</span>
            <strong>
              {
                config.requiredDocuments.filter(
                  (document) => document.required !== false
                ).length
              }
            </strong>
          </div>

          <div>
            <span>Questions</span>
            <strong>{config.questions.length}</strong>
          </div>

          <div>
            <span>Workflow stages</span>
            <strong>{config.workflow.length}</strong>
          </div>
        </div>

        {hasInvalidJson && (
          <p
            className="application-config-error"
            role="alert"
          >
            Fix the invalid JSON before saving this offer.
          </p>
        )}

        {validationErrors.length > 0 && (
          <div
            className="application-config-validation"
            role="status"
            aria-live="polite"
          >
            <strong>
              {validationErrors.length} configuration issue
              {validationErrors.length === 1 ? "" : "s"} detected
            </strong>

            <p>
              Resolve the highlighted issues before submitting
              the offer.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ApplicationConfigSection;