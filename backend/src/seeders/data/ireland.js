/*
|--------------------------------------------------------------------------
| IRELAND — COUNTRY AND OPPORTUNITY DATA
|--------------------------------------------------------------------------
|
| Source of truth for Ireland's catalogue metadata and offers.
|
| Rules:
| - Every country has a unique numeric ID.
| - Country identity belongs to this country definition.
| - Offer slugs are country-specific.
| - Offer IDs are local identifiers, not MongoDB ObjectIds.
| - Country metadata is not duplicated inside individual offers.
|
*/

const ireland = {
  /*
    |--------------------------------------------------------------------------
    | COUNTRY IDENTITY
    |--------------------------------------------------------------------------
    */

  id: 8,

  name: "Ireland",
  shortName: "Ireland",
  slug: "ireland",

  flag: "🇮🇪",

  /*
    |--------------------------------------------------------------------------
    | COUNTRY PRESENTATION
    |--------------------------------------------------------------------------
    */

  image: "",

  applicants: "1.8k",

  category: ["popular", "work"],

  visa: "Work Permit + Employment Pathway",
  duration: "4–6 Months",
  processingTime: "Standard",

  opportunityScore: "90%",
  successRate: "High",
  featured: true,

  description:
    "Explore employment and migration support for qualified nurses and eligible healthcare professionals seeking opportunities in Ireland, including qualification recognition, professional registration, employment assistance and immigration guidance.",

  /*
    |--------------------------------------------------------------------------
    | OPPORTUNITIES
    |--------------------------------------------------------------------------
    */

  opportunities: [
    {
      /*
            |--------------------------------------------------------------------------
            | OFFER IDENTITY
            |--------------------------------------------------------------------------
            */

      id: 1,

      title: "Ireland Nursing & Healthcare Migration",

      slug: "ireland-nursing-healthcare-migration",

      /*
            |--------------------------------------------------------------------------
            | PRESENTATION
            |--------------------------------------------------------------------------
            */

      image: "",

      icon: "🇮🇪",

      category: "Jobs",

      location: "Ireland",

      type: "Nursing & Healthcare Migration",

      duration: "4–6 Months",

      /*
            |--------------------------------------------------------------------------
            | EMPLOYMENT INFORMATION
            |--------------------------------------------------------------------------
            */

      salary: "€37,000 - €98,000/year",

      demand: "High",

      description:
        "A structured support pathway for qualified nurses and eligible healthcare professionals covering qualification recognition, professional registration, employment assistance, work authorization guidance and relocation preparation. Eligibility and outcomes depend on professional requirements, employer selection and applicable immigration rules.",

      /*
            |--------------------------------------------------------------------------
            | HIGHLIGHTS
            |--------------------------------------------------------------------------
            */

      highlights: [
        "Qualification Recognition Support",
        "Professional Registration Guidance",
        "Job Placement Assistance",
        "Work Visa Application Support",
        "Employer Accommodation Arrangements, Subject to Agreement",
        "Family Immigration Guidance, Subject to Eligibility",
      ],

      /*
            |--------------------------------------------------------------------------
            | AVAILABLE POSITIONS
            |--------------------------------------------------------------------------
            */

      positions: [
        {
          sector: "Nursing",

          roles: ["Registered Nurse", "Qualified Nurse"],
        },

        {
          sector: "Healthcare",

          roles: [
            "Eligible Healthcare Professional",
            "Healthcare Support Roles",
          ],
        },
      ],

      /*
            |--------------------------------------------------------------------------
            | BENEFITS
            |--------------------------------------------------------------------------
            */

      benefits: [
        "Qualification Recognition Support",
        "Professional Registration Guidance",
        "Employment Placement Assistance",
        "Adaptation or Full-Time Employment Pathway, Where Applicable",
        "Work Visa Application Support",
        "Visa Fee Support, Subject to Package Terms",
        "Candidate Interview Preparation",
        "IELTS / OET Preparation Guidance",
        "Employer Accommodation Arrangements, Subject to Agreement",
        "Family Package Options",
      ],

      /*
            |--------------------------------------------------------------------------
            | REQUIREMENTS
            |--------------------------------------------------------------------------
            */

      requirements: [
        "Qualified nurse or eligible healthcare professional",
        "Current nursing licence from NMCN, where applicable",
        "Certificate of Current Professional Status (CCPS) or Certificate of Good Standing, where required",
        "IELTS Academic or Occupational English Test (OET), where required",
        "Relevant nursing education and clinical placement records",
        "Evidence of professional nursing experience, where required",
        "Valid International Passport",
        "Compliance with the applicable professional registration and immigration requirements",
      ],

      /*
            |--------------------------------------------------------------------------
            | PUBLIC DOCUMENT LIST
            |--------------------------------------------------------------------------
            */

      documents: [
        "Updated CV / Resume",
        "Passport Photograph",
        "International Passport Data Page",
        "IELTS Academic or OET Results, where required",
        "Academic Transcripts",
        "Detailed Curriculum / Syllabus, where required",
        "Clinical Placement Records / Hours, where required",
        "Current NMCN Nursing Licence, where applicable",
        "Certificate of Current Professional Status (CCPS) or Certificate of Good Standing, where required",
        "Registration History, where applicable",
        "Employment Reference Letters",
        "Evidence of Nursing Work Experience",
        "Employer Verification Documents, where required",
        "Certified Copies of Required Documents",
        "Postgraduate Qualifications, where applicable",
        "Specialist Certificates, where applicable",
        "Additional documents requested by the relevant registration body, employer or authorities",
      ],

      /*
            |--------------------------------------------------------------------------
            | MIGRATION JOURNEY
            |--------------------------------------------------------------------------
            */

      steps: [
        {
          title: "Document Submission",

          description:
            "Submit the documents currently available for initial review. Outstanding documents can be identified and arranged according to the requirements of each stage.",
        },

        {
          title: "Service Level Agreement",

          description:
            "Review and formalize the engagement through a Service Level Agreement that defines the services, fees, payment milestones and applicable terms.",
        },

        {
          title: "Initial Mobilisation",

          description:
            "Complete the agreed initial mobilisation payment before the contracted registration and processing services begin.",
        },

        {
          title: "Qualification Recognition & Registration",

          description:
            "Prepare the documents required for qualification recognition and proceed with the applicable professional registration process.",
        },

        {
          title: "Employment Placement",

          description:
            "Receive assistance identifying suitable employment opportunities, subject to employer requirements and successful selection.",
        },

        {
          title: "Work Visa & Immigration Processing",

          description:
            "Prepare and submit the applicable employment permit or immigration applications and supporting documents.",
        },

        {
          title: "Relocation Preparation",

          description:
            "Complete outstanding documentation and prepare relocation arrangements after the necessary approvals have been obtained.",
        },
      ],

      /*
            |--------------------------------------------------------------------------
            | PRICING
            |--------------------------------------------------------------------------
            */

      pricing: {
        total: "₦15,000,000",

        currency: "NGN",

        includes: [
          "Qualification Recognition and Registration Service",
          "Applicable NMBI Fees, as specified in the agreement",
          "Job Placement Service",
          "Employment / Adaptation Pathway Support",
          "Work Visa Application Service",
          "Applicable Visa Fees, as specified in the agreement",
        ],
      },

      /*
            |--------------------------------------------------------------------------
            | PAYMENT PLAN
            |--------------------------------------------------------------------------
            */

      paymentPlan: [
        {
          stage: "Mobilisation for Registration with NMBI",

          amount: "₦3,000,000",
        },

        {
          stage: "After Registration / NMBI Decision Letter",

          amount: "₦5,000,000",
        },

        {
          stage:
            "After Job Offer + Employment Contract / Work Permit Documents",

          amount: "₦5,000,000",
        },

        {
          stage: "After Work-to-Enter Ireland Documentation",

          amount: "₦2,000,000",
        },
      ],

      /*
            |--------------------------------------------------------------------------
            | FAMILY PACKAGE
            |--------------------------------------------------------------------------
            */

      familyPackage: {
        spouse: "+₦3,000,000",

        child: "+₦1,000,000 per child",
      },

      /*
            |--------------------------------------------------------------------------
            | TERMS AND CONDITIONS
            |--------------------------------------------------------------------------
            */

      terms: [
        "Candidates must satisfy the applicable professional registration, employment and immigration requirements.",
        "Candidates may begin by submitting the documents currently available to them, subject to the requirements of the relevant stage.",
        "Outstanding documents may be arranged during the application process where permitted by the applicable requirements.",
        "Processing begins after the Service Level Agreement is completed and the agreed initial mobilisation payment is made.",
        "Employment placement depends on employer availability, candidate suitability and successful recruitment.",
        "Accommodation arrangements are subject to the employer's offer and written agreement.",
        "Processing timelines may vary depending on professional registration, documentation, employment and immigration procedures.",
        "Colossus Migration & Tours provides the documentation and preparation services expressly included in the signed agreement.",
        "Language tests, professional assessments and third-party charges must be confirmed in the package terms.",
        "Family applications are subject to individual eligibility and the agreed additional package costs.",
        "Professional registration, employment permit and immigration decisions are made by the relevant bodies and authorities.",
        "Payment milestones and the specific services included must be documented in the signed agreement.",
      ],
    },
  ],
};

export default ireland;
