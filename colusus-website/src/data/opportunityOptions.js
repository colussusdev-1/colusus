const makeOptions = (values) =>
  values.map((value) => ({
    value,
    label: value,
  }));

export const OPPORTUNITY_CATEGORY_OPTIONS = makeOptions([
  "Work",
  "Skilled Migration",
  "Healthcare",
  "Nursing",
  "Caregiving",
  "Education",
  "Study",
  "Family Migration",
  "Business",
  "Investment",
  "Permanent Residence",
  "Technology",
  "Engineering",
  "Hospitality",
  "Construction",
  "Agriculture",
  "Finance",
  "Legal",
  "Transport & Logistics",
]);

export const OPPORTUNITY_TYPE_OPTIONS = makeOptions([
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Permanent",
  "Seasonal",
  "Remote",
  "Hybrid",
]);

export const OPPORTUNITY_DEMAND_OPTIONS = makeOptions([
  "Very High",
  "High",
  "Medium",
  "Low",
]);

export const OPPORTUNITY_CONTRACT_OPTIONS = makeOptions([
  "Permanent",
  "Fixed-term",
  "Temporary",
  "Seasonal",
  "Contract",
  "Casual",
]);

export const VISA_OPTIONS = makeOptions([
  "Work Visa",
  "Skilled Worker Visa",
  "Student Visa",
  "Study Permit",
  "Family Visa",
  "Business Visa",
  "Investor Visa",
  "Permanent Residence",
  "Visitor Visa",
  "Employer Sponsored Visa",
]);

export const DURATION_OPTIONS = makeOptions([
  "3 months",
  "4 months",
  "5 months",
  "6 months",
  "7 months",
  "8 months",
  "9 months",
  "12 months",
  "18 months",
  "24 months",
  "Permanent",
]);

export const PROCESSING_TIME_OPTIONS = makeOptions([
  "2–4 weeks",
  "4–6 weeks",
  "6–8 weeks",
  "2–3 months",
  "3–4 months",
  "4–6 months",
  "6–9 months",
  "9–12 months",
]);

export const LOCATION_OPTIONS = makeOptions([
  "Nationwide",
  "Major Cities",
  "Capital City",
  "Rural Areas",
  "Urban Areas",
]);

export const SALARY_PERIOD_OPTIONS = makeOptions([
  "per hour",
  "per week",
  "per month",
  "per year",
]);

export const APPLICATION_QUESTION_TYPES = [
  {
    value: "text",
    label: "Short text",
  },
  {
    value: "textarea",
    label: "Long text",
  },
  {
    value: "select",
    label: "Dropdown",
  },
  {
    value: "number",
    label: "Number",
  },
  {
    value: "date",
    label: "Date",
  },
  {
    value: "boolean",
    label: "Yes / No",
  },
];

export const WORKFLOW_STAGE_OPTIONS = makeOptions([
  "Application Review",
  "Document Verification",
  "Eligibility Assessment",
  "Employer Review",
  "Interview",
  "Offer / Placement",
  "Visa Processing",
  "Final Review",
  "Completed",
]);

export const REQUIRED_DOCUMENT_TYPE_OPTIONS = [
  {
    value: "PASSPORT",
    label: "Passport",
  },
  {
    value: "IDENTIFICATION",
    label: "Identification",
  },
  {
    value: "ACADEMIC_CERTIFICATE",
    label: "Academic Certificate",
  },
  {
    value: "FINANCIAL_DOCUMENT",
    label: "Financial Document",
  },
  {
    value: "EMPLOYMENT_DOCUMENT",
    label: "Employment Document",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

export default {
  OPPORTUNITY_CATEGORY_OPTIONS,
  OPPORTUNITY_TYPE_OPTIONS,
  OPPORTUNITY_DEMAND_OPTIONS,
  OPPORTUNITY_CONTRACT_OPTIONS,
  VISA_OPTIONS,
  DURATION_OPTIONS,
  PROCESSING_TIME_OPTIONS,
  LOCATION_OPTIONS,
  SALARY_PERIOD_OPTIONS,
  APPLICATION_QUESTION_TYPES,
  WORKFLOW_STAGE_OPTIONS,
  REQUIRED_DOCUMENT_TYPE_OPTIONS,
};
