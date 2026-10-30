import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Globe2,
  GraduationCap,
  BriefcaseBusiness,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Users,
  Wrench,
  FileText,
  MapPin,
  X,
  CheckCircle2,
  Upload,
} from "lucide-react";

import api from "../../services/api";
import "./Services.css";

/* -------------------------------------------------------------------------- */
/* SERVICES                                                                   */
/* -------------------------------------------------------------------------- */

const services = [
  {
    id: "01",
    title: "International Recruitment & Overseas Jobs",
    description:
      "Explore advertised international vacancies across selected industries and countries. We assist suitable candidates with application preparation, employer recruitment processes and relevant relocation requirements.",
    note: "For qualified professionals, skilled workers and eligible applicants.",
    category: "CAREER OPPORTUNITIES",
    icon: BriefcaseBusiness,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "02",
    title: "Study Abroad & Education Consulting",
    description:
      "Find courses and institutions aligned with your academic background, career ambitions and budget. Get guidance on admission applications, tuition planning, documentation and applicable student visa requirements.",
    note:
      "Explore study options in Australia, New Zealand, Canada, the UK, Ireland and other destinations.",
    category: "GLOBAL EDUCATION",
    icon: GraduationCap,
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "03",
    title: "Professional & Skilled Migration",
    description:
      "Explore relevant opportunities for teachers, healthcare professionals, engineers, tradespeople and other skilled workers. We help you assess potential pathways and understand qualifications, registration, experience and immigration criteria.",
    note:
      "Every pathway depends on the destination country's rules and your individual circumstances.",
    category: "SKILLED IMMIGRATION",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "04",
    title: "Trainee, Apprenticeship & Trades Programs",
    description:
      "Explore eligible vocational training, practical skills development and apprenticeship opportunities in Australia and New Zealand, where suitable programs and lawful visa pathways are available.",
    note: "Program availability, entry requirements and work rights vary.",
    category: "SKILLS & DEVELOPMENT",
    icon: Wrench,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "05",
    title: "Immigration & Relocation Consulting",
    description:
      "Get help understanding relevant visa categories, eligibility criteria, supporting documents, application procedures and relocation considerations for your intended destination.",
    note: "Visa decisions remain with the relevant government authorities.",
    category: "IMMIGRATION GUIDANCE",
    icon: FileText,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=90",
  },
];

/* -------------------------------------------------------------------------- */
/* SERVICE DETAILS                                                            */
/* -------------------------------------------------------------------------- */

