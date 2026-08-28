/*
|--------------------------------------------------------------------------
| ELIGIBILITY ENGINE
|--------------------------------------------------------------------------
|
| Eligibility is intentionally soft.
|
| The current dataset contains free-form requirement text rather than a
| structured eligibility schema for every opportunity.
|
| Therefore:
|
| MATCH = stronger recommendation
|
| POSSIBLE = still worth exploring
|
| We do not aggressively reject opportunities.
|--------------------------------------------------------------------------
*/

const normalize = (value) => {
  if (!value) return "";

  return String(value).toLowerCase().trim();
};

const getAgeRange = (value) => {
  const ranges = {
    "18-24": [18, 24],

    "25-34": [25, 34],

    "35-44": [35, 44],

    "45-54": [45, 54],

    "55+": [55, 100],
  };

  return ranges[value] || null;
};

const extractAgeNumbers = (requirements = []) => {
  const text = requirements.map(normalize).join(" ");

  const numbers = text.match(/\d+/g);

  if (!numbers) {
    return [];
  }

  return numbers.map(Number);
};

const evaluateAge = (ageRange, opportunity) => {
  if (!ageRange) {
    return {
      applicable: false,

      matched: false,
    };
  }

  const requirements = Array.isArray(opportunity.requirements)
    ? opportunity.requirements
    : [];

  const text = requirements.map(normalize).join(" ");

  const hasAgeRequirement =
    text.includes("age") ||
    text.includes("years old") ||
    text.includes("maximum age") ||
    text.includes("minimum age");

  if (!hasAgeRequirement) {
    return {
      applicable: false,

      matched: true,
    };
  }

  const numbers = extractAgeNumbers(requirements);

  if (!numbers.length) {
    return {
      applicable: false,

      matched: true,
    };
  }

  const applicantRange = getAgeRange(ageRange);

  if (!applicantRange) {
    return {
      applicable: false,

      matched: true,
    };
  }

  const minRequirement = Math.min(...numbers);

  const maxRequirement = Math.max(...numbers);

  const overlaps =
    applicantRange[1] >= minRequirement && applicantRange[0] <= maxRequirement;

  return {
    applicable: true,

    matched: overlaps,
  };
};

export const evaluateEligibility = (answers = {}, opportunities = []) => {
  return opportunities.map((opportunity) => {
    const ageResult = evaluateAge(answers.ageRange, opportunity);

    return {
      opportunityId: opportunity.id,

      countryId: opportunity.countryId,

      age: ageResult,

      eligible: !ageResult.applicable || ageResult.matched,
    };
  });
};

export default evaluateEligibility;
