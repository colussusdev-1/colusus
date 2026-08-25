import React from "react";

import {
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
} from "react-icons/hi";

import "./ProfileHeader.css";


const ProfileHeader = ({
  user,
  completion = 0,
}) => {

  const displayName =
    user?.name ||
    "Your Profile";


  const percentage = Math.min(
    Math.max(Number(completion) || 0, 0),
    100,
  );


  return (
    <section className="profile-header">

      {/* =====================================================
                HEADER CONTENT
            ===================================================== */}

      <div className="profile-header-content">


        {/* =================================================
                    IDENTITY
                ================================================= */}

        <div className="profile-header-identity">

          <div className="profile-header-avatar">

            <HiOutlineUserCircle />

          </div>


          <div className="profile-header-copy">

            <span className="profile-header-eyebrow">

              MY PROFILE

            </span>


            <h1>

              Welcome,{" "}

              <span>
                {displayName}
              </span>

            </h1>


            <p>

              Keep your personal information
              up to date so we can guide you
              through your migration journey.

            </p>

          </div>

        </div>


        {/* =================================================
                    SECURITY
                ================================================= */}

        <div className="profile-header-security">

          <div className="profile-header-security-icon">

            <HiOutlineShieldCheck />

          </div>


          <div>

            <strong>
              Your information is secure
            </strong>

            <span>
              Protected client information
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
                COMPLETION STRIP
            ===================================================== */}

      <div className="profile-header-progress">


        <div className="profile-header-progress-info">

          <div>

            <span>
              Profile completion
            </span>

            <strong>
              {percentage}%
            </strong>

          </div>


          <span className="profile-header-progress-status">

            {percentage >= 100
              ? "Complete"
              : "Almost there"}

          </span>

        </div>


        <div
          className="profile-header-progress-track"
          aria-label={`Profile ${percentage}% complete`}
        >

          <div
            className="profile-header-progress-fill"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

    </section>
  );

};


export default ProfileHeader;