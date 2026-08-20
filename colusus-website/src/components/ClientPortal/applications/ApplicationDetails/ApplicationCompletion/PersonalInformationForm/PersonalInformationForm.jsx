import { useEffect, useState } from "react";

import {
    HiOutlineCheckCircle,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineLocationMarker,
    HiOutlineUser,
} from "react-icons/hi";

import "./PersonalInformationForm.css";


const DEFAULT_FORM = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    gender: "",
    phone: "",
    email: "",
    currentCountry: "",
    address: "",
};


const PersonalInformationForm = ({
    application,
    onSave,
    saving = false,
}) => {

    const [form, setForm] =
        useState(DEFAULT_FORM);

    const [errors, setErrors] =
        useState({});

    const [saved, setSaved] =
        useState(false);


    /* ============================================================
       INITIALIZE FROM APPLICATION
    ============================================================ */

    useEffect(() => {

        const personalInformation =
            application?.personalInformation;

        if (
            personalInformation &&
            typeof personalInformation === "object"
        ) {

            setForm({
                ...DEFAULT_FORM,
                ...personalInformation,
            });

        }

    }, [application]);


    /* ============================================================
       CHANGE
    ============================================================ */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));


        setSaved(false);


        if (errors[name]) {

            setErrors((previous) => {

                const next = {
                    ...previous,
                };

                delete next[name];

                return next;

            });

        }

    };


    /* ============================================================
       VALIDATION
    ============================================================ */

    const validate = () => {

        const nextErrors = {};


        if (!form.firstName.trim()) {

            nextErrors.firstName =
                "First name is required.";

        }


        if (!form.lastName.trim()) {

            nextErrors.lastName =
                "Last name is required.";

        }


        if (!form.dateOfBirth) {

            nextErrors.dateOfBirth =
                "Date of birth is required.";

        }


        if (!form.nationality.trim()) {

            nextErrors.nationality =
                "Nationality is required.";

        }


        if (!form.gender) {

            nextErrors.gender =
                "Please select your gender.";

        }


        if (!form.phone.trim()) {

            nextErrors.phone =
                "Phone number is required.";

        }


        if (!form.email.trim()) {

            nextErrors.email =
                "Email address is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(form.email)
        ) {

            nextErrors.email =
                "Enter a valid email address.";

        }


        if (!form.currentCountry.trim()) {

            nextErrors.currentCountry =
                "Current country is required.";

        }


        if (!form.address.trim()) {

            nextErrors.address =
                "Address is required.";

        }


        setErrors(nextErrors);

        return (
            Object.keys(nextErrors).length === 0
        );

    };


    /* ============================================================
       SAVE
    ============================================================ */

    const handleSubmit = async (event) => {

        event.preventDefault();


        const valid = validate();


        if (!valid) {
            return;
        }


        if (typeof onSave !== "function") {

            setSaved(true);

            return;
        }


        try {

            await onSave(form);

            setSaved(true);

        } catch (error) {

            console.error(
                "FAILED TO SAVE PERSONAL INFORMATION:",
                error,
            );

        }

    };


    /* ============================================================
       FIELD CLASS
    ============================================================ */

    const fieldClass = (field) => {

        return [
            "personal-information-field",

            errors[field]
                ? "has-error"
                : "",

        ]
            .filter(Boolean)
            .join(" ");

    };


    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <form
            className="personal-information-form"
            onSubmit={handleSubmit}
            noValidate
        >


            {/* =====================================================
                INTRO
            ===================================================== */}

            <div className="personal-information-intro">

                <div className="personal-information-intro-icon">

                    <HiOutlineUser />

                </div>


                <div>

                    <span>
                        PERSONAL INFORMATION
                    </span>

                    <h3>
                        Tell us about yourself
                    </h3>

                    <p>
                        Provide your personal details exactly
                        as they appear on your official documents.
                    </p>

                </div>

            </div>


            {/* =====================================================
                PERSONAL DETAILS
            ===================================================== */}

            <div className="personal-information-section">

                <div className="personal-information-section-heading">

                    <span>
                        PERSONAL DETAILS
                    </span>

                    <p>
                        Your identity information
                    </p>

                </div>


                <div className="personal-information-grid">


                    {/* FIRST NAME */}

                    <div className={fieldClass("firstName")}>

                        <label htmlFor="firstName">
                            First name
                        </label>

                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            autoComplete="given-name"
                        />

                        {errors.firstName && (
                            <small>
                                {errors.firstName}
                            </small>
                        )}

                    </div>


                    {/* LAST NAME */}

                    <div className={fieldClass("lastName")}>

                        <label htmlFor="lastName">
                            Last name
                        </label>

                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            autoComplete="family-name"
                        />

                        {errors.lastName && (
                            <small>
                                {errors.lastName}
                            </small>
                        )}

                    </div>


                    {/* DATE OF BIRTH */}

                    <div className={fieldClass("dateOfBirth")}>

                        <label htmlFor="dateOfBirth">
                            Date of birth
                        </label>

                        <input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            autoComplete="bday"
                        />

                        {errors.dateOfBirth && (
                            <small>
                                {errors.dateOfBirth}
                            </small>
                        )}

                    </div>


                    {/* NATIONALITY */}

                    <div className={fieldClass("nationality")}>

                        <label htmlFor="nationality">
                            Nationality
                        </label>

                        <input
                            id="nationality"
                            name="nationality"
                            type="text"
                            value={form.nationality}
                            onChange={handleChange}
                            placeholder="e.g. Nigerian"
                            autoComplete="country"
                        />

                        {errors.nationality && (
                            <small>
                                {errors.nationality}
                            </small>
                        )}

                    </div>


                    {/* GENDER */}

                    <div className={fieldClass("gender")}>

                        <label htmlFor="gender">
                            Gender
                        </label>

                        <select
                            id="gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select gender
                            </option>

                            <option value="MALE">
                                Male
                            </option>

                            <option value="FEMALE">
                                Female
                            </option>

                            <option value="OTHER">
                                Other
                            </option>

                            <option value="PREFER_NOT_TO_SAY">
                                Prefer not to say
                            </option>

                        </select>

                        {errors.gender && (
                            <small>
                                {errors.gender}
                            </small>
                        )}

                    </div>

                </div>

            </div>


            {/* =====================================================
                CONTACT
            ===================================================== */}

            <div className="personal-information-section">

                <div className="personal-information-section-heading">

                    <span>
                        CONTACT INFORMATION
                    </span>

                    <p>
                        How we can reach you
                    </p>

                </div>


                <div className="personal-information-grid">


                    {/* PHONE */}

                    <div className={fieldClass("phone")}>

                        <label htmlFor="phone">
                            Phone number
                        </label>

                        <div className="personal-information-input-icon">

                            <HiOutlinePhone />

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+234 800 000 0000"
                                autoComplete="tel"
                            />

                        </div>

                        {errors.phone && (
                            <small>
                                {errors.phone}
                            </small>
                        )}

                    </div>


                    {/* EMAIL */}

                    <div className={fieldClass("email")}>

                        <label htmlFor="email">
                            Email address
                        </label>

                        <div className="personal-information-input-icon">

                            <HiOutlineMail />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />

                        </div>

                        {errors.email && (
                            <small>
                                {errors.email}
                            </small>
                        )}

                    </div>


                    {/* CURRENT COUNTRY */}

                    <div
                        className={`
                            ${fieldClass("currentCountry")}
                            personal-information-full
                        `}
                    >

                        <label htmlFor="currentCountry">
                            Current country
                        </label>

                        <div className="personal-information-input-icon">

                            <HiOutlineLocationMarker />

                            <input
                                id="currentCountry"
                                name="currentCountry"
                                type="text"
                                value={form.currentCountry}
                                onChange={handleChange}
                                placeholder="Where do you currently live?"
                                autoComplete="country-name"
                            />

                        </div>

                        {errors.currentCountry && (
                            <small>
                                {errors.currentCountry}
                            </small>
                        )}

                    </div>


                    {/* ADDRESS */}

                    <div
                        className={`
                            ${fieldClass("address")}
                            personal-information-full
                        `}
                    >

                        <label htmlFor="address">
                            Current address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Enter your current residential address"
                            rows={3}
                            autoComplete="street-address"
                        />

                        {errors.address && (
                            <small>
                                {errors.address}
                            </small>
                        )}

                    </div>

                </div>

            </div>


            {/* =====================================================
                NOTICE
            ===================================================== */}

            <div className="personal-information-notice">

                <HiOutlineCheckCircle />

                <p>
                    Make sure these details match your
                    official documents. They may be used
                    throughout your migration application.
                </p>

            </div>


            {/* =====================================================
                ACTION
            ===================================================== */}

            <div className="personal-information-actions">

                <div>

                    {saved && (

                        <span className="personal-information-saved">

                            <HiOutlineCheckCircle />

                            Information saved

                        </span>

                    )}

                </div>


                <button
                    type="submit"
                    className="personal-information-save"
                    disabled={saving}
                >

                    {saving
                        ? "Saving..."
                        : "Save personal information"
                    }

                </button>

            </div>

        </form>

    );

};


export default PersonalInformationForm;