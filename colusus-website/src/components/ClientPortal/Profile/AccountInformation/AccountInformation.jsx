import React from "react";

import {
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineCheckCircle,
} from "react-icons/hi";

import "./AccountInformation.css";


const AccountInformation = ({ user }) => {

  return (
    <section className="account-information">

      {/* =====================================================
                SECTION HEADER
            ===================================================== */}

      <div className="account-information-header">

        <div>

          <span className="account-information-eyebrow">
            ACCOUNT
          </span>

          <h2>
            Account information
          </h2>

          <p>
            These details are connected to your Colusus
            account and cannot be changed here.
          </p>

        </div>


        <div className="account-information-status">

          <HiOutlineCheckCircle />

          <span>
            Verified account
          </span>

        </div>

      </div>


      {/* =====================================================
                ACCOUNT FIELDS
            ===================================================== */}

      <div className="account-information-grid">

        <div className="account-information-field">

          <div className="account-information-field-icon">

            <HiOutlineUser />

          </div>


          <div className="account-information-field-content">

            <span>
              Full name
            </span>

            <strong>
              {user?.name || "Not available"}
            </strong>

          </div>

        </div>


        <div className="account-information-field">

          <div className="account-information-field-icon">

            <HiOutlineMail />

          </div>


          <div className="account-information-field-content">

            <span>
              Email address
            </span>

            <strong>
              {user?.email || "Not available"}
            </strong>

          </div>

        </div>

      </div>

    </section>
  );
};


export default AccountInformation;