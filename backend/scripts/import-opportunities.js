import mongoose from "mongoose";
import dotenv from "dotenv";

import Opportunity from "../src/modules/opportunities/opportunity.model.js";

dotenv.config();

/*
|--------------------------------------------------------------------------
| DATABASE
|--------------------------------------------------------------------------
*/

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined.");
  process.exit(1);
}

/*
|--------------------------------------------------------------------------
| STABLE IMPORT IDS
|--------------------------------------------------------------------------
|
| These IDs allow this script to be safely re-run.
|
*/

const OPPORTUNITY_IDS = {
  IRELAND_NURSING: 101,
  BELGIUM_POULTRY: 102,
  NETHERLANDS_WELDER: 103,
  AUSTRALIA_NEW_ZEALAND: 104,
  TEACHER_MIGRATION: 105,
  GERMANY_NURSING: 106,
  LITHUANIA_WORK: 107,
  LATVIA_WORK: 108,
};

/*
|--------------------------------------------------------------------------
| DOCUMENT HELPER
|--------------------------------------------------------------------------
*/

const document = (name, type, description = "", required = true) => ({
  name,
  type,
  description,
  required,
});

/*
|--------------------------------------------------------------------------
| COMMON TERMS
|--------------------------------------------------------------------------
*/

const STRUCTURED_PAYMENT_TERMS = [
  "This is a structured payment migration package.",
  "Applicants must meet basic eligibility requirements, including age, document verification, and work readiness.",
  "All applicants must provide valid documents for screening and employer matching.",
  "Processing begins only after successful agreement signing and document verification.",
  "Limited slots may be available.",
  "Positions are filled on a first-come, first-served basis.",
  "The applicant must sign the applicable agreement and pay the required deposit before processing begins.",
];

/*
|--------------------------------------------------------------------------
| OPPORTUNITIES
|--------------------------------------------------------------------------
*/

