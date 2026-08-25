import React from "react";

import {
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
} from "react-icons/hi";

import "./ProfileSecurityNotice.css";


const ProfileSecurityNotice = () => {

  return (
    <section className="profile-security-notice">

      <div className="profile-security-notice-icon">

        <HiOutlineShieldCheck />

      </div>


      <div className="profile-security-notice-content">

        <span className="profile-security-notice-label">
          YOUR INFORMATION
        </span>


        <h3>
          Your details are handled securely
        </h3>


        <p>
          The information you provide helps our team
          prepare and manage your migration journey.
          Only the information needed for your
          application and client services is collected.
        </p>

      </div>


      <div className="profile-security-notice-badge">

        <HiOutlineLockClosed />

        <span>
          Secure
        </span>

      </div>

    </section>
  );

};


export default ProfileSecurityNotice;