
import React, { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  MapPinned,
  Users,
  Building2,
  Globe2,
  FileCheck2,
  Wallet,
  Clock3,
  ShieldCheck,
  ChevronDown,
  MessageCircle,
  BookOpen,
  Check,
} from "lucide-react";

import "./CanadaMigration.css";

const PATHWAYS = [
  {
    number: "01",
    category: "PERMANENT RESIDENCE",
    title: "Express Entry",
    description:
      "A federal application management system for skilled workers seeking permanent residence through eligible economic immigration programs.",
    programs: [
      "Federal Skilled Worker Program",
      "Canadian Experience Class",
      "Federal Skilled Trades Program",
    ],
    profile:
      "Skilled professionals with qualifying work experience, language ability, and other required credentials.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
  },
  {
    number: "02",
    category: "PROVINCIAL NOMINATION",
    title: "Provincial Nominee Programs",
    description:
      "Provinces and territories nominate candidates whose qualifications and experience align with their regional economic and demographic priorities.",
    programs: [
      "Province specific immigration streams",
      "Occupation targeted selection",
      "Express Entry aligned streams",
    ],
    profile:
      "Applicants whose skills, experience, or circumstances align with the requirements of a participating province.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html",
  },
  {
    number: "03",
    category: "INTERNATIONAL EDUCATION",
    title: "Study in Canada",
    description:
      "Pursue an eligible academic or professional qualification at a Canadian institution, subject to admission, funding, and study permit requirements.",
    programs: [
      "College and university education",
      "Eligible study permit applications",
      "Potential post graduation options",
    ],
    profile:
      "Students with a credible academic plan, the required admission credentials, and sufficient financial resources.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
  },
  {
    number: "04",
    category: "EMPLOYMENT",
    title: "Work in Canada",
    description:
      "Explore temporary work authorization options based on your circumstances, including employer specific and eligible open work permits.",
    programs: [
      "Employer specific work permits",
      "Eligible open work permits",
      "Labour Market Impact Assessment requirements",
    ],
    profile:
      "People who meet the requirements of an available work permit category, including any applicable employer conditions.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada.html",
  },
  {
    number: "05",
    category: "REGIONAL OPPORTUNITIES",
    title: "Regional Immigration",
    description:
      "Certain Canadian regions operate immigration programs designed to attract qualified workers who can contribute to local communities.",
    programs: [
      "Atlantic Immigration Program",
      "Rural Community Immigration Pilot",
      "Francophone Community Immigration Pilot",
    ],
    profile:
      "Applicants who meet the requirements of a participating regional program, which may include a qualifying job offer.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html",
  },
  {
    number: "06",
    category: "FAMILY REUNIFICATION",
    title: "Family Sponsorship",
    description:
      "Eligible Canadian citizens and permanent residents may sponsor qualifying relatives through designated family immigration programs.",
    programs: [
      "Spouses and common law partners",
      "Dependent children",
      "Other qualifying relatives in specific circumstances",
    ],
    profile:
      "People with an eligible family relationship who meet the relevant sponsorship and application conditions.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship.html",
  },
  {
    number: "07",
    category: "BUSINESS IMMIGRATION",
    title: "Business and Entrepreneur Options",
    description:
      "Business related immigration possibilities depend on the programs currently available and the applicant's business background and circumstances.",
    programs: [
      "Review of current federal programs",
      "Provincial business immigration streams",
      "Applicable investment and business criteria",
    ],
    profile:
      "Entrepreneurs and business owners who meet the requirements of an available program.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html",
  },
  {
    number: "08",
    category: "HUMANITARIAN PROTECTION",
    title: "Refugee and Humanitarian Pathways",
    description:
      "Canada maintains specific refugee protection and humanitarian processes for people who meet the relevant legal requirements.",
    programs: [
      "Refugee resettlement",
      "Applicable protection processes",
      "Specific humanitarian measures where available",
    ],
    profile:
      "People whose circumstances may qualify under a relevant protection or humanitarian process.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees.html",
  },
];

