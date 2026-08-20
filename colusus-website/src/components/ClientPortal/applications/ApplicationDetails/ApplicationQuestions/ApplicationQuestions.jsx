import {
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";

import "./ApplicationQuestions.css";


/* =========================================================
   HELPERS
========================================================= */

const getQuestions = (application) => {
  return (
    application
      ?.opportunity
      ?.applicationConfig
      ?.questions ||
    []
  );
};


const getQuestionId = (
  question,
  index
) => {
  return (
    question?.id ||
    question?._id ||
    question?.key ||
    `question-${index}`
  );
};


const getQuestionLabel = (
  question
) => {
  if (typeof question === "string") {
    return question;
  }

  return (
    question?.question ||
    question?.label ||
    question?.title ||
    question?.text ||
    "Application question"
  );
};


const getQuestionType = (
  question
) => {
  if (typeof question === "string") {
    return "TEXT";
  }

  return (
    question?.type ||
    question?.inputType ||
    "TEXT"
  )
    .toString()
    .toUpperCase();
};


const getQuestionRequired = (
  question
) => {
  if (
    typeof question !== "object" ||
    !question
  ) {
    return false;
  }

  return Boolean(
    question.required ||
    question.isRequired
  );
};


const getQuestionOptions = (
  question
) => {
  if (
    typeof question !== "object" ||
    !question
  ) {
    return [];
  }

  return (
    question.options ||
    question.choices ||
    []
  );
};


const getQuestionAnswer = (
  application,
  question
) => {
  const answers =
    application?.answers ||
    application?.questionAnswers ||
    application?.responses ||
    {};

  const id =
    question?.id ||
    question?._id ||
    question?.key;

  if (!id) {
    return null;
  }

  if (Array.isArray(answers)) {
    const answer = answers.find(
      (item) =>
        item?.questionId === id ||
        item?.question === id ||
        item?.key === id
    );

    return (
      answer?.answer ??
      answer?.value ??
      null
    );
  }

  return answers[id] ?? null;
};


/* =========================================================
   COMPONENT
========================================================= */

const ApplicationQuestions = ({
  application,
}) => {

  const questions =
    getQuestions(application);


  /*
   * No questions configured.
   */

  if (!questions.length) {
    return (
      <section className="application-questions">

        <div className="application-questions-header">

          <div>

            <span>
              APPLICATION QUESTIONS
            </span>

            <h2>
              Your application responses
            </h2>

          </div>

        </div>


        <div className="application-questions-empty">

          <div className="application-questions-empty-icon">
            <HiOutlineQuestionMarkCircle />
          </div>

          <div>

            <strong>
              No additional questions
            </strong>

            <p>
              This opportunity does not require
              any additional application questions.
            </p>

          </div>

        </div>

      </section>
    );
  }


  const answeredCount =
    questions.filter(
      (question) => {

        const answer =
          getQuestionAnswer(
            application,
            question
          );

        return (
          answer !== null &&
          answer !== undefined &&
          answer !== ""
        );
      }
    ).length;


  return (
    <section className="application-questions">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="application-questions-header">

        <div>

          <span>
            APPLICATION QUESTIONS
          </span>

          <h2>
            Your application responses
          </h2>

          <p>
            Review the information submitted
            for this application.
          </p>

        </div>


        <div className="application-questions-summary">

          <strong>
            {answeredCount}
            <span>
              / {questions.length}
            </span>
          </strong>

          <small>
            answered
          </small>

        </div>

      </div>


      {/* =====================================================
          QUESTION LIST
      ===================================================== */}

      <div className="application-questions-list">

        {questions.map(
          (question, index) => {

            const id =
              getQuestionId(
                question,
                index
              );

            const label =
              getQuestionLabel(
                question
              );

            const type =
              getQuestionType(
                question
              );

            const required =
              getQuestionRequired(
                question
              );

            const options =
              getQuestionOptions(
                question
              );

            const answer =
              getQuestionAnswer(
                application,
                question
              );


            return (
              <div
                key={id}
                className="application-question"
              >

                {/* =================================================
                    QUESTION HEADER
                ================================================= */}

                <div className="application-question-header">

                  <div className="application-question-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>


                  <div className="application-question-title">

                    <span>
                      QUESTION {index + 1}
                    </span>

                    <h3>
                      {label}
                    </h3>

                  </div>


                  {required && (
                    <span className="application-question-required">
                      Required
                    </span>
                  )}

                </div>


                {/* =================================================
                    RESPONSE
                ================================================= */}

                <div className="application-question-response">

                  <span className="application-question-response-label">
                    YOUR RESPONSE
                  </span>


                  {answer !== null &&
                    answer !== undefined &&
                    answer !== "" ? (

                    <div className="application-question-answer">

                      <HiOutlineCheckCircle />

                      <span>
                        {Array.isArray(answer)
                          ? answer.join(", ")
                          : String(answer)}
                      </span>

                    </div>

                  ) : (

                    <div className="application-question-unanswered">

                      <HiOutlineInformationCircle />

                      <span>
                        No response provided
                      </span>

                    </div>

                  )}

                </div>


                {/* =================================================
                    OPTIONS / TYPE
                ================================================= */}

                {options.length > 0 && (
                  <div className="application-question-options">

                    <span>
                      RESPONSE TYPE
                    </span>

                    <strong>
                      {type.replace(
                        /_/g,
                        " "
                      )}
                    </strong>

                  </div>
                )}

              </div>
            );
          }
        )}

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="application-questions-footer">

        <HiOutlineInformationCircle />

        <span>
          These responses are part of your
          submitted application and may be
          reviewed by the Colusus team.
        </span>

      </div>

    </section>
  );
};


export default ApplicationQuestions;