const serviceDetails = {
  "01": {
    heading: "Find international career opportunities",
    intro:
      "Tell us about your professional background and the kind of role you are looking for. Our team can help you review relevant advertised vacancies and understand the application process.",
    points: [
      "Explore advertised vacancies across selected industries and destinations.",
      "Get guidance on CV preparation and application requirements.",
      "Understand employer recruitment steps and relevant relocation considerations.",
    ],
    pathway: "Explore available overseas job opportunities",
    fields: [
      {
        name: "industry",
        label: "Your industry",
        type: "select",
        required: true,
        options: [
          "Healthcare",
          "Engineering",
          "Construction & Trades",
          "IT & Technology",
          "Hospitality",
          "Education",
          "Logistics",
          "Other",
        ],
      },
      {
        name: "jobRole",
        label: "Job title / role you are interested in",
        type: "text",
        required: true,
        placeholder: "e.g. Registered Nurse, Electrician",
      },
      {
        name: "experience",
        label: "Years of work experience",
        type: "select",
        required: true,
        options: [
          "No experience",
          "Less than 1 year",
          "1–2 years",
          "3–5 years",
          "6–10 years",
          "More than 10 years",
        ],
      },
      {
        name: "destination",
        label: "Preferred destination",
        type: "select",
        required: true,
        options: [
          "Australia",
          "Canada",
          "New Zealand",
          "United Kingdom",
          "Ireland",
          "Open to options",
        ],
      },
      {
        name: "cv",
        label: "Upload your CV (optional)",
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
    ],
  },

  "02": {
    heading: "Plan your study abroad journey",
    intro:
      "Share what you would like to study, where you hope to study and your current academic position. We will use this information to understand your goals and the guidance you may need.",
    points: [
      "Explore courses and institutions that align with your academic background.",
      "Discuss tuition planning, admission requirements and possible intakes.",
      "Understand the documentation and student visa requirements relevant to your destination.",
    ],
    pathway: "Explore study programmes and education opportunities",
    fields: [
      {
        name: "studyLevel",
        label: "What level do you want to study?",
        type: "select",
        required: true,
        options: [
          "Foundation / Pathway",
          "Undergraduate",
          "Postgraduate / Master's",
          "PhD / Doctorate",
          "Diploma / Certificate",
          "Other",
        ],
      },
      {
        name: "course",
        label: "What do you want to study?",
        type: "text",
        required: true,
        placeholder: "e.g. Nursing, Computer Science, Business",
      },
      {
        name: "destination",
        label: "Country of choice",
        type: "select",
        required: true,
        options: [
          "Australia",
          "Canada",
          "New Zealand",
          "United Kingdom",
          "Ireland",
          "United States",
          "Not decided",
        ],
      },
      {
        name: "qualification",
        label: "Your highest qualification",
        type: "select",
        required: true,
        options: [
          "SSCE / WAEC / NECO",
          "OND",
          "HND",
          "Bachelor's degree",
          "Master's degree",
          "Other",
        ],
      },
      {
        name: "budget",
        label: "Estimated tuition budget",
        type: "select",
        required: true,
        options: [
          "Below ₦2 million",
          "₦2m – ₦5m",
          "₦5m – ₦10m",
          "₦10m – ₦20m",
          "Above ₦20m",
          "I need guidance",
        ],
      },
      {
        name: "intake",
        label: "When do you plan to start?",
        type: "select",
        required: true,
        options: [
          "Next available intake",
          "Within 6 months",
          "Within 12 months",
          "More than 12 months",
          "Not sure",
        ],
      },
      {
        name: "documents",
        label: "Upload supporting documents (optional)",
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png",
        multiple: true,
      },
    ],
  },

  "03": {
    heading: "Assess your skilled migration profile",
    intro:
      "Skilled migration pathways depend on your occupation, qualifications, work history, professional registration and the rules of each destination. Give us a clear picture of your current profile so we can understand what you may need to explore.",
    points: [
      "Share your occupation, qualifications and relevant work experience.",
      "Tell us about professional licences, registrations and certificates you hold.",
      "Explore potential pathways subject to destination-country eligibility rules.",
    ],
    pathway: "Explore skilled migration pathways and opportunities",
    fields: [
      {
        name: "occupation",
        label: "Your occupation / profession",
        type: "text",
        required: true,
        placeholder: "e.g. Civil Engineer, Teacher, Nurse",
      },
      {
        name: "experience",
        label: "Years of relevant work experience",
        type: "select",
        required: true,
        options: [
          "No experience",
          "Less than 1 year",
          "1–2 years",
          "3–5 years",
          "6–10 years",
          "More than 10 years",
        ],
      },
      {
        name: "qualification",
        label: "Highest relevant qualification",
        type: "text",
        required: true,
        placeholder: "e.g. BSc Nursing, HND Mechanical Engineering",
      },
      {
        name: "certificates",
        label: "Professional certificates / licences / registrations",
        type: "textarea",
        required: true,
        placeholder:
          "List certificates, licences, professional body memberships or write None.",
      },
      {
        name: "destination",
        label: "Preferred destination",
        type: "select",
        required: true,
        options: [
          "Australia",
          "Canada",
          "New Zealand",
          "United Kingdom",
          "Ireland",
          "Open to options",
        ],
      },
      {
        name: "cv",
        label: "Upload your CV (optional)",
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        name: "documents",
        label: "Upload certificates or licences (optional)",
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png",
        multiple: true,
      },
    ],
  },

  "04": {
    heading: "Tell us about your training goals",
    intro:
      "Let us know which practical skill or trade you want to develop and your current experience. We can help you understand relevant trainee, apprenticeship and vocational programme options where available.",
    points: [
      "Explore practical training and apprenticeship programme options.",
      "Understand entry requirements and the documents you may need.",
      "Review destination-specific programme availability and lawful visa considerations.",
    ],
    pathway: "Explore trainee, apprenticeship and trades opportunities",
    fields: [
      {
        name: "trade",
        label: "What skill or trade interests you?",
        type: "text",
        required: true,
        placeholder: "e.g. Welding, Plumbing, Electrical Installation",
      },
      {
        name: "experience",
        label: "Your current experience",
        type: "select",
        required: true,
        options: [
          "Beginner / No experience",
          "Some practical experience",
          "1–2 years",
          "3–5 years",
          "More than 5 years",
        ],
      },
      {
        name: "training",
        label: "What are you looking for?",
        type: "select",
        required: true,
        options: [
          "Trainee programme",
          "Apprenticeship",
          "Vocational training",
          "Skills development",
          "Not sure yet",
        ],
      },
      {
        name: "destination",
        label: "Preferred destination",
        type: "select",
        required: true,
        options: ["Australia", "New Zealand", "Open to options"],
      },
      {
        name: "background",
        label: "Tell us briefly about your education or practical training",
        type: "textarea",
        required: true,
        placeholder:
          "Share any relevant education, informal training or hands-on experience.",
      },
      {
        name: "documents",
        label: "Upload supporting documents (optional)",
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png",
        multiple: true,
      },
    ],
  },

  "05": {
    heading: "Immigration & relocation consultation",
    intro:
      "A focused consultation to help you understand your immigration options, the requirements that may apply to your circumstances and the practical steps involved in planning your move.",
    points: [
      "Discuss your destination, goals and current circumstances.",
      "Understand relevant visa categories, eligibility considerations and supporting documents.",
      "Review application-process questions and important relocation considerations.",
      "Identify practical next steps and areas that may require further assessment.",
    ],
    pathway: "Book a consultation with our team",
    consultation: true,
    fields: [],
  },
};

/* -------------------------------------------------------------------------- */
/* COMMON FORM FIELDS                                                         */
/* -------------------------------------------------------------------------- */

const commonFields = [
  {
    name: "fullName",
    label: "Full name",
    type: "text",
    required: true,
    placeholder: "Enter your full name",
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    required: true,
    placeholder: "you@example.com",
  },
  {
    name: "phone",
    label: "Phone / WhatsApp number",
    type: "tel",
    required: true,
    placeholder: "+234...",
  },
  {
    name: "residence",
    label: "Country of residence",
    type: "text",
    required: true,
    placeholder: "e.g. Nigeria",
  },
];

/* -------------------------------------------------------------------------- */
/* DESTINATIONS                                                               */
/* -------------------------------------------------------------------------- */

const destinations = [
  {
    name: "Australia",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=85",
    link: "/opportunities/australia",
  },
  {
    name: "Canada",
    image:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=600&q=85",
    link: "/opportunities/canada",
  },
  {
    name: "United Kingdom",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=85",
    link: "/opportunities/united-kingdom",
  },
  {
    name: "New Zealand",
    image:
      "https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=600&q=85",
    link: "/opportunities/new-zealand",
  },
  {
    name: "Ireland",
    image:
      "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=600&q=85",
    link: "/opportunities/ireland",
  },
];

/* -------------------------------------------------------------------------- */
/* VALUES                                                                     */
/* -------------------------------------------------------------------------- */

const values = [
  {
    icon: HeartHandshake,
    title: "Expert Guidance",
    description: "Clear information at every stage.",
  },
  {
    icon: Users,
    title: "Personalised Support",
    description: "Guidance built around your goals.",
  },
  {
    icon: Globe2,
    title: "Global Opportunities",
    description: "Explore possibilities worldwide.",
  },
  {
    icon: ShieldCheck,
    title: "End-to-End Assistance",
    description: "Support throughout your journey.",
  },
];

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const Services = () => {
  const [activeService, setActiveService] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const openServiceModal = (service) => {
    setActiveService(service);
    setSubmitted(false);
    setSubmitting(false);
    setSubmissionError("");
  };

  const closeServiceModal = () => {
    if (submitting) return;

    setActiveService(null);
    setSubmitted(false);
    setSubmissionError("");
  };

  useEffect(() => {
    if (!activeService) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeServiceModal();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeService, submitting]);

  /* ------------------------------------------------------------------------ */
  /* SUBMIT SERVICE ENQUIRY                                                   */
  /* ------------------------------------------------------------------------ */

  const handleInterestSubmit = async (event) => {
    event.preventDefault();

    if (!activeService || submitting) return;

    setSubmitting(true);
    setSubmissionError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const uploadData = new FormData();

    const serviceTypeMap = {
      "01": "INTERNATIONAL_RECRUITMENT",
      "02": "STUDY_ABROAD",
      "03": "SKILLED_MIGRATION",
      "04": "TRAINEE_APPRENTICESHIP",
    };

    try {
      const serviceType = serviceTypeMap[activeService.id];

      if (!serviceType) {
        throw new Error("This service does not accept online enquiries.");
      }

      const applicant = {
        fullName: formData.get("fullName")?.trim(),
        email: formData.get("email")?.trim(),
        phone: formData.get("phone")?.trim(),
        countryOfResidence: formData.get("residence")?.trim(),
      };

      let enquiryData = {};

      const appendFiles = (fieldName, uploadField) => {
        const files = formData.getAll(uploadField);

        files.forEach((file) => {
          if (file instanceof File && file.size > 0) {
            uploadData.append(fieldName, file);
          }
        });
      };

      if (activeService.id === "01") {
        enquiryData = {
          industryOfInterest: formData.get("industry"),
          preferredJobRole: formData.get("jobRole"),
          workExperience: formData.get("experience"),
          preferredDestination: formData.get("destination"),
        };

        appendFiles("cv", "cv");
      }

      if (activeService.id === "02") {
        enquiryData = {
          intendedCourse: formData.get("course"),
          preferredCountry: formData.get("destination"),
          currentEducationLevel: formData.get("studyLevel"),
          highestQualification: formData.get("qualification"),
          tuitionBudget: formData.get("budget"),
          intendedIntake: formData.get("intake"),
        };

        appendFiles("supportingDocuments", "documents");
      }

      if (activeService.id === "03") {
        enquiryData = {
          currentOccupation: formData.get("occupation"),
          yearsOfExperience: formData.get("experience"),
          highestQualification: formData.get("qualification"),
          preferredDestination: formData.get("destination"),
          professionalCertificates: formData.get("certificates"),
        };

        appendFiles("cv", "cv");
        appendFiles("certificates", "documents");
      }

      if (activeService.id === "04") {
        enquiryData = {
          preferredField: formData.get("trade"),
          previousWorkExperience: formData.get("experience"),
          programmeInterest: formData.get("training"),
          preferredDestination: formData.get("destination"),
          educationBackground: formData.get("background"),
        };

        appendFiles("supportingDocuments", "documents");
      }

      const enquiry = {
        serviceType,
        applicant,
        enquiryData,
        source: "WEBSITE",
      };

      uploadData.append("enquiry", JSON.stringify(enquiry));

      const response = await api.post(
        "/service-enquiries",
        uploadData
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to submit your enquiry."
        );
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Service enquiry submission error:", error);

      const backendErrors = error.response?.data?.errors;

      setSubmissionError(
        Array.isArray(backendErrors)
          ? backendErrors.join(", ")
          : error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* FORM FIELD RENDERER                                                      */
  /* ------------------------------------------------------------------------ */

  const renderField = (field) => (
    <div
      className={`service-form-field ${field.type === "textarea" ? "service-form-field-full" : ""
        }`}
      key={field.name}
    >
      <label htmlFor={`service-${field.name}`}>
        {field.label}
        {field.required && <span> *</span>}
      </label>

      {field.type === "select" ? (
        <select
          id={`service-${field.name}`}
          name={field.name}
          required={field.required}
        >
          <option value="">Select an option</option>

          {field.options.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          id={`service-${field.name}`}
          name={field.name}
          rows="3"
          placeholder={field.placeholder}
          required={field.required}
        />
      ) : (
        <input
          id={`service-${field.name}`}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          accept={field.accept}
          multiple={field.multiple}
          required={field.required}
        />
      )}

      {field.type === "file" && (
        <small className="service-file-hint">
          <Upload size={13} />
          Accepted formats:{" "}
          {field.accept?.replaceAll(".", "").replaceAll(",", ", ")}
        </small>
      )}
    </div>
  );

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="services-page">
      {/* HERO */}

      <section className="services-hero">
        <div className="services-hero-background">
          <img
            src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=2200&q=90"
            alt="Beautiful international destination surrounded by nature"
          />
        </div>

        <div className="services-hero-shade"></div>

        <div className="services-hero-inner">
          <div className="services-hero-copy">
            <h1>
              More
              <br />
              Than a Destination.
              <br />
              <em>A Brighter You.</em>
            </h1>

            <p>
              From global careers and world-class education to skilled
              migration and relocation our services are designed to help
              you unlock opportunities and build the future you deserve.
            </p>

            <a href="#services-showcase" className="services-primary-button">
              Explore All Our Services
              <ArrowRight size={17} />
            </a>

            <div className="services-hero-trust">
              <div className="services-avatar-stack">
                {[1, 2, 3, 4].map((item) => (
                  <img
                    key={item}
                    src={`https://i.pravatar.cc/80?img=${item + 20}`}
                    alt=""
                  />
                ))}
              </div>

              <div>
                <strong>Every journey begins somewhere.</strong>
                <span>We're here to help you take the next step.</span>
              </div>
            </div>
          </div>

          <div className="services-hero-side">
            <span className="services-handwritten">
              New
              <br />
              Beginnings.
              <br />
              Worldwide.
            </span>

            <div className="services-hero-explore">
              <span>EXPLORE DESTINATIONS</span>

              <div className="services-mini-images">
                <img
                  src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=200&q=80"
                  alt="Australia"
                />
                <img
                  src="https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=200&q=80"
                  alt="Canada"
                />
              </div>

              <a href="#popular-destinations" aria-label="Explore destinations">
                <ArrowRight size={19} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}

      <section className="services-philosophy">
        <div className="services-philosophy-content">
          <div className="services-philosophy-heading">
            <h2>
              Guiding People
              <br />
              To Global Opportunities
            </h2>

            <p>
              We provide specialist guidance across international recruitment,
              education, skilled migration, training and relocation helping
              you make informed decisions and take confident steps toward
              a brighter future.
            </p>
          </div>

          <div className="services-world-map">
            <div className="services-map-image">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1100&q=85"
                alt="World map representing global opportunities"
              />
            </div>

            <div className="services-map-note">
              <Globe2 size={25} />
              <span>Real Opportunities.</span>
              <span>Real People.</span>
              <span>Real Global Impact.</span>
            </div>
          </div>
        </div>

        <div className="services-values">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <div className="services-value-item" key={index}>
                <div className="services-value-icon">
                  <Icon size={19} />
                </div>

                <div>
                  <strong>{value.title}</strong>
                  <span>{value.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SERVICES SHOWCASE */}

      <section className="services-showcase" id="services-showcase">
        <div className="services-showcase-header">
          <div>
            <h2>
              Explore
              <br />
              Our Services
            </h2>
          </div>

          <div className="services-showcase-description">
            <div className="services-showcase-arrows">
              <button
                type="button"
                aria-label="Previous services"
                onClick={() => {
                  document
                    .querySelector(".services-cards-track")
                    ?.scrollBy({ left: -320, behavior: "smooth" });
                }}
              >
                <ArrowLeft size={17} />
              </button>

              <button
                type="button"
                aria-label="Next services"
                onClick={() => {
                  document
                    .querySelector(".services-cards-track")
                    ?.scrollBy({ left: 320, behavior: "smooth" });
                }}
              >
                <ArrowRight size={17} />
              </button>
            </div>

            <p>
              Different paths. A brighter future.
              <br />
              Whatever your ambition, there's a pathway
              worth exploring.
            </p>
          </div>
        </div>

        <div className="services-cards-track">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article className="services-editorial-card" key={service.id}>
                <div className="services-card-image">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                  />

                  <span className="services-card-number">
                    {service.id}
                  </span>

                  <div className="services-card-icon">
                    <Icon size={21} />
                  </div>
                </div>

                <div className="services-card-body">
                  <span className="services-card-category">
                    {service.category}
                  </span>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <span className="services-card-note">
                    {service.note}
                  </span>

                  <button
                    type="button"
                    className="services-learn-more"
                    onClick={() => openServiceModal(service)}
                    aria-label={`Learn more about ${service.title}`}
                  >
                    LEARN MORE
                    <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* AMBITIONS */}

      <section className="services-ambitions">
        <div className="services-ambitions-image">
          <img
            src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=90"
            alt="Traveller discovering a beautiful international destination"
            loading="lazy"
          />

          <div className="services-image-caption">
            A WORLD OF NEW POSSIBILITIES
          </div>
        </div>

        <div className="services-ambitions-content">
          <h2>
            Your Ambitions
            <br />
            Belong Here.
          </h2>

          <p>
            No matter where you are in your journey, the right opportunity
            can open doors to a brighter, more fulfilling future.
            We're here to help you explore what's possible.
          </p>

          <div className="services-ambitions-testimonial">
            <div className="services-testimonial-avatar">
              <img
                src="https://i.pravatar.cc/120?img=47"
                alt="Client portrait"
                loading="lazy"
              />
            </div>

            <div className="services-testimonial-copy">
              <span className="services-testimonial-label">
                A JOURNEY WORTH SHARING
              </span>

              <p>
                Your international journey deserves careful planning,
                informed decisions and the right guidance at every step.
              </p>

              <strong>
                THE COLOSSUS APPROACH
                <span>Personalised guidance. Informed decisions.</span>
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}

      <section className="services-story">
        <div className="services-story-background">
          <img
            src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1800&q=90"
            alt="Portrait representing the people behind every journey"
            loading="lazy"
          />
        </div>

        <div className="services-story-overlay"></div>

        <div className="services-story-content">
          <h2>
            Real People.
            <br />
            Real <em>Journeys.</em>
          </h2>

          <p>
            Behind every application is a person.
            Behind every ambition is a story.
            And behind every great journey is a decision to begin.
          </p>

          <div className="services-story-values">
            <div>
              <Globe2 size={22} />
              <strong>Global</strong>
              <span>Opportunities</span>
            </div>

            <div>
              <HeartHandshake size={22} />
              <strong>Personal</strong>
              <span>Guidance</span>
            </div>

            <div>
              <ShieldCheck size={22} />
              <strong>Informed</strong>
              <span>Decisions</span>
            </div>
          </div>
        </div>

        <div className="services-story-side">
          <span>YOUR STORY MATTERS.</span>
        </div>
      </section>

      {/* DESTINATIONS */}

      <section className="services-destinations" id="popular-destinations">
        <div className="services-destinations-heading">
          <h2>
            Popular Destinations
            <br />
            For Our Clients
          </h2>

          <p>
            From world-class education to exciting career opportunities,
            explore some of the destinations we support.
          </p>

          <a href="/pathways" className="services-text-link">
            VIEW ALL DESTINATIONS
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="services-destination-gallery">
          {destinations.map((destination, index) => (
            <a
              href={destination.link}
              className="services-destination-card"
              key={destination.name}
            >
              <img
                src={destination.image}
                alt={destination.name}
                loading="lazy"
              />

              <div className="services-destination-overlay"></div>

              <span className="services-destination-number">
                0{index + 1}
              </span>

              <div className="services-destination-name">
                <span>{destination.name}</span>
                <ArrowUpRight size={17} />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="services-final-cta">
        <div className="services-final-background">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=90"
            alt="Majestic mountains representing new horizons"
            loading="lazy"
          />
        </div>

        <div className="services-final-overlay"></div>

        <div className="services-final-content">
          <div className="services-final-copy">
            <h2>
              Ready to
              <br />
              Explore More?
            </h2>

            <p>
              Let's discuss your goals and explore the opportunities
              that align with your future.
            </p>

            <a href="/contact" className="services-primary-button">
              Explore All Our Services
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="services-final-promises">
            <div>
              <HeartHandshake size={20} />
              <span>Personalised Guidance</span>
            </div>

            <div>
              <ShieldCheck size={20} />
              <span>Informed Support</span>
            </div>

            <div>
              <Globe2 size={20} />
              <span>Global Opportunities</span>
            </div>

            <div>
              <Compass size={20} />
              <span>Guidance Along the Way</span>
            </div>
          </div>
        </div>

        <div className="services-final-bottom">
          <span>COLOSSUS MIGRATIONS & TOURS</span>
          <span>MORE THAN A DESTINATION. A BRIGHTER YOU.</span>
        </div>
      </section>

      {/* SERVICE MODAL */}

      {activeService &&
        (() => {
          const detail = serviceDetails[activeService.id];
          const Icon = activeService.icon;

          return (
            <div
              className="service-modal-backdrop"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeServiceModal();
                }
              }}
            >
              <section
                className="service-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="service-modal-title"
              >
                <button
                  type="button"
                  className="service-modal-close"
                  onClick={closeServiceModal}
                  aria-label="Close service details"
                  disabled={submitting}
                >
                  <X size={21} />
                </button>

                <div className="service-modal-layout">
                  <div className="service-modal-information">
                    <span className="service-modal-kicker">
                      <Icon size={16} />
                      SERVICE {activeService.id} · {activeService.category}
                    </span>

                    <h2 id="service-modal-title">{detail.heading}</h2>

                    <p className="service-modal-intro">{detail.intro}</p>

                    <div className="service-modal-benefits">
                      <h3>How we can help</h3>

                      {detail.points.map((point) => (
                        <div className="service-modal-benefit" key={point}>
                          <CheckCircle2 size={18} />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    <div className="service-modal-pathway">
                      <span>YOUR NEXT STEP</span>
                      <strong>{detail.pathway}</strong>

                      <p>
                        {detail.consultation
                          ? "Choose a convenient next step to arrange a focused discussion with our team."
                          : "Share your details in the form and our team can understand your interests and the support you are looking for."}
                      </p>
                    </div>

                    {detail.consultation && (
                      <div className="service-consultation-fee">
                        <span>CONSULTATION FEE</span>
                        <strong>₦50,000</strong>
                        <p>
                          The consultation fee is ₦50,000. Visit the
                          consultation page for the booking process and
                          further details.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="service-modal-form-panel">
                    {detail.consultation ? (
                      <div className="service-consultation-panel">
                        <div className="service-form-heading">
                          <span>PERSONALISED IMMIGRATION GUIDANCE</span>
                          <h3>What your consultation covers</h3>
                          <p>
                            A dedicated discussion focused on your plans
                            and questions.
                          </p>
                        </div>

                        <div className="service-consultation-agenda">
                          {[
                            "Your intended destination and migration goals",
                            "Relevant visa routes and eligibility considerations",
                            "Required documents and application preparation",
                            "Potential challenges and practical next steps",
                            "Relocation planning and questions you need answered",
                          ].map((item) => (
                            <div
                              className="service-modal-benefit"
                              key={item}
                            >
                              <CheckCircle2 size={18} />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        <a
                          href="/consultation"
                          className="service-form-submit service-consultation-link"
                        >
                          BOOK A CONSULTATION
                          <ArrowRight size={17} />
                        </a>

                        <p className="service-form-privacy">
                          Consultation fee: ₦50,000. Booking and payment
                          instructions are provided on the consultation page.
                        </p>
                      </div>
                    ) : !submitted ? (
                      <>
                        <div className="service-form-heading">
                          <span>LET'S GET STARTED</span>
                          <h3>Register your interest</h3>
                          <p>Fields marked with * are required.</p>
                        </div>

                        <form
                          className="service-interest-form"
                          onSubmit={handleInterestSubmit}
                        >
                          <div className="service-form-grid">
                            {commonFields.map(renderField)}
                            {detail.fields.map(renderField)}
                          </div>

                          <label className="service-consent">
                            <input
                              type="checkbox"
                              name="consent"
                              value="yes"
                              required
                            />

                            <span>
                              I agree that Colossus Migrations & Tours may
                              contact me about this enquiry.
                            </span>
                          </label>

                          {submissionError && (
                            <div
                              className="service-form-error"
                              role="alert"
                            >
                              {submissionError}
                            </div>
                          )}

                          <button
                            type="submit"
                            className="service-form-submit"
                            disabled={submitting}
                          >
                            {submitting ? (
                              "SUBMITTING ENQUIRY..."
                            ) : (
                              <>
                                SUBMIT MY INTEREST
                                <ArrowRight size={17} />
                              </>
                            )}
                          </button>

                          <p className="service-form-privacy">
                            Your information will be used to review and
                            respond to this enquiry.
                          </p>
                        </form>
                      </>
                    ) : (
                      <div className="service-form-success" role="status">
                        <div className="service-success-icon">
                          <CheckCircle2 size={34} />
                        </div>

                        <span>ENQUIRY SUBMITTED</span>

                        <h3>Thank you for your interest.</h3>

                        <p>
                          Your enquiry has been successfully received by
                          Colossus Migrations & Tours. Our team will review
                          your information and contact you.
                        </p>

                        <button
                          type="button"
                          onClick={closeServiceModal}
                        >
                          CLOSE
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          );
        })()}
    </main>
  );
};

export default Services;