const opportunities = [
  /*
  |--------------------------------------------------------------------------
  | 1. IRELAND NURSING / CNA / CAREGIVER
  |--------------------------------------------------------------------------
  */

  {
    countryId: OPPORTUNITY_IDS.IRELAND_NURSING,
    countryName: "Ireland",
    countrySlug: "ireland",

    countryFlag: "",
    countryImage: "",

    applicants: "Nurses, CNAs & Caregivers",

    countryCategories: ["Healthcare", "Nursing", "Caregiving", "Work"],

    countryVisa: "Work Visa",
    countryDuration: "Employment-based",
    countryProcessingTime: "4–6 months",

    countryDescription:
      "Migration and employment opportunities for nurses, CNAs and caregivers seeking healthcare jobs in Ireland.",

    opportunityScore: "",
    successRate: "",

    featured: true,

    legacyId: OPPORTUNITY_IDS.IRELAND_NURSING,

    title: "Ireland Nursing, CNA & Caregiver Opportunities",

    slug: "nursing-cna-caregiver-opportunities",

    image: "",

    category: "Healthcare",

    location: "Ireland",

    type: "Work & Migration",

    duration: "4–6 months",

    icon: "healthcare",

    salary: "€37,000 – €98,000 per annum",

    demand: "Nurses, CNAs & Caregivers",

    description:
      "Colossus Migration supports qualified nurses, CNAs and caregivers seeking employment opportunities and migration support to Ireland.",

    highlights: [
      "Salary of €37,000 – €98,000 per annum depending on qualifications and experience.",
      "Accommodation to be arranged by employer.",
      "Estimated processing time of 4–6 months.",
      "Qualification recognition and NMBI-related support.",
      "Job placement service.",
      "Work visa application support.",
      "Support with document preparation and language or occupational test preparation.",
    ],

    requirements: [
      "CV.",
      "Passport photograph.",
      "International passport data page.",
      "IELTS Academic or Occupational English Test (OET).",
      "Academic transcripts.",
      "Detailed curriculum or syllabus.",
      "Clinical placement records and hours.",
      "Current Nursing and Midwifery Council of Nigeria (NMCN) licence.",
      "Certificate of Current Professional Status (CCPS) / Certificate of Good Standing.",
      "Registration history where applicable.",
      "Employment reference letters.",
      "Evidence of nursing work experience.",
      "Employer verification documents.",
      "Certified copies of documents.",
      "Additional postgraduate qualifications or specialist certificates where applicable.",
    ],

    documents: [
      "CV",
      "Passport Photograph",
      "Passport Data Page",
      "IELTS Academic / OET",
      "Academic Documents",
      "Academic Transcripts",
      "Detailed Curriculum / Syllabus",
      "Clinical Placement Records",
      "NMCN Nursing Licence",
      "CCPS / Certificate of Good Standing",
      "Registration History",
      "Employment Reference Letters",
      "Nursing Work Experience Evidence",
      "Employer Verification Documents",
      "Certified Documents",
      "Postgraduate / Specialist Certificates",
    ],

    benefits: [
      "Qualification recognition and registration support.",
      "NMBI-related service support.",
      "Job placement service.",
      "Work visa application service.",
      "Visa processing support.",
      "Employer-arranged accommodation.",
      "Family package available.",
      "Guidance with language or occupational tests.",
      "Interview preparation support.",
    ],

    steps: [
      {
        title: "Document Submission",
        description:
          "Candidate submits the documents currently available. Missing documents can be arranged and submitted later.",
        duration: "Initial stage",
      },
      {
        title: "Service Level Agreement",
        description:
          "Colossus Migration and the candidate sign the applicable Service Level Agreement.",
        duration: "After screening",
      },
      {
        title: "Mobilization",
        description:
          "Candidate pays the initial mobilization deposit to kickstart the process.",
        duration: "After agreement",
      },
      {
        title: "Qualification & Registration",
        description:
          "Qualification recognition and applicable NMBI registration processes are undertaken.",
        duration: "Pathway dependent",
      },
      {
        title: "Employer Placement",
        description:
          "Candidate proceeds through employer matching, interviews and employment documentation.",
        duration: "Pathway dependent",
      },
      {
        title: "Work Visa",
        description:
          "Work visa application and related processing are completed.",
        duration: "Final stage",
      },
    ],

    positions: [
      {
        title: "Registered Nurse",
      },
      {
        title: "Certified Nursing Assistant",
      },
      {
        title: "Caregiver",
      },
    ],

    workConditions: {
      accommodation: "To be arranged by employer.",
      employmentType: "Employment",
      environment: "Healthcare",
    },

    contract: "Employment contract subject to successful employer placement.",

    faq: [],

    pricing: {
      amount: 15000000,
      currency: "NGN",
      label: "Individual Package",
      spouseAdditional: 3000000,
      childAdditional: 1000000,
      covers: [
        "Qualification recognition and registration service charge.",
        "NMBI fees.",
        "Job placement service charge.",
        "Work visa application service charge.",
        "Visa fees.",
      ],
    },

    paymentPlan: [
      {
        stage: "Mobilization for NMBI Registration",
        amount: 3000000,
        currency: "NGN",
        trigger: "At commencement",
      },
      {
        stage: "NMBI Registration / Decision Letter",
        amount: 5000000,
        currency: "NGN",
        trigger: "After registration / decision letter",
      },
      {
        stage: "Job Offer / Employment Contract / Work Permit",
        amount: 5000000,
        currency: "NGN",
        trigger:
          "After receiving job offer and employment contract / work permit documents",
      },
      {
        stage: "Work Visa / Readiness to Travel",
        amount: 2000000,
        currency: "NGN",
        trigger: "After work visa approval / readiness for travel",
      },
    ],

    terms: [
      ...STRUCTURED_PAYMENT_TERMS,
      "Colossus Migration supports candidates in gathering required documents.",
      "Colossus Migration may guide candidates in preparation for language or occupational tests and interviews.",
      "Individual package cost is ₦15,000,000.",
      "Spouse package addition is ₦3,000,000.",
      "Each child attracts an additional ₦1,000,000.",
    ],

    applicationConfig: {
      steps: ["DOCUMENTS", "REVIEW"],

      questions: [],

      requiredDocuments: [
        document("CV", "EMPLOYMENT_DOCUMENT", "Updated professional CV."),

        document(
          "Passport Photograph",
          "IDENTIFICATION",
          "Recent passport photograph.",
        ),

        document(
          "Passport Data Page",
          "PASSPORT",
          "International passport bio-data page.",
        ),

        document(
          "IELTS Academic / OET",
          "OTHER",
          "IELTS Academic or Occupational English Test where applicable.",
        ),

        document(
          "Academic Transcripts",
          "ACADEMIC_CERTIFICATE",
          "Academic transcripts.",
        ),

        document(
          "Curriculum / Syllabus",
          "ACADEMIC_CERTIFICATE",
          "Detailed curriculum or syllabus.",
        ),

        document(
          "Clinical Placement Records",
          "ACADEMIC_CERTIFICATE",
          "Clinical placement records and hours.",
        ),

        document(
          "NMCN Nursing Licence",
          "EMPLOYMENT_DOCUMENT",
          "Current Nursing and Midwifery Council of Nigeria licence.",
        ),

        document(
          "CCPS / Certificate of Good Standing",
          "EMPLOYMENT_DOCUMENT",
          "Certificate of Current Professional Status / Certificate of Good Standing.",
        ),

        document(
          "Registration History",
          "EMPLOYMENT_DOCUMENT",
          "Professional registration history where applicable.",
          false,
        ),

        document(
          "Employment Reference Letters",
          "EMPLOYMENT_DOCUMENT",
          "Employment reference letters.",
        ),

        document(
          "Nursing Work Experience Evidence",
          "EMPLOYMENT_DOCUMENT",
          "Evidence of nursing work experience.",
        ),

        document(
          "Employer Verification Documents",
          "EMPLOYMENT_DOCUMENT",
          "Employer verification documents where applicable.",
          false,
        ),

        document(
          "Postgraduate / Specialist Certificates",
          "ACADEMIC_CERTIFICATE",
          "Additional postgraduate or specialist certificates where applicable.",
          false,
        ),
      ],

      workflow: [],
    },

    active: true,
  },

  /*
  |--------------------------------------------------------------------------
  | 2. BELGIUM POULTRY
  |--------------------------------------------------------------------------
  */

  {
    countryId: OPPORTUNITY_IDS.BELGIUM_POULTRY,
    countryName: "Belgium",
    countrySlug: "belgium",

    countryFlag: "",
    countryImage: "",

    applicants: "Production & Packaging Workers",

    countryCategories: ["Work", "Employment", "Production"],

    countryVisa: "Work Visa",
    countryDuration: "Employment-based",
    countryProcessingTime: "3–4 months",

    countryDescription:
      "Poultry production and packaging employment opportunity near Antwerp, Belgium.",

    opportunityScore: "",
    successRate: "",

    featured: false,

    legacyId: OPPORTUNITY_IDS.BELGIUM_POULTRY,

    title: "Belgium Poultry Production & Packaging Worker",

    slug: "poultry-production-packaging-worker",

    image: "",

    category: "Work",

    location: "Near Antwerp, Belgium",

    type: "Employment",

    duration: "3–4 months",

    icon: "briefcase",

    salary: "Up to €2,550 net/month",

    demand: "Production & Packaging Workers",

    description:
      "Full-time poultry production and packaging position involving sorting, packing, labelling and quality control in a temperature-controlled environment.",

    highlights: [
      "Salary up to €2,550 net per month.",
      "Location near Antwerp.",
      "Accommodation provided by employer.",
      "Full-time position.",
      "Sorting and packing meat products.",
      "Labelling and quality control.",
      "Temperature-controlled working environment.",
      "Strict hygiene and safety standards.",
    ],

    requirements: [
      "Age 18–50 years.",
      "Male and female applicants accepted.",
      "CV.",
      "Passport photograph.",
      "International passport data page.",
      "Basic or secondary education certificate.",
      "Physical fitness.",
      "Legal eligibility to work.",
      "Prior food processing experience is an advantage.",
    ],

    documents: [
      "CV",
      "Passport Photograph",
      "International Passport Data Page",
      "Basic / Secondary Education Certificate",
    ],

    benefits: [
      "Employer-provided accommodation.",
      "Employment opportunity near Antwerp.",
      "Work visa process support.",
      "Job placement support.",
    ],

    steps: [
      {
        title: "Document Submission",
        description:
          "Candidate submits available documents by email, WhatsApp or through the website.",
        duration: "Initial stage",
      },
      {
        title: "Service Level Agreement",
        description:
          "Candidate and Colossus Migration sign the Service Level Agreement.",
        duration: "After screening",
      },
      {
        title: "Mobilization",
        description:
          "Candidate pays the initial deposit to kickstart the process.",
        duration: "After agreement",
      },
      {
        title: "Processing",
        description:
          "Colossus Migration begins the job placement and work visa process.",
        duration: "3–4 months",
      },
    ],

    positions: [
      {
        title: "Poultry Production Worker",
      },
      {
        title: "Packaging Worker",
      },
    ],

    workConditions: {
      accommodation: "Provided by employer.",
      employmentType: "Full-time",
      environment: "Temperature-controlled food production",
      duties: [
        "Sorting",
        "Packing",
        "Labelling",
        "Quality control",
        "Hygiene and safety compliance",
        "Basic equipment operation",
      ],
    },

    contract: "Employment contract subject to employer placement.",

    faq: [],

    pricing: {
      amount: 10000000,
      currency: "NGN",
      label: "Job Placement & Work Visa Process",
    },

    paymentPlan: [
      {
        stage: "Mobilization",
        percentage: 40,
        currency: "NGN",
        trigger: "At commencement",
      },
      {
        stage: "Offer / Contract / Work Permit",
        percentage: 40,
        currency: "NGN",
        trigger:
          "After receiving offer of employment / contract and work permit documents",
      },
      {
        stage: "Work Visa Approval",
        percentage: 20,
        currency: "NGN",
        trigger: "After work visa approval",
      },
    ],

    terms: STRUCTURED_PAYMENT_TERMS,

    applicationConfig: {
      steps: ["DOCUMENTS", "REVIEW"],

      questions: [],

      requiredDocuments: [
        document("CV", "EMPLOYMENT_DOCUMENT", "Updated CV."),

        document(
          "Passport Photograph",
          "IDENTIFICATION",
          "Recent passport photograph.",
        ),

        document(
          "International Passport Data Page",
          "PASSPORT",
          "International passport bio-data page.",
        ),

        document(
          "Basic / Secondary Education Certificate",
          "ACADEMIC_CERTIFICATE",
          "Basic or secondary education certificate.",
        ),
      ],

      workflow: [],
    },

    active: true,
  },

  /*
  |--------------------------------------------------------------------------
  | 3. NETHERLANDS WELDER
  |--------------------------------------------------------------------------
  */

  {
    countryId: OPPORTUNITY_IDS.NETHERLANDS_WELDER,
    countryName: "Netherlands",
    countrySlug: "netherlands",

    countryFlag: "",
    countryImage: "",

    applicants: "Qualified Welders",

    countryCategories: ["Work", "Skilled Work", "Welding"],

    countryVisa: "Work Visa",
    countryDuration: "Employment-based",
    countryProcessingTime: "3–4 months",

    countryDescription:
      "Welding employment opportunity covering steel structures, industrial tanks and offshore projects.",

    opportunityScore: "",
    successRate: "",

    featured: false,

    legacyId: OPPORTUNITY_IDS.NETHERLANDS_WELDER,

    title: "Netherlands Welding Job",

    slug: "welding-job",

    image: "",

    category: "Skilled Work",

    location: "Netherlands",

    type: "Employment",

    duration: "3–4 months",

    icon: "welding",

    salary: "Up to €5,720 net/month",

    demand: "Qualified Welders",

    description:
      "Welding employment opportunity covering steel structures, industrial tanks and offshore projects.",

    highlights: [
      "Salary up to €5,720 net per month.",
      "Steel structures.",
      "Industrial tanks.",
      "Offshore projects.",
      "Male and female applicants.",
      "Employer-provided accommodation.",
      "Work visa process support.",
    ],

    requirements: [
      "Age 18–50 years.",
      "Male and female applicants accepted.",
      "CV.",
      "Passport photograph.",
      "International passport data page.",
      "Basic or secondary education certificate.",
      "Welding training certifications.",
      "136 and 138 welding certifications are an advantage.",
      "EN ISO 9606-1 certification standard.",
    ],

    documents: [
      "CV",
      "Passport Photograph",
      "International Passport Data Page",
      "Basic / Secondary Education Certificate",
      "Welding Training Certifications",
    ],

    benefits: [
      "Employer-provided accommodation.",
      "Job placement.",
      "Employment contract processing.",
      "Work visa process support.",
    ],

    steps: [
      {
        title: "Document Submission",
        description: "Candidate submits available documents for assessment.",
        duration: "Initial stage",
      },
      {
        title: "Service Level Agreement",
        description:
          "Candidate signs the applicable Migration / Service Agreement.",
        duration: "After screening",
      },
      {
        title: "Mobilization",
        description: "Candidate pays the initial mobilization deposit.",
        duration: "After agreement",
      },
      {
        title: "Job Placement & Visa Processing",
        description:
          "Colossus Migration proceeds with employer placement and work visa processing.",
        duration: "3–4 months",
      },
    ],

    positions: [
      {
        title: "Welder",
        specialization: "Steel Structures",
      },
      {
        title: "Welder",
        specialization: "Industrial Tanks",
      },
      {
        title: "Welder",
        specialization: "Offshore Projects",
      },
    ],

    workConditions: {
      accommodation: "Provided by employer.",
      employmentType: "Employment",
      environment: "Industrial / Offshore",
    },

    contract: "Employment contract subject to successful employer placement.",

    faq: [],

    pricing: {
      amount: 9000000,
      currency: "NGN",
      label: "Job Placement & Work Visa Process",
    },

    paymentPlan: [
      {
        stage: "Mobilization",
        percentage: 40,
        currency: "NGN",
        trigger: "At commencement",
      },
      {
        stage: "Offer / Contract / Work Permit",
        percentage: 40,
        currency: "NGN",
        trigger:
          "After receiving offer of employment / contract and work permit documents",
      },
      {
        stage: "Work Visa Approval",
        percentage: 20,
        currency: "NGN",
        trigger: "After work visa approval",
      },
    ],

    terms: STRUCTURED_PAYMENT_TERMS,

    applicationConfig: {
      steps: ["DOCUMENTS", "REVIEW"],

      questions: [],

      requiredDocuments: [
        document("CV", "EMPLOYMENT_DOCUMENT", "Updated CV."),

        document(
          "Passport Photograph",
          "IDENTIFICATION",
          "Recent passport photograph.",
        ),

        document(
          "International Passport Data Page",
          "PASSPORT",
          "International passport bio-data page.",
        ),

        document(
          "Basic / Secondary Education Certificate",
          "ACADEMIC_CERTIFICATE",
          "Basic or secondary education certificate.",
        ),

        document(
          "Welding Training Certifications",
          "EMPLOYMENT_DOCUMENT",
          "Welding training certifications, including 136 / 138 where applicable.",
          false,
        ),
      ],

      workflow: [],
    },

    active: true,
  },

  /*
  |--------------------------------------------------------------------------
  | 4. AUSTRALIA & NEW ZEALAND
  |--------------------------------------------------------------------------
  */

  {
    countryId: OPPORTUNITY_IDS.AUSTRALIA_NEW_ZEALAND,
    countryName: "Australia & New Zealand",
    countrySlug: "australia-new-zealand",

    countryFlag: "",
    countryImage: "",

    applicants: "Students / Apprentices",

    countryCategories: [
      "Study",
      "Work",
      "Apprenticeship",
      "Technical",
      "Vocational",
      "Healthcare",
    ],

    countryVisa: "Study / Training Pathway",
    countryDuration: "1 year",
    countryProcessingTime: "",

    countryDescription:
      "One-year study and work paid apprenticeship program covering trades, technical, vocational and healthcare programs.",

    opportunityScore: "",
    successRate: "",

    featured: true,

    legacyId: OPPORTUNITY_IDS.AUSTRALIA_NEW_ZEALAND,

    title: "New Zealand & Australia 1-Year Study & Work Apprenticeship Program",

    slug: "study-work-apprenticeship-program",

    image: "",

    category: "Study & Work",

    location: "Australia & New Zealand",

    type: "Study & Work Apprenticeship",

    duration: "1 year",

    icon: "academic",

    salary: "Paid apprenticeship",

    demand: "Trades, Technical, Vocational & Healthcare",

    description:
      "A one-year study and work paid apprenticeship program represented as being offered by training institutions in Australia and New Zealand.",

    highlights: [
      "One-year study and work paid apprenticeship program.",
      "Trades programs.",
      "Technical programs.",
      "Vocational programs.",
      "Healthcare programs.",
      "Hands-on on-the-job training.",
      "Next intakes stated as December 2026 and January–March 2027.",
      "Tuition starting from ₦5,000,000 depending on country and program.",
    ],

    requirements: [
      "Senior / high school education or higher, or equivalent.",
      "IELTS Academic 5.5 overall with no band below 5.0, or accepted equivalent.",
      "Age 18–55 years.",
    ],

    documents: [
      "Passport",
      "Passport Photograph",
      "Educational Certificate",
      "IELTS Academic / Accepted English Equivalent",
      "CV",
    ],

    benefits: [
      "On-the-job hands-on training.",
      "Study and apprenticeship pathway.",
      "Training in trades, technical, vocational and healthcare programs.",
      "Potential employment opportunities after training subject to program and employer requirements.",
    ],

    steps: [
      {
        title: "Document Submission",
        description:
          "Candidate submits documents by email, WhatsApp or website upload.",
        duration: "Initial stage",
      },
      {
        title: "Service Level Agreement",
        description:
          "Candidate signs the applicable Service Level Agreement with Colossus Migration.",
        duration: "After screening",
      },
      {
        title: "Mobilization",
        description:
          "Candidate pays the initial deposit to kickstart processing.",
        duration: "After agreement",
      },
      {
        title: "Program Processing",
        description:
          "Colossus Migration proceeds with the selected study and apprenticeship pathway.",
        duration: "Program dependent",
      },
    ],

    positions: [
      {
        title: "Trades",
      },
      {
        title: "Technical",
      },
      {
        title: "Vocational",
      },
      {
        title: "Healthcare",
      },
    ],

    workConditions: {
      accommodation: "",
      employmentType: "Study / Apprenticeship",
      trainingType: "On-the-job hands-on training",
    },

    contract: "Training and placement arrangements are program dependent.",

    faq: [],

    pricing: {
      minAmount: 5000000,
      maxAmount: 15000000,
      currency: "NGN",
      label: "Program Cost Range",
      description:
        "Total cost starts from ₦5,000,000 to ₦15,000,000 depending on country and program.",
    },

    paymentPlan: [],

    terms: [
      ...STRUCTURED_PAYMENT_TERMS,
      "The source material states that selected programs may have permanent residency eligibility; this is subject to the applicable immigration and program rules.",
      "The source material states that tuition may be refundable by the school if a visa is not granted; refund terms must be governed by the applicable school's written terms.",
      "Visa approval is determined by the relevant immigration authority.",
      "Program availability and intake dates are subject to the training institution.",
    ],

    applicationConfig: {
      steps: ["DOCUMENTS", "REVIEW"],

      questions: [],

      requiredDocuments: [
        document("Passport", "PASSPORT", "Valid international passport."),

        document(
          "Passport Photograph",
          "IDENTIFICATION",
          "Recent passport photograph.",
        ),

        document(
          "Educational Certificate",
          "ACADEMIC_CERTIFICATE",
          "Senior / high school education or higher.",
        ),

        document(
          "IELTS Academic / Accepted Equivalent",
          "OTHER",
          "IELTS Academic 5.5 overall with no band below 5.0 or accepted equivalent.",
        ),

        document(
          "CV",
          "EMPLOYMENT_DOCUMENT",
          "Updated CV where required by the selected program.",
          false,
        ),
      ],

      workflow: [],
    },

    active: true,
  },

  /*
  |--------------------------------------------------------------------------
  | 5. TEACHER MIGRATION
  |--------------------------------------------------------------------------
  */

  {
    countryId: OPPORTUNITY_IDS.TEACHER_MIGRATION,
    countryName: "Multiple Destinations",
    countrySlug: "teacher-migration",

    countryFlag: "",
    countryImage: "",

    applicants: "Qualified Teachers",

    countryCategories: ["Education", "Teaching", "Work", "Migration"],

    countryVisa: "Employment / Work Visa",
    countryDuration: "Country dependent",
    countryProcessingTime: "",

    countryDescription:
      "Teacher migration and recruitment opportunities across Canada, Australia, New Zealand, Ireland, UK, Japan, China, Oman and other Asian destinations.",

    opportunityScore: "",
    successRate: "",

    featured: true,

    legacyId: OPPORTUNITY_IDS.TEACHER_MIGRATION,

    title: "Teacher Migration Programs",

    slug: "teacher-migration-programs",

    image: "",

    category: "Education",

    location:
      "Canada, Australia, New Zealand, Ireland, UK, Japan, China, Oman, Singapore, Malaysia & other Asian countries",

    type: "Teacher Migration",

    duration: "Country dependent",

    icon: "education",

    salary: "Country and employer dependent",

    demand: "Qualified Teachers",

    description:
      "Colossus Migration assists with recruitment and migration pathways for qualified teachers seeking teaching employment abroad.",

    highlights: [
      "Teaching jobs across multiple countries.",
      "Canada.",
      "Australia.",
      "New Zealand.",
      "Ireland.",
      "United Kingdom.",
      "Japan.",
      "China.",
      "Oman.",
      "Singapore.",
      "Malaysia.",
      "Other Asian countries.",
    ],

    requirements: [
      "Age limit of 55 years.",
      "CV with detailed employment history.",
      "Valid international passport.",
      "Bachelor's degree / education degree.",
      "Teacher-training qualification.",
      "Teacher registration / licence evidence where applicable.",
      "English Language Test where required.",
    ],

    documents: [
      "CV",
      "International Passport",
      "Bachelor's / Education Degree",
      "Teacher Training Qualification",
      "Teacher Registration / Licence",
      "English Language Test where applicable",
    ],

    benefits: [
      "Offer of employment processing.",
      "Employment contract processing.",
      "Work permit processing.",
      "Work visa processing.",
      "Multiple destination options.",
    ],

    steps: [
      {
        title: "Document Submission",
        description:
          "Candidate submits available documents by email, WhatsApp or website upload.",
        duration: "Initial stage",
      },
      {
        title: "Service Level Agreement",
        description: "Candidate signs the Service Level Agreement.",
        duration: "After screening",
      },
      {
        title: "Mobilization",
        description:
          "Candidate pays the initial deposit to kickstart processing.",
        duration: "After agreement",
      },
      {
        title: "Employer Recruitment",
        description:
          "Candidate proceeds through employer recruitment and offer process.",
        duration: "Pathway dependent",
      },
      {
        title: "Work Permit",
        description: "Applicable work permit documentation is processed.",
        duration: "Pathway dependent",
      },
      {
        title: "Work Visa",
        description: "Candidate proceeds with work visa processing.",
        duration: "Final stage",
      },
    ],

    positions: [
      {
        title: "Teacher",
      },
    ],

    workConditions: {
      accommodation: "Country and employer dependent.",
      employmentType: "Employment",
      destinationType: "Multiple destinations",
    },

    contract:
      "Employment contract subject to employer and destination requirements.",

    faq: [],

    pricing: {
      currency: "NGN",
      label: "Country-Specific Program Cost",

      destinations: [
        {
          country: "Australia",
          amount: 8000000,
        },
        {
          country: "New Zealand",
          amount: 10000000,
        },
        {
          country: "Canada",
          amount: 10000000,
        },
        {
          country: "Ireland",
          amount: 9000000,
        },
        {
          country: "United Kingdom",
          amount: 10000000,
        },
        {
          country: "Oman",
          amount: 6000000,
        },
        {
          country: "Japan",
          amount: 4000000,
        },
        {
          country: "China",
          amount: 4000000,
        },
        {
          country: "Singapore",
          amount: 4000000,
        },
        {
          country: "Malaysia",
          amount: 4000000,
        },
      ],
    },

    paymentPlan: [
      {
        stage: "Mobilization",
        percentage: 40,
        currency: "NGN",
        trigger: "At commencement",
      },
      {
        stage: "Offer / Contract / Work Permit",
        percentage: 40,
        currency: "NGN",
        trigger:
          "After receiving offer of employment / contract and work permit documents",
      },
      {
        stage: "Work Visa Approval",
        percentage: 20,
        currency: "NGN",
        trigger: "After work visa approval",
      },
    ],

    terms: [
      ...STRUCTURED_PAYMENT_TERMS,
      "English language testing requirements depend on destination.",
      "The source specifically excludes Japan, Oman, China, Singapore, Malaysia and other Asian countries from the stated English test requirement, subject to destination requirements.",
    ],

    applicationConfig: {
      steps: ["DOCUMENTS", "REVIEW"],

      questions: [
        {
          key: "preferredDestination",
          label: "Preferred Destination",
          type: "select",
          required: true,
          options: [
            "Australia",
            "New Zealand",
            "Canada",
            "Ireland",
            "United Kingdom",
            "Oman",
            "Japan",
            "China",
            "Singapore",
            "Malaysia",
          ],
        },
      ],

      requiredDocuments: [
        document(
          "CV",
          "EMPLOYMENT_DOCUMENT",
          "CV containing detailed employment history.",
        ),

        document(
          "International Passport",
          "PASSPORT",
          "Valid international passport.",
        ),

        document(
          "Bachelor's / Education Degree",
          "ACADEMIC_CERTIFICATE",
          "Bachelor's degree or education degree.",
        ),

        document(
          "Teacher Training Qualification",
          "ACADEMIC_CERTIFICATE",
          "Teacher-training qualification.",
        ),

        document(
          "Teacher Registration / Licence",
          "EMPLOYMENT_DOCUMENT",
          "Teacher registration or licence where applicable.",
          false,
        ),

        document(
          "English Language Test",
          "OTHER",
          "English test where required by the destination.",
          false,
        ),
      ],

      workflow: [],
    },

    active: true,
  },

  /*
  |--------------------------------------------------------------------------
  | 6. GERMANY NURSING
  |--------------------------------------------------------------------------
  */

  {
    countryId: OPPORTUNITY_IDS.GERMANY_NURSING,
    countryName: "Germany",
    countrySlug: "germany",

    countryFlag: "",
    countryImage: "",

    applicants: "Registered Nurses",

    countryCategories: ["Healthcare", "Nursing", "Skilled Work"],

    countryVisa: "Long Stay Visa D / Work Visa",
    countryDuration: "Permanent & Unlimited Contract",
    countryProcessingTime: "",

    countryDescription:
      "Registered nurse job placement and work visa migration package for qualified nurses from Nigeria and Africa.",

    opportunityScore: "",
    successRate: "",

    featured: true,

    legacyId: OPPORTUNITY_IDS.GERMANY_NURSING,

    title: "Germany Nursing Job Placement + Work Visa Migration Package",

    slug: "nursing-job-placement-work-visa",

    image: "",

    category: "Healthcare",

    location: "Germany",

    type: "Skilled Employment",

    duration: "Permanent & Unlimited Contract",

    icon: "healthcare",

    salary: "€3,800 – €4,200 per month",

    demand: "150 Registered Nurses",

    description:
      "Registered nurse job placement and work visa migration package for qualified nurses from Nigeria and Africa.",

    highlights: [
      "150 registered nurses needed.",
      "Salary of €3,800 – €4,200 per month.",
      "Permanent and unlimited contract setup.",
      "Employer-provided accommodation for the first six months.",
      "38–40 hours per week.",
      "Approximately four weeks of paid onboarding and integration support.",
      "Qualification recognition and local licensing support.",
      "Family reunification support.",
    ],

    requirements: [
      "Age 25–50 years maximum.",
      "Valid BSc Nursing degree.",
      "German certificate at B2 level minimum.",
      "Minimum six years continuous professional nursing experience.",
      "Medical fitness certificate.",
      "Detailed certificates documenting past duties and procedures.",
      "Documentation of medical machinery used where applicable.",
      "Updated CV / Resume.",
      "Passport photograph.",
      "International passport data page with minimum one year validity.",
      "Educational and professional certificates.",
      "Relevant work experience documents.",
    ],

    documents: [
      "Updated CV / Resume",
      "Passport Photograph",
      "International Passport Data Page",
      "BSc Nursing Degree",
      "Educational Certificates",
      "Professional Certificates",
      "Work Experience Documents",
      "Medical Fitness Certificate",
      "Detailed Experience Certificates",
      "German B2 Certificate",
    ],

    benefits: [
      "Job placement.",
      "Job offer.",
      "Employment contract.",
      "Employer-provided accommodation for first six months.",
      "Work permit support.",
      "Long Stay Visa D / Work Visa support.",
      "Qualification recognition.",
      "Local licensing / Anerkennung support.",
      "Family reunification support.",
      "Paid onboarding and integration support.",
    ],

    steps: [
      {
        title: "Document Submission",
        description:
          "Submit required documents for eligibility assessment and profile review.",
        duration: "Initial stage",
      },
      {
        title: "Migration Service Agreement",
        description:
          "Successful applicants sign the Migration Service Agreement before processing begins.",
        duration: "After review",
      },
      {
        title: "Employer Matching",
        description:
          "Candidate profile is submitted to suitable employers based on qualifications, experience and job preference.",
        duration: "Pathway dependent",
      },
      {
        title: "Job Offer & Work Permit",
        description:
          "Successful candidates receive the job offer, employment contract, accommodation confirmation and approved work permit.",
        duration: "Pathway dependent",
      },
      {
        title: "Visa Application & Biometrics",
        description:
          "Applicant proceeds to embassy or visa centre for visa submission and biometrics.",
        duration: "Final stage",
      },
      {
        title: "Visa Approval & Travel",
        description:
          "After visa approval, the final payment becomes due before travel arrangements.",
        duration: "Final stage",
      },
    ],

    positions: [
      {
        title: "Registered Nurse",
        quantity: 150,
      },
    ],

    workConditions: {
      accommodation: "100% employer-provided for first six months.",
      employmentType: "Permanent & Unlimited Contract",
      workingHours: "38–40 hours per week",
      onboarding:
        "Approximately four weeks fully paid onboarding and integration support.",
    },

    contract: "Permanent and unlimited employment contract setup.",

    faq: [],

    pricing: {
      amount: 8000000,
      currency: "NGN",
      label: "Service Charge",
      covers: [
        "Job placement with job offer.",
        "Accommodation.",
        "Work permit.",
        "Long Stay Visa D / Work Visa.",
      ],
    },

    paymentPlan: [
      {
        stage: "Migration Agreement",
        amount: 3500000,
        currency: "NGN",
        trigger: "Upon signing migration agreement",
      },
      {
        stage: "Job Offer / Contract / Work Permit",
        amount: 2500000,
        currency: "NGN",
        trigger:
          "After securing job offer, employment contract and approved work permit",
      },
      {
        stage: "Visa Approval / Travel Readiness",
        amount: 2000000,
        currency: "NGN",
        trigger: "Upon visa approval and readiness for travel",
      },
    ],

    terms: [
      ...STRUCTURED_PAYMENT_TERMS,
      "Successful applicants sign the Migration Service Agreement before processing begins.",
      "Employer matching is based on qualifications, experience and job preference.",
      "Visa decisions are subject to the relevant authorities.",
    ],

    applicationConfig: {
      steps: ["DOCUMENTS", "REVIEW"],

      questions: [],

      requiredDocuments: [
        document(
          "Updated CV / Resume",
          "EMPLOYMENT_DOCUMENT",
          "Updated professional CV.",
        ),

        document(
          "Passport Photograph",
          "IDENTIFICATION",
          "Recent passport photograph.",
        ),

        document(
          "International Passport Data Page",
          "PASSPORT",
          "Passport bio-data page with minimum one year validity.",
        ),

        document(
          "BSc Nursing Degree",
          "ACADEMIC_CERTIFICATE",
          "Valid BSc Nursing degree.",
        ),

        document(
          "Educational / Professional Certificates",
          "ACADEMIC_CERTIFICATE",
          "Relevant educational and professional certificates.",
        ),

        document(
          "Work Experience Documents",
          "EMPLOYMENT_DOCUMENT",
          "Evidence of relevant nursing work experience.",
        ),

        document(
          "Medical Fitness Certificate",
          "OTHER",
          "Medical fitness documentation.",
        ),

        document(
          "Detailed Experience Certificates",
          "EMPLOYMENT_DOCUMENT",
          "Certificates detailing previous duties, procedures and medical machinery used.",
        ),

        document(
          "German B2 Certificate",
          "OTHER",
          "German language certificate at B2 level minimum.",
        ),
      ],

      workflow: [],
    },

    active: true,
  },

  /*
  |--------------------------------------------------------------------------
  | 7. LITHUANIA
  |--------------------------------------------------------------------------
  */

  {
    countryId: OPPORTUNITY_IDS.LITHUANIA_WORK,
    countryName: "Lithuania",
    countrySlug: "lithuania",

    countryFlag: "",
    countryImage: "",

    applicants: "International Workers",

    countryCategories: ["Work", "Employment", "Temporary Residence"],

    countryVisa: "Temporary Residence Permit",
    countryDuration: "Up to 2 years",
    countryProcessingTime: "Up to 2 months",

    countryDescription:
      "Lithuania work program involving employment, MIGRIS intermediary documentation and Temporary Residence Permit processing.",

    opportunityScore: "",
    successRate: "",

    featured: false,

    legacyId: OPPORTUNITY_IDS.LITHUANIA_WORK,

    title: "Lithuania Work Program",

    slug: "work-program",

    image: "",

    category: "Work",

    location: "Lithuania",

    type: "Employment",

    duration: "Up to 2 years",

    icon: "briefcase",

    salary: "",

    demand: "International Workers",

    description:
      "Lithuania employment pathway involving an employer intermediary letter through MIGRIS and a Temporary Residence Permit valid for up to two years.",

    highlights: [
      "Temporary Residence Permit valid up to two years.",
      "Europass CV required.",
      "Short English self-introduction video.",
      "Police clearance with applicable apostille or super legalization.",
      "Certified Lithuanian translation.",
      "Medical insurance.",
      "MIGRIS intermediary letter from employer.",
      "Processing time up to two months.",
      "TRP renewal pathway.",
      "Permanent residency application may be possible after five years of legal residence subject to applicable requirements.",
    ],

    requirements: [
      "Passport.",
      "CV in Europass format.",
      "Passport-size digital photo.",
      "Short self-introduction video.",
      "Police Clearance Certificate.",
      "Apostille or super legalization where required.",
      "Certified translation into Lithuanian.",
      "Notarized translation requirements where applicable.",
      "Medical insurance.",
      "Bank statement if required.",
      "Employment contract.",
    ],

    documents: [
      "Passport",
      "Europass CV",
      "Passport-Size Photo",
      "Self-Introduction Video",
      "Police Clearance Certificate",
      "Medical Insurance",
      "Bank Statement",
      "Employment Contract",
      "MIGRIS Intermediary Letter",
    ],

    benefits: [
      "Employment pathway.",
      "Employer intermediary letter.",
      "Temporary Residence Permit pathway.",
      "MIGRIS application support.",
      "VFS biometric appointment process.",
      "Residence renewal pathway.",
    ],

    steps: [
      {
        title: "Employment Contract",
        description: "Prepare and sign the employment contract.",
        duration: "Initial stage",
      },
      {
        title: "Vacancy Registration",
        description:
          "Employer registers the vacancy with the Lithuanian Employment Service.",
        duration: "Pathway dependent",
      },
      {
        title: "MIGRIS Intermediary Letter",
        description:
          "Employer submits the intermediary letter through the MIGRIS system.",
        duration: "Pathway dependent",
      },
      {
        title: "MIGRIS Application",
        description:
          "Candidate completes the MIGRIS application and books a biometric appointment through VFS Global.",
        duration: "Pathway dependent",
      },
      {
        title: "Biometrics",
        description: "Candidate submits biometrics and supporting documents.",
        duration: "Appointment stage",
      },
      {
        title: "Migration Department Review",
        description: "The Migration Department reviews the application.",
        duration: "Up to 2 months",
      },
      {
        title: "TRP Issuance",
        description:
          "After approval, the TRP card and applicable entry/work authorization are issued.",
        duration: "Final stage",
      },
    ],

    positions: [],

    workConditions: {
      accommodation: "",
      employmentType: "Employment",
      residenceType: "Temporary Residence Permit",
    },

    contract: "Employment contract required.",

    faq: [],

    pricing: {
      amount: 8000000,
      currency: "NGN",
      label: "Job Placement & Work Visa Process",
    },

    paymentPlan: [
      {
        stage: "Mobilization",
        percentage: 40,
        currency: "NGN",
        trigger: "At commencement",
      },
      {
        stage: "Offer / Contract / Work Permit",
        percentage: 40,
        currency: "NGN",
        trigger:
          "After receiving offer of employment / contract and work permit documents",
      },
      {
        stage: "Work Visa / Residence Approval",
        percentage: 20,
        currency: "NGN",
        trigger: "After visa / residence approval",
      },
    ],

    terms: [
      ...STRUCTURED_PAYMENT_TERMS,
      "The supplied information states that TRP renewal should be submitted 2–4 months before expiry.",
      "Continued employment is the stated basis for renewal.",
      "Employer changes must be updated through MIGRIS where applicable.",
      "The supplied information states that permanent residency may be applied for after five years of legal residence, subject to applicable requirements.",
    ],

    applicationConfig: {
      steps: ["DOCUMENTS", "REVIEW"],

      questions: [],

      requiredDocuments: [
        document("Passport", "PASSPORT", "Valid passport."),

        document(
          "Europass CV",
          "EMPLOYMENT_DOCUMENT",
          "CV in Europass format.",
        ),

        document(
          "Passport-Size Photo",
          "IDENTIFICATION",
          "Digital passport-size photograph.",
        ),

        document(
          "Self-Introduction Video",
          "OTHER",
          "Up to one minute in English.",
        ),

        document(
          "Police Clearance Certificate",
          "OTHER",
          "Police clearance with required apostille or super legalization.",
        ),

        document(
          "Medical Insurance",
          "FINANCIAL_DOCUMENT",
          "Medical insurance.",
        ),

        document(
          "Bank Statement",
          "FINANCIAL_DOCUMENT",
          "Bank statement where required.",
          false,
        ),

        document(
          "Employment Contract",
          "EMPLOYMENT_DOCUMENT",
          "Signed employment contract.",
        ),

        document(
          "MIGRIS Intermediary Letter",
          "EMPLOYMENT_DOCUMENT",
          "Electronic intermediary letter issued by the Lithuanian employer through MIGRIS.",
        ),
      ],

      workflow: [],
    },

    active: true,
  },

  /*
  |--------------------------------------------------------------------------
  | 8. LATVIA
  |--------------------------------------------------------------------------
  */

  {
    countryId: OPPORTUNITY_IDS.LATVIA_WORK,
    countryName: "Latvia",
    countrySlug: "latvia",

    countryFlag: "",
    countryImage: "",

    applicants: "International Workers",

    countryCategories: ["Work", "Employment", "National Visa"],

    countryVisa: "Long-Term National Visa D",
    countryDuration: "1 year",
    countryProcessingTime: "Up to 2 months",

    countryDescription:
      "Latvia work program involving a Long-Term National Visa D with work rights and employer-supported documentation.",

    opportunityScore: "",
    successRate: "",

    featured: false,

    legacyId: OPPORTUNITY_IDS.LATVIA_WORK,

    title: "Latvia Work Program",

    slug: "work-program",

    image: "",

    category: "Work",

    location: "Latvia",

    type: "Employment",

    duration: "1 year",

    icon: "briefcase",

    salary: "",

    demand: "International Workers",

    description:
      "Latvia employment pathway involving a Long-Term National Visa D with work rights, employer documentation and PMLP invitation.",

    highlights: [
      "Long-Term National Visa D with work rights.",
      "Visa stated as valid for one year.",
      "Europass CV.",
      "One-minute English self-introduction video.",
      "Police clearance with applicable apostille or super legalization.",
      "Certified Latvian translation.",
      "Medical insurance.",
      "Employment contract.",
      "Official PMLP invitation.",
      "Accommodation confirmation.",
      "Processing timeline up to two months.",
    ],

    requirements: [
      "Passport.",
      "CV in Europass format.",
      "Passport-size digital photo.",
      "Short self-introduction video in English.",
      "Police Clearance Certificate.",
      "Apostille or super legalization where applicable.",
      "Certified Latvian translation.",
      "Medical insurance.",
      "Bank statement where required.",
      "Visa application form.",
      "Employment contract.",
    ],

    documents: [
      "Passport",
      "Europass CV",
      "Passport-Size Photo",
      "Self-Introduction Video",
      "Police Clearance Certificate",
      "Medical Insurance",
      "Bank Statement",
      "Visa Application Form",
      "Employment Contract",
      "PMLP Invitation",
      "Accommodation Confirmation",
    ],

    benefits: [
      "Employment pathway.",
      "Employer-supported documentation.",
      "PMLP invitation.",
      "Accommodation confirmation.",
      "Long-Term National Visa D pathway.",
      "Residence permit pathway based on continued employment.",
    ],

    steps: [
      {
        title: "Initial Documentation",
        description: "Prepare and submit initial candidate documents.",
        duration: "Initial stage",
      },
      {
        title: "Legalization",
        description:
          "Obtain police clearance and complete required translation and legalization.",
        duration: "Pathway dependent",
      },
      {
        title: "Employment Contract",
        description: "Prepare and sign the employment contract.",
        duration: "Pathway dependent",
      },
      {
        title: "PMLP Application",
        description: "Employer submits the applicable application to PMLP.",
        duration: "Pathway dependent",
      },
      {
        title: "Official Invitation",
        description: "PMLP issues the official invitation reference.",
        duration: "Pathway dependent",
      },
      {
        title: "Embassy Appointment",
        description: "Candidate books the applicable embassy appointment.",
        duration: "Pathway dependent",
      },
      {
        title: "Visa Application",
        description:
          "Candidate submits the visa application and supporting documents.",
        duration: "Final stage",
      },
      {
        title: "Visa Approval",
        description: "Visa is issued after approval.",
        duration: "Final stage",
      },
    ],

    positions: [],

    workConditions: {
      accommodation: "Accommodation confirmation provided.",
      employmentType: "Employment",
      visaType: "Long-Term National Visa D",
    },

    contract: "Employment contract required.",

    faq: [],

    pricing: {
      amount: 8000000,
      currency: "NGN",
      label: "Job Placement & Work Visa Process",
    },

    paymentPlan: [
      {
        stage: "Mobilization",
        percentage: 40,
        currency: "NGN",
        trigger: "At commencement",
      },
      {
        stage: "Offer / Contract / Work Permit",
        percentage: 40,
        currency: "NGN",
        trigger:
          "After receiving offer of employment / contract and work permit documents",
      },
      {
        stage: "Work Visa Approval",
        percentage: 20,
        currency: "NGN",
        trigger: "After work visa approval",
      },
    ],

    terms: [
      ...STRUCTURED_PAYMENT_TERMS,
      "The supplied information states a Long-Term National Visa D valid for one year.",
      "The supplied information states that residence permit applications may be submitted 45–90 days before visa expiry.",
      "Continued employment and a new employer invitation are stated as requirements for extension.",
      "Residence permit duration is dependent on the employment contract.",
    ],

    applicationConfig: {
      steps: ["DOCUMENTS", "REVIEW"],

      questions: [],

      requiredDocuments: [
        document("Passport", "PASSPORT", "Valid passport."),

        document(
          "Europass CV",
          "EMPLOYMENT_DOCUMENT",
          "CV in Europass format.",
        ),

        document(
          "Passport-Size Photo",
          "IDENTIFICATION",
          "Digital passport-size photograph.",
        ),

        document(
          "Self-Introduction Video",
          "OTHER",
          "Up to one minute in English.",
        ),

        document(
          "Police Clearance Certificate",
          "OTHER",
          "Police clearance with applicable apostille or super legalization.",
        ),

        document(
          "Medical Insurance",
          "FINANCIAL_DOCUMENT",
          "Medical insurance.",
        ),

        document(
          "Bank Statement",
          "FINANCIAL_DOCUMENT",
          "Bank statement where required.",
          false,
        ),

        document(
          "Visa Application Form",
          "OTHER",
          "Completed and signed visa application form.",
        ),

        document(
          "Employment Contract",
          "EMPLOYMENT_DOCUMENT",
          "Employment contract.",
        ),

        document(
          "PMLP Invitation",
          "EMPLOYMENT_DOCUMENT",
          "Official invitation issued through PMLP.",
        ),

        document(
          "Accommodation Confirmation",
          "OTHER",
          "Accommodation confirmation.",
        ),
      ],

      workflow: [],
    },

    active: true,
  },
];

