import { loadOpportunityPool, getOpportunityPool } from "./opportunityPool";

import { resolveNextQuestion } from "./questionResolver";
import { evaluateEligibility } from "./eligibility";
import { matchOpportunities } from "./matcher";

/* -------------------------------------------------------------------------- */
/* CREATE ASSESSMENT                                                          */
/* -------------------------------------------------------------------------- */

export const createAssessment = () => {
  let opportunities = getOpportunityPool();

  const state = {
    answers: {},
    currentQuestion: null,
    completed: false,
    results: [],
    loading: false,
    error: null,
  };

  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

  const getState = () => ({
    answers: {
      ...state.answers,
    },
    currentQuestion: state.currentQuestion,
    completed: state.completed,
    results: [...state.results],
    loading: state.loading,
    error: state.error,
  });

  /* ------------------------------------------------------------------------ */
  /* START                                                                    */
  /* ------------------------------------------------------------------------ */

  const start = async () => {
    state.answers = {};
    state.currentQuestion = null;
    state.completed = false;
    state.results = [];
    state.loading = true;
    state.error = null;

    try {
      /*
       * Load the current opportunities from the public API.
       */
      opportunities = await loadOpportunityPool();

      if (!Array.isArray(opportunities) || opportunities.length === 0) {
        throw new Error(
          "No opportunities are currently available. Please try again later.",
        );
      }

      /*
       * Initialize the first assessment question.
       */
      state.currentQuestion = resolveNextQuestion(state.answers, opportunities);

      if (!state.currentQuestion) {
        throw new Error("The assessment questions could not be initialized.");
      }

      /*
       * IMPORTANT:
       * Set loading to false BEFORE returning the state.
       * Otherwise, getState() captures loading: true, and the UI
       * may remain stuck on the loading screen.
       */
      state.loading = false;

      return getState();
    } catch (error) {
      state.error =
        error?.message ||
        "Unable to load current opportunities. Please try again.";

      state.currentQuestion = null;

      throw error;
    } finally {
      /*
       * Keep the internal state consistent on success or failure.
       */
      state.loading = false;
    }
  };

  /* ------------------------------------------------------------------------ */
  /* ANSWER                                                                   */
  /* ------------------------------------------------------------------------ */

  const answer = (questionId, value) => {
    if (
      !questionId ||
      state.loading ||
      state.completed ||
      !opportunities.length
    ) {
      return getState();
    }

    state.answers = {
      ...state.answers,
      [questionId]: value,
    };

    const nextQuestion = resolveNextQuestion(state.answers, opportunities);

    /* ---------------------------------------------------------------------- */
    /* COMPLETE                                                               */
    /* ---------------------------------------------------------------------- */

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

    /* ---------------------------------------------------------------------- */
    /* NEXT QUESTION                                                          */
    /* ---------------------------------------------------------------------- */

    state.currentQuestion = nextQuestion;

    return getState();
  };

  /* ------------------------------------------------------------------------ */
  /* RESET                                                                    */
  /* ------------------------------------------------------------------------ */

  const reset = async () => {
    return start();
  };

  /* ------------------------------------------------------------------------ */
  /* GET RESULTS                                                              */
  /* ------------------------------------------------------------------------ */

  const getResults = () => {
    return [...state.results];
  };

  /* ------------------------------------------------------------------------ */
  /* PUBLIC API                                                               */
  /* ------------------------------------------------------------------------ */

  return {
    start,
    answer,
    reset,
    getState,
    getResults,
  };
};

/* -------------------------------------------------------------------------- */
/* DEFAULT EXPORT                                                             */
/* -------------------------------------------------------------------------- */

export default {
  createAssessment,
};
