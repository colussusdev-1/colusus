/*
|--------------------------------------------------------------------------
| OPPORTUNITY MATCHER
|--------------------------------------------------------------------------
|
| This matcher ranks opportunities.
|
| It does NOT force a country.
|
| Healthcare does NOT mean Germany.
|
| Technology does NOT mean Canada.
|
| The entire opportunity pool is searched.
|--------------------------------------------------------------------------
*/

const normalize = (value) => {
  if (!value) return "";

  return String(value).toLowerCase().trim();
};

/*
|--------------------------------------------------------------------------
| KEYWORD MAP
|--------------------------------------------------------------------------
*/

const occupationKeywords = {
  technology: [
    "software",
    "developer",
    "technology",
    "tech",
    "it",
    "programming",
    "engineer",
  ],

  healthcare: [
    "healthcare",
    "health",
    "nurse",
    "nursing",
    "medical",
    "hospital",
  ],

  engineering: ["engineer", "engineering", "technical"],

  construction: [
    "construction",
    "mason",
    "carpenter",
    "welder",
    "plaster",
    "tile",
    "electrician",
    "concrete",
  ],

  hospitality: [
    "hospitality",
    "hotel",
    "kitchen",
    "cook",
    "housekeeper",
    "restaurant",
  ],

  agriculture: [
    "agriculture",
    "farm",
    "fruit",
    "vegetable",
    "harvest",
    "agricultural",
    "crop",
  ],

  logistics: [
    "warehouse",
    "logistics",
    "packer",
    "packing",
    "sorter",
    "loader",
    "factory",
  ],

  business: ["business", "finance", "financial", "management", "accounting"],

  education: ["education", "teacher", "teaching", "academic"],
};

/*
|--------------------------------------------------------------------------
| TEXT MATCH
|--------------------------------------------------------------------------
*/

const containsKeyword = (text, keywords = []) => {
  const normalizedText = normalize(text);

  return keywords.some((keyword) =>
    normalizedText.includes(normalize(keyword)),
  );
};

/*
|--------------------------------------------------------------------------
| GOAL
|--------------------------------------------------------------------------
*/

const getGoalScore = (goal, opportunity) => {
  if (!goal) {
    return 0;
  }

  const text = [
    opportunity.title,

    opportunity.category,

    opportunity.type,

    opportunity.description,
  ]
    .filter(Boolean)
    .map(normalize)
    .join(" ");

  if (goal === "explore") {
    return 15;
  }

  if (goal === "work") {
    return containsKeyword(text, [
      "work",
      "job",
      "employment",
      "worker",
      "skilled",
      "career",
    ])
      ? 30
      : 0;
  }

  if (goal === "study") {
    return containsKeyword(text, [
      "study",
      "student",
      "education",
      "university",
      "academic",
    ])
      ? 30
      : 0;
  }

  if (goal === "residency") {
    return containsKeyword(text, [
      "residency",
      "residence",
      "permanent",
      "settlement",
      "resident",
    ])
      ? 30
      : 0;
  }

  if (goal === "relocation") {
    return containsKeyword(text, [
      "relocation",
      "residency",
      "residence",
      "work",
      "employment",
      "migration",
    ])
      ? 25
      : 0;
  }

  return 0;
};

/*
|--------------------------------------------------------------------------
| OPPORTUNITY TYPE
|--------------------------------------------------------------------------
*/

const getTypeScore = (type, opportunity) => {
  if (!type || type === "any") {
    return 15;
  }

  const text = [
    opportunity.title,

    opportunity.category,

    opportunity.type,

    opportunity.description,
  ]
    .filter(Boolean)
    .map(normalize)
    .join(" ");

  if (type === "jobs") {
    return containsKeyword(text, [
      "job",
      "work",
      "worker",
      "employment",
      "skilled",
    ])
      ? 20
      : 0;
  }

  if (type === "study") {
    return containsKeyword(text, [
      "study",
      "student",
      "education",
      "university",
    ])
      ? 20
      : 0;
  }

  if (type === "residency") {
    return containsKeyword(text, [
      "residency",
      "residence",
      "resident",
      "settlement",
      "permanent",
    ])
      ? 20
      : 0;
  }

  return 0;
};