/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/

const validateOpportunities = () => {
  const legacyIds = new Set();
  const opportunityKeys = new Set();

  for (const opportunity of opportunities) {
    if (!opportunity.legacyId) {
      throw new Error(`Missing legacyId: ${opportunity.title}`);
    }

    if (legacyIds.has(opportunity.legacyId)) {
      throw new Error(`Duplicate legacyId: ${opportunity.legacyId}`);
    }

    legacyIds.add(opportunity.legacyId);

    const key = `${opportunity.countrySlug}:${opportunity.slug}`;

    if (opportunityKeys.has(key)) {
      throw new Error(`Duplicate country/slug combination: ${key}`);
    }

    opportunityKeys.add(key);

    if (!opportunity.countryName) {
      throw new Error(`Missing countryName: ${opportunity.title}`);
    }

    if (!opportunity.countrySlug) {
      throw new Error(`Missing countrySlug: ${opportunity.title}`);
    }

    if (!opportunity.title) {
      throw new Error(`Missing title for legacyId ${opportunity.legacyId}`);
    }

    if (!opportunity.slug) {
      throw new Error(`Missing slug for ${opportunity.title}`);
    }

    if (
      !opportunity.applicationConfig ||
      !Array.isArray(opportunity.applicationConfig.requiredDocuments)
    ) {
      throw new Error(`Invalid applicationConfig: ${opportunity.title}`);
    }

    for (const doc of opportunity.applicationConfig.requiredDocuments) {
      if (typeof doc.required !== "boolean") {
        throw new Error(
          `Document "${doc.name}" in "${opportunity.title}" has required=${typeof doc.required}. It must be boolean.`,
        );
      }
    }
  }

  console.log(`✅ Validation passed: ${opportunities.length} opportunities.`);
};

