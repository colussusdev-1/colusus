import { getOpportunityPool } from "./opportunityPool";

import { resolveNextQuestion } from "./questionResolver";

import { evaluateEligibility } from "./eligibility";

import { matchOpportunities } from "./matcher";

/*
|--------------------------------------------------------------------------
| CREATE ASSESSMENT
|--------------------------------------------------------------------------
*/

export const createAssessment = () => {
  const opportunities = getOpportunityPool();

  const state = {
    answers: {},

    currentQuestion: null,

    completed: false,

    results: [],
  };

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const getState = () => {
    return {
      answers: {
        ...state.answers,
      },

      currentQuestion: state.currentQuestion,

      completed: state.completed,

      results: [...state.results],
    };
  };

  /*
  |--------------------------------------------------------------------------
  | START
  |--------------------------------------------------------------------------
  */

  const start = () => {
    state.answers = {};

    state.completed = false;

    state.results = [];

    state.currentQuestion = resolveNextQuestion(state.answers, opportunities);

    return getState();
  };

  /*
  |--------------------------------------------------------------------------
  | ANSWER
  |--------------------------------------------------------------------------
  */

  const answer = (questionId, value) => {
    if (!questionId) {
      return getState();
    }

    state.answers = {
      ...state.answers,

      [questionId]: value,
    };

    const nextQuestion = resolveNextQuestion(state.answers, opportunities);

    /*
    |--------------------------------------------------------------------------
    | COMPLETE
    |--------------------------------------------------------------------------
    */

    if (!nextQuestion) {
      state.completed = true;

      state.currentQuestion = null;

      const eligibility = evaluateEligibility(state.answers, opportunities);

      state.results = matchOpportunities(
        state.answers,
        eligibility,
        opportunities,
      );

      return getState();
    }

    /*
    |--------------------------------------------------------------------------
    | NEXT QUESTION
    |--------------------------------------------------------------------------
    */

    state.currentQuestion = nextQuestion;

    return getState();
  };

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const reset = () => {
    return start();
  };

  /*
  |--------------------------------------------------------------------------
  | GET RESULTS
  |--------------------------------------------------------------------------
  */

  const getResults = () => {
    return [...state.results];
  };

  return {
    start,

    answer,

    reset,

    getState,

    getResults,
  };
};

/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

export default {
  createAssessment,
};