/*
|--------------------------------------------------------------------------
| OCCUPATION
|--------------------------------------------------------------------------
*/

const getOccupationScore = (occupation, opportunity) => {
  if (!occupation || occupation === "other") {
    return 5;
  }

  const keywords = occupationKeywords[occupation] || [];

  if (!keywords.length) {
    return 5;
  }

  const text =
    opportunity.searchable ||
    [
      opportunity.title,
      opportunity.description,
      opportunity.category,
      opportunity.type,
    ]
      .filter(Boolean)
      .join(" ");

  return containsKeyword(text, keywords) ? 35 : 0;
};

/*
|--------------------------------------------------------------------------
| AGE
|--------------------------------------------------------------------------
*/

const getAgeScore = (answer, eligibility, opportunity) => {
  if (!answer) {
    return 5;
  }

  const result = eligibility.find(
    (item) =>
      String(item.opportunityId) === String(opportunity.id) &&
      String(item.countryId) === String(opportunity.countryId),
  );

  if (!result) {
    return 5;
  }

  if (result.age?.applicable && !result.age?.matched) {
    return -15;
  }

  if (result.age?.applicable && result.age?.matched) {
    return 15;
  }

  return 10;
};

/*
|--------------------------------------------------------------------------
| EXPERIENCE
|--------------------------------------------------------------------------
*/

const getExperienceScore = (experience, opportunity) => {
  if (!experience) {
    return 0;
  }

  const text = opportunity.searchable || "";

  const professionalOpportunity = containsKeyword(text, [
    "work",
    "worker",
    "employment",
    "job",
    "experience",
    "professional",
  ]);

  if (!professionalOpportunity) {
    return 0;
  }

  if (experience === "5-10" || experience === "10+") {
    return 10;
  }

  if (experience === "3-5" || experience === "1-3") {
    return 7;
  }

  return 3;
};

/*
|--------------------------------------------------------------------------
| EDUCATION
|--------------------------------------------------------------------------
*/

const getEducationScore = (education, opportunity) => {
  if (!education) {
    return 0;
  }

  const text = opportunity.searchable || "";

  const professional = containsKeyword(text, [
    "software",
    "engineer",
    "nurse",
    "healthcare",
    "technology",
    "professional",
    "skilled",
  ]);

  if (
    professional &&
    ["bachelor", "master", "doctorate", "professional"].includes(education)
  ) {
    return 8;
  }

  if (education === "secondary" || education === "diploma") {
    return 4;
  }

  return 0;
};

/*
|--------------------------------------------------------------------------
| MAIN MATCHER
|--------------------------------------------------------------------------
*/

export const matchOpportunities = (
  answers = {},
  eligibility = [],
  opportunities = [],
) => {
  if (!Array.isArray(opportunities) || !opportunities.length) {
    return [];
  }

  const scored = opportunities.map((opportunity) => {
    let matchScore = 0;

    matchScore += getGoalScore(answers.goal, opportunity);

    matchScore += getTypeScore(answers.opportunityType, opportunity);

    matchScore += getOccupationScore(answers.occupation, opportunity);

    matchScore += getAgeScore(answers.ageRange, eligibility, opportunity);

    matchScore += getExperienceScore(answers.experience, opportunity);

    matchScore += getEducationScore(answers.education, opportunity);

    return {
      ...opportunity,

      matchScore,
    };
  });

  /*
  |--------------------------------------------------------------------------
  | SORT
  |--------------------------------------------------------------------------
  */

  scored.sort((a, b) => b.matchScore - a.matchScore);

  /*
  |--------------------------------------------------------------------------
  | REMOVE ONLY EXTREMELY WEAK RESULTS
  |--------------------------------------------------------------------------
  */

  const usable = scored.filter((opportunity) => opportunity.matchScore > 0);

  /*
  |--------------------------------------------------------------------------
  | ALWAYS RETURN SOMETHING
  |--------------------------------------------------------------------------
  |
  | If there are usable matches, show the best ones.
  |
  | Otherwise show the strongest available opportunities.
  |--------------------------------------------------------------------------
  */

  const finalResults = usable.length ? usable.slice(0, 8) : scored.slice(0, 6);

  return finalResults;
};

export default matchOpportunities;