/*
|--------------------------------------------------------------------------
| IMPORT
|--------------------------------------------------------------------------
*/

const importOpportunities = async () => {
  validateOpportunities();

  await mongoose.connect(MONGO_URI);

  console.log("✅ Connected to MongoDB.");
  console.log("");

  let created = 0;
  let updated = 0;

  for (const opportunity of opportunities) {
    const existing = await Opportunity.findOne({
      legacyId: opportunity.legacyId,
    }).lean();

    await Opportunity.findOneAndUpdate(
      {
        legacyId: opportunity.legacyId,
      },
      {
        $set: opportunity,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    if (existing) {
      updated += 1;

      console.log(`↻ Updated: ${opportunity.title}`);
    } else {
      created += 1;

      console.log(`✓ Created: ${opportunity.title}`);
    }
  }

  console.log("");
  console.log("==============================================");
  console.log("OPPORTUNITY IMPORT COMPLETE");
  console.log("==============================================");
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Total:   ${opportunities.length}`);
  console.log("==============================================");
};

/*
|--------------------------------------------------------------------------
| RUN
|--------------------------------------------------------------------------
*/

try {
  await importOpportunities();
} catch (error) {
  console.error("");
  console.error("❌ Opportunity import failed.");
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
  console.log("");
  console.log("MongoDB connection closed.");
}
