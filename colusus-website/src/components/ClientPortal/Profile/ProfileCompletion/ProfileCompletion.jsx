import React from "react";

import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
} from "react-icons/hi";

import "./ProfileCompletion.css";


const ProfileCompletion = ({
  percentage = 0,
  missingFields = [],
  isComplete = false,
  onComplete,
}) => {

  const safePercentage = Math.min(
    Math.max(Number(percentage) || 0, 0),
    100,
  );


  const fieldLabels = {
    phoneNumber: "Phone number",
    dateOfBirth: "Date of birth",
    nationality: "Nationality",
    currentCountry: "Current country",
    address: "Address",
    passportNumber: "Passport number",
    migrationGoal: "Migration goal",
    preferredDestination: "Preferred destination",
  };


  const visibleMissingFields =
    Array.isArray(missingFields)
      ? missingFields
        .slice(0, 4)
        .map(
          (field) =>
            fieldLabels[field] || field,
        )
      : [];


  return (
    <section className="profile-completion">

      {/* =====================================================
                LEFT
            ===================================================== */}

      <div className="profile-completion-main">

        <div className="profile-completion-icon">

          {isComplete ? (
            <HiOutlineCheckCircle />
          ) : (
            <HiOutlineExclamationCircle />
          )}

        </div>


        <div className="profile-completion-content">

          <div className="profile-completion-title-row">

            <div>

              <span className="profile-completion-eyebrow">
                PROFILE STATUS
              </span>

              <h2>
                {isComplete
                  ? "Your profile is complete"
                  : "Complete your profile"}
              </h2>

            </div>


            <strong className="profile-completion-percentage">
              {safePercentage}%
            </strong>

          </div>


          <p>

            {isComplete
              ? "Everything we need is ready. You can now continue with your migration application."
              : "Complete the remaining information below so we can prepare your migration application correctly."}

          </p>


          {/* =================================================
                        PROGRESS
                    ================================================= */}

          <div className="profile-completion-track">

            <div
              className="profile-completion-fill"
              style={{
                width: `${safePercentage}%`,
              }}
            />

          </div>


          {/* =================================================
                        MISSING FIELDS
                    ================================================= */}

          {!isComplete &&
            visibleMissingFields.length > 0 && (

              <div className="profile-completion-missing">

                <span>
                  Still needed
                </span>


                <div>

                  {visibleMissingFields.map(
                    (field) => (
                      <span
                        key={field}
                        className="profile-completion-tag"
                      >
                        {field}
                      </span>
                    ),
                  )}


                  {missingFields.length > 4 && (
                    <span className="profile-completion-more">

                      +
                      {missingFields.length - 4}
                      {" "}more

                    </span>
                  )}

                </div>

              </div>

            )}

        </div>

      </div>


      {/* =====================================================
                ACTION
            ===================================================== */}

      {!isComplete && onComplete && (

        <button
          type="button"
          className="profile-completion-action"
          onClick={onComplete}
        >

          <span>
            Complete profile
          </span>

          <HiOutlineArrowRight />

        </button>

      )}

    </section>
  );

};


export default ProfileCompletion;