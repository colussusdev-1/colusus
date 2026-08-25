import React, { useEffect, useState } from "react";

import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineGlobeAlt,
  HiOutlineLocationMarker,
  HiOutlineIdentification,
} from "react-icons/hi";

import "./PersonalInformation.css";


const PersonalInformation = ({
  profile = {},
  onSave,
  saving = false,
}) => {

  const [formData, setFormData] = useState({
    phoneNumber: "",
    dateOfBirth: "",
    nationality: "",
    currentCountry: "",
    address: "",
    passportNumber: "",
  });


  /*
  |--------------------------------------------------------------------------
  | LOAD PROFILE INTO FORM
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    setFormData({

      phoneNumber:
        profile?.phoneNumber || "",

      dateOfBirth:
        profile?.dateOfBirth
          ? String(profile.dateOfBirth).slice(0, 10)
          : "",

      nationality:
        profile?.nationality || "",

      currentCountry:
        profile?.currentCountry || "",

      address:
        profile?.address || "",

      passportNumber:
        profile?.passportNumber || "",

    });

  }, [profile]);


  /*
  |--------------------------------------------------------------------------
  | HANDLE INPUT
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

  };


  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = (event) => {

    event.preventDefault();


    if (saving) {
      return;
    }


    if (typeof onSave === "function") {

      onSave(formData);

    }

  };


  return (
    <section className="personal-information">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="personal-information-header">

        <div className="personal-information-heading">

          <div className="personal-information-heading-icon">

            <HiOutlineUser />

          </div>


          <div>

            <span>
              PERSONAL DETAILS
            </span>

            <h2>
              Personal information
            </h2>

            <p>
              Tell us a little more about yourself.
              These details will be used when preparing
              your migration application.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        className="personal-information-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            PHONE
        ================================================= */}

        <div className="personal-information-field">

          <label htmlFor="phoneNumber">
            Phone number
          </label>


          <div className="personal-information-input">

            <HiOutlinePhone />

            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+234 800 000 0000"
              autoComplete="tel"
            />

          </div>

        </div>


        {/* =================================================
            DATE OF BIRTH
        ================================================= */}

        <div className="personal-information-field">

          <label htmlFor="dateOfBirth">
            Date of birth
          </label>


          <div className="personal-information-input">

            <HiOutlineCalendar />

            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />

          </div>

        </div>


        {/* =================================================
            NATIONALITY
        ================================================= */}

        <div className="personal-information-field">

          <label htmlFor="nationality">
            Nationality
          </label>


          <div className="personal-information-input">

            <HiOutlineGlobeAlt />

            <input
              id="nationality"
              name="nationality"
              type="text"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="e.g. Nigerian"
              autoComplete="country-name"
            />

          </div>

        </div>


        {/* =================================================
            CURRENT COUNTRY
        ================================================= */}

        <div className="personal-information-field">

          <label htmlFor="currentCountry">
            Current country
          </label>


          <div className="personal-information-input">

            <HiOutlineGlobeAlt />

            <input
              id="currentCountry"
              name="currentCountry"
              type="text"
              value={formData.currentCountry}
              onChange={handleChange}
              placeholder="e.g. Nigeria"
              autoComplete="country"
            />

          </div>

        </div>


        {/* =================================================
            ADDRESS
        ================================================= */}

        <div className="personal-information-field personal-information-field-full">

          <label htmlFor="address">
            Residential address
          </label>


          <div className="personal-information-input personal-information-textarea">

            <HiOutlineLocationMarker />

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your current residential address"
              rows={3}
              autoComplete="street-address"
            />

          </div>

        </div>


        {/* =================================================
            PASSPORT
        ================================================= */}

        <div className="personal-information-field">

          <label htmlFor="passportNumber">
            Passport number
          </label>


          <div className="personal-information-input">

            <HiOutlineIdentification />

            <input
              id="passportNumber"
              name="passportNumber"
              type="text"
              value={formData.passportNumber}
              onChange={handleChange}
              placeholder="Enter passport number"
              autoComplete="off"
            />

          </div>

        </div>


        {/* =================================================
            SAVE
        ================================================= */}

        <div className="personal-information-actions">

          <button
            type="submit"
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Save personal information"}

          </button>

        </div>

      </form>

    </section>
  );

};


export default PersonalInformation;