const PROCESS = [
  {
    number: "01",
    title: "Establish your starting point",
    description:
      "Review your age, education, work history, language ability, financial position, family circumstances, and intended destination.",
  },
  {
    number: "02",
    title: "Identify a suitable pathway",
    description:
      "Compare immigration programs against your circumstances. Understand the eligibility criteria and whether the program is accepting applications.",
  },
  {
    number: "03",
    title: "Prepare your application",
    description:
      "Gather the required records, assessments, language results, financial evidence, and supporting documents for your chosen program.",
  },
  {
    number: "04",
    title: "Complete the formal process",
    description:
      "Follow the relevant application procedure. Some routes require a profile, invitation, nomination, admission, or qualifying job offer first.",
  },
  {
    number: "05",
    title: "Undergo assessment",
    description:
      "The relevant Canadian authority reviews your application. Additional documentation, medical examinations, or other checks may be required.",
  },
  {
    number: "06",
    title: "Prepare for the outcome",
    description:
      "If approved, follow the instructions provided and prepare for the next steps associated with your permit or immigration status.",
  },
];

const PREPARATION = [
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "Check the required qualifications and whether your credentials need an assessment or verification.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Professional experience",
    description:
      "Understand how your occupation, employment history, licensing, and skills may affect eligibility.",
  },
  {
    icon: Globe2,
    title: "Language ability",
    description:
      "Some programs require approved language test results in English or French. The required level varies.",
  },
  {
    icon: Wallet,
    title: "Financial readiness",
    description:
      "Budget for application fees, assessments, examinations, tuition where applicable, travel, and settlement expenses.",
  },
  {
    icon: FileCheck2,
    title: "Documentation",
    description:
      "Prepare accurate personal records, educational documents, employment evidence, and other required supporting material.",
  },
  {
    icon: Clock3,
    title: "Timing",
    description:
      "Account for program availability, selection rounds, document preparation, and variable application processing times.",
  },
];

const FAQS = [
  {
    question: "Which Canadian immigration pathway is right for me?",
    answer:
      "That depends on your education, work experience, language ability, financial resources, family circumstances, and objectives. Some applicants may explore skilled worker programs, while others may consider study, employment, provincial nomination, or family sponsorship. The first step is comparing your profile with current program requirements.",
  },
  {
    question: "Can I move to Canada without a job offer?",
    answer:
      "Some pathways do not require a job offer. For example, certain Express Entry programs do not make one mandatory. Other immigration routes, including some regional and employer based programs, may require a qualifying offer or employer involvement.",
  },
  {
    question: "Does studying in Canada guarantee permanent residence?",
    answer:
      "No. Studying in Canada does not automatically lead to permanent residence. Post graduation work authorization depends on the rules in force and your eligibility. A later permanent residence application must independently satisfy the requirements of the selected program.",
  },
  {
    question: "How much money do I need to migrate to Canada?",
    answer:
      "The total depends on your pathway. Expenses may include government fees, language tests, credential assessments, medical examinations, tuition, travel, and settlement funds. Some programs have specific proof of funds requirements, while others apply different rules.",
  },
  {
    question: "How long does the immigration process take?",
    answer:
      "There is no universal timeline. Processing varies by program, application type, individual circumstances, and the relevant authority. Some pathways also involve waiting for an invitation, nomination, admission, or qualifying job offer before applying.",
  },
  {
    question: "Can Colossus guarantee a visa or permanent residence?",
    answer:
      "No. Canadian immigration authorities make the relevant decisions. Colossus does not guarantee visas, permits, invitations, or permanent residence approvals. Any assistance offered should be clearly explained before you commit to a service.",
  },
  {
    question: "How do I explore available Canada migration offers?",
    answer:
      "Visit the Pathways page on the Colossus website to review currently listed opportunities. Read the terms and requirements of each offer carefully and make an enquiry if you need clarification.",
  },
];

