import questionDefinitions from "../data/questionDefinitions";

/*
|--------------------------------------------------------------------------
| QUESTION RESOLVER
|--------------------------------------------------------------------------
|
| The resolver determines what question comes next.
|
| Questions are applicant-driven, not country-driven.
|--------------------------------------------------------------------------
*/

const shouldAskQuestion = (question, answers) => {
  /*
    Future conditional questions can be added here.

    For example:

    if (
      question.id === "education" &&
      answers.goal === "work"
    ) {
      return true;
    }

    For now all core profile questions remain relevant.
  */

  return true;
};

/*
|--------------------------------------------------------------------------
| RESOLVE NEXT QUESTION
|--------------------------------------------------------------------------
*/

export const resolveNextQuestion = (answers = {}, opportunities = []) => {
  for (const question of questionDefinitions) {
    const answered =
      answers[question.id] !== undefined &&
      answers[question.id] !== null &&
      answers[question.id] !== "";

    if (answered) {
      continue;
    }

    if (!shouldAskQuestion(question, answers)) {
      continue;
    }

    return question;
  }

  return null;
};

export default resolveNextQuestion;