const RESOURCES = [
  {
    number: "01",
    title: "Immigration programs",
    description:
      "Review the official programs available to people considering immigration to Canada.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html",
  },
  {
    number: "02",
    title: "Eligibility assessment",
    description:
      "Use the Canadian government's tools to explore potentially relevant programs.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/come-canada-tool.html",
  },
  {
    number: "03",
    title: "Processing information",
    description:
      "Check current estimated processing times for applicable application categories.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html",
  },
  {
    number: "04",
    title: "Government fees",
    description:
      "Verify official application charges before planning your immigration budget.",
    url: "https://ircc.canada.ca/english/information/fees/fees.asp",
  },
];

function CanadaMigration() {
  const [openFaq, setOpenFaq] = useState(0);

  // Update these two routes if your application uses different paths.
  const pathwaysUrl = "/pathways";
  const contactUrl = "/contact";

  return (
    <main className="canada-page">
      {/* HERO */}

      <section className="canada-hero">
        <div className="canada-hero-image" />

        <div className="canada-container canada-hero-layout">
          <div className="canada-hero-content">
            <p className="canada-overline">
              CANADA <span>IMMIGRATION GUIDE</span>
            </p>

            <h1>
              A new chapter.
              <br />
              <span>A considered move.</span>
            </h1>

            <p className="canada-hero-description">
              Canada offers different routes for work, education, family, and
              permanent residence. Understanding the right route begins with
              understanding your options.
            </p>

            <div className="canada-hero-actions">
              <a
                href={pathwaysUrl}
                className="canada-button canada-button-light"
              >
                Explore available pathways
                <ArrowRight size={17} />
              </a>

              <a
                href={contactUrl}
                className="canada-button canada-button-ghost"
              >
                Speak with our team
              </a>
            </div>

            <div className="canada-hero-footnote">
              INFORMATION FOR YOUR NEXT DECISION
            </div>
          </div>

          <div className="canada-hero-caption">
            <span>DESTINATION GUIDE</span>
            <span>CANADA</span>
          </div>
        </div>
      </section>

      {/* EDITORIAL INTRODUCTION */}

      <section className="canada-introduction">
        <div className="canada-container">
          <div className="canada-intro-top">
            <p className="canada-section-index">THE BIG PICTURE</p>

            <div className="canada-intro-copy">
              <h2>
                Moving abroad is a major decision.
                <span> Your route matters.</span>
              </h2>

              <p>
                Canadian immigration is not one application or one universal
                process. Different programs serve different purposes, and each
                comes with its own eligibility rules, costs, and obligations.
              </p>

              <p>
                Whether you are exploring international education, professional
                opportunities, or permanent residence, a sensible starting
                point is understanding what each route requires and whether it
                fits your circumstances.
              </p>
            </div>
          </div>

          <div className="canada-intro-bottom">
            <div className="canada-intro-statement">
              <span className="canada-statement-number">THE PRINCIPLE</span>
              <p>
                Understand the opportunity before committing to the journey.
              </p>
            </div>

            <div className="canada-intro-facts">
              <article>
                <span>01</span>
                <h3>Know your options</h3>
                <p>
                  Compare pathways rather than assuming one route fits everyone.
                </p>
              </article>

              <article>
                <span>02</span>
                <h3>Understand the requirements</h3>
                <p>
                  Review eligibility, documentation, costs, and obligations.
                </p>
              </article>

              <article>
                <span>03</span>
                <h3>Make an informed decision</h3>
                <p>
                  Verify current information before making significant commitments.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* PATHWAY DIRECTORY */}

      <section className="canada-pathways" id="canada-pathways">
        <div className="canada-container">
          <div className="canada-section-heading canada-pathways-heading">
            <div>
              <p className="canada-section-index"> YOUR OPTIONS</p>

              <h2>
                Different routes.
                <br />
                Different requirements.
              </h2>
            </div>

            <div className="canada-section-intro">
              <p>
                These are the principal categories worth understanding when
                exploring Canada. Your suitability depends on the rules of the
                specific program.
              </p>

              <a href={pathwaysUrl} className="canada-text-link">
                Browse listed opportunities <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="canada-pathway-directory">
            {PATHWAYS.map((pathway) => (
              <article
                className="canada-pathway-row"
                key={pathway.number}
              >
                <div className="canada-pathway-number">
                  {pathway.number}
                </div>

                <div className="canada-pathway-main">
                  <span className="canada-pathway-category">
                    {pathway.category}
                  </span>

                  <h3>{pathway.title}</h3>

                  <p>{pathway.description}</p>
                </div>

                <div className="canada-pathway-details">
                  <span className="canada-detail-label">
                    WHAT TO UNDERSTAND
                  </span>

                  <ul>
                    {pathway.programs.map((program) => (
                      <li key={program}>{program}</li>
                    ))}
                  </ul>

                  <p className="canada-profile-note">
                    <strong>May suit</strong>
                    {pathway.profile}
                  </p>

                  <a
                    href={pathway.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="canada-official-link"
                  >
                    Official information <ArrowUpRight size={15} />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="canada-pathways-end">
            <p>
              Not sure which category to investigate first? Start with your
              qualifications, experience, objectives, and available budget.
            </p>

            <a
              href={contactUrl}
              className="canada-button canada-button-dark"
            >
              Make an enquiry <ArrowRight size={16} />
            </a>
          </div>

          <p className="canada-legal-note">
            Pathway descriptions are general information, not an assessment of
            eligibility. Program availability and criteria can change.
            Confirm current requirements with the relevant Canadian authorities.
          </p>
        </div>
      </section>

      {/* PROCESS */}

      <section className="canada-process">
        <div className="canada-container">
          <div className="canada-section-heading canada-process-heading">
            <div>
              <p className="canada-section-index">THE PROCESS</p>

              <h2>
                From initial research
                <br />
                to a formal application.
              </h2>
            </div>

            <p className="canada-section-intro-text">
              The precise steps depend on your chosen program. The following
              sequence illustrates the general journey, not a guarantee of
              eligibility or approval.
            </p>
          </div>

          <div className="canada-process-layout">
            <div className="canada-process-rail">
              <span>THE JOURNEY</span>
              <span>06 STAGES</span>
            </div>

            <div className="canada-process-list">
              {PROCESS.map((step) => (
                <article className="canada-process-step" key={step.number}>
                  <div className="canada-process-number">{step.number}</div>

                  <div className="canada-process-copy">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PREPARATION */}

      <section className="canada-preparation">
        <div className="canada-container">
          <div className="canada-section-heading">
            <p className="canada-section-index">BEFORE YOU BEGIN</p>

            <h2>
              The details that can
              <br />
              shape your options.
            </h2>

            <p className="canada-section-intro-text">
              A strong plan starts with a realistic understanding of your
              qualifications, financial position, and the requirements of the
              route you intend to pursue.
            </p>
          </div>

          <div className="canada-preparation-grid">
            {PREPARATION.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  className="canada-preparation-item"
                  key={item.title}
                >
                  <div className="canada-preparation-icon">
                    <Icon size={21} strokeWidth={1.6} />
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="canada-preparation-note">
            <ShieldCheck size={22} strokeWidth={1.6} />

            <p>
              <strong>One important distinction.</strong> Temporary residence
              and permanent residence are different immigration statuses.
              A study permit or work permit does not automatically lead to
              permanent residence. Any future application must satisfy the
              requirements applicable at that time.
            </p>
          </div>
        </div>
      </section>

      {/* COLOSSUS SERVICE */}

      <section className="canada-service">
        <div className="canada-container canada-service-layout">
          <div className="canada-service-heading">
            <p className="canada-section-index"> WORK WITH COLOSSUS</p>

            <h2>
              Clarity before
              <br />
              commitment.
            </h2>

            <p>
              Every migration journey begins with questions. Colossus provides
              a starting point for exploring available opportunities and
              understanding the next steps.
            </p>

            <a
              href={contactUrl}
              className="canada-button canada-button-light"
            >
              Talk to our team <ArrowRight size={16} />
            </a>
          </div>

          <div className="canada-service-list">
            <article>
              <span>01</span>

              <div>
                <h3>Explore available opportunities</h3>
                <p>
                  Review the Canada related offers listed on our Pathways page,
                  including their stated requirements and conditions.
                </p>
              </div>

              <a href={pathwaysUrl} aria-label="Explore available opportunities">
                <ArrowUpRight size={19} />
              </a>
            </article>

            <article>
              <span>02</span>

              <div>
                <h3>Ask the right questions</h3>
                <p>
                  Make an enquiry about a listed opportunity, the services
                  available, and the information you need before proceeding.
                </p>
              </div>

              <a href={contactUrl} aria-label="Make an enquiry">
                <ArrowUpRight size={19} />
              </a>
            </article>

            <article>
              <span>03</span>

              <div>
                <h3>Discuss your next step</h3>
                <p>
                  Request a consultation to discuss your objectives and the
                  options worth investigating.
                </p>
              </div>

              <a href={contactUrl} aria-label="Request a consultation">
                <ArrowUpRight size={19} />
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ */}

      <section className="canada-faq">
        <div className="canada-container canada-faq-layout">
          <div className="canada-faq-heading">
            <p className="canada-section-index"> COMMON QUESTIONS</p>

            <h2>
              What you may want
              <br />
              to know first.
            </h2>

            <p>
              Useful answers to common questions about Canadian immigration.
              Always confirm details against the rules for your chosen pathway.
            </p>

            <a href={contactUrl} className="canada-text-link">
              Have another question? <ArrowRight size={16} />
            </a>
          </div>

          <div className="canada-faq-list">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <article
                  className={`canada-faq-item ${isOpen ? "is-open" : ""}`}
                  key={faq.question}
                >
                  <button
                    type="button"
                    className="canada-faq-question"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="canada-faq-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="canada-faq-question-text">
                      {faq.question}
                    </span>

                    <ChevronDown size={18} />
                  </button>

                  {isOpen && (
                    <div className="canada-faq-answer">
                      {faq.answer}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* OFFICIAL RESOURCES */}

      <section className="canada-resources">
        <div className="canada-container">
          <div className="canada-resources-heading">
            <p className="canada-section-index"> FURTHER READING</p>

            <h2>Start with reliable information.</h2>

            <p>
              Canadian immigration rules change. These official resources can
              help you verify current requirements, fees, and processing details.
            </p>
          </div>

          <div className="canada-resources-list">
            {RESOURCES.map((resource) => (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="canada-resource-row"
                key={resource.number}
              >
                <span>{resource.number}</span>

                <div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                </div>

                <ArrowUpRight size={20} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="canada-final">
        <div className="canada-container canada-final-layout">
          <div>
            <p className="canada-section-index">YOUR NEXT CHAPTER</p>

            <h2>
              Start with the
              <br />
              right information.
            </h2>

            <p>
              Explore available Canada migration offers or contact Colossus
              to discuss your questions and determine what to investigate next.
            </p>
          </div>

          <div className="canada-final-actions">
            <a
              href={pathwaysUrl}
              className="canada-button canada-button-light"
            >
              Explore Canada offers <ArrowRight size={17} />
            </a>

            <a
              href={contactUrl}
              className="canada-button canada-button-ghost"
            >
              <MessageCircle size={17} />
              Make an enquiry
            </a>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}

      <footer className="canada-disclaimer">
        <div className="canada-container">
          <div className="canada-disclaimer-top">
            <span>COLOSSUS MIGRATION & TOURS</span>
            <span>CANADA INFORMATION GUIDE</span>
          </div>

          <p>
            This page provides general educational information and is not
            immigration or legal advice. Immigration programs, eligibility
            criteria, fees, and processing times may change. Listing a pathway
            does not mean Colossus offers that specific program or that a
            visitor qualifies for it. Verify requirements with the relevant
            Canadian authorities. No visa, permit, invitation, or permanent
            residence approval is guaranteed.
          </p>

          <a
            href="https://www.canada.ca/en/immigration-refugees-citizenship.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Official Canadian immigration website <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
    </main>
  );
}

export default CanadaMigration;

