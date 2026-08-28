import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  HiOutlineChevronDown,
  HiOutlineCheck,
  HiOutlinePencil,
} from "react-icons/hi";

import adminApplicationsService
  from "../../../../applications.service";

import "./ApplicationActions.css";


/*
============================================================
AVAILABLE APPLICATION STATUSES
============================================================
*/

const STATUS_OPTIONS = [

  {
    value: "SUBMITTED",

    label: "Submitted",

    description:
      "Application has been submitted and is awaiting review.",
  },

  {
    value: "UNDER_REVIEW",

    label: "Under Review",

    description:
      "Application is currently being reviewed.",
  },

  {
    value: "DOCUMENT_REQUEST",

    label: "Documents Required",

    description:
      "Additional documents are required from the client.",
  },

  {
    value: "PROCESSING",

    label: "Processing",

    description:
      "Application is actively being processed.",
  },

  {
    value: "APPROVED",

    label: "Approved",

    description:
      "Application has been approved.",
  },

  {
    value: "REJECTED",

    label: "Rejected",

    description:
      "Application has been rejected.",
  },

];


/*
============================================================
FORMAT CURRENT STATUS
============================================================
*/

const getCurrentStatusLabel = (
  status
) => {

  const option =
    STATUS_OPTIONS.find(
      (item) =>
        item.value === status
    );


  return (
    option?.label ||
    "Unknown Status"
  );

};


/*
============================================================
COMPONENT
============================================================
*/

const ApplicationActions = ({
  application,
  onUpdated,
  onEdit,
}) => {

  const menuRef =
    useRef(null);


  /*
  |--------------------------------------------------------------------------
  | MENU STATE
  |--------------------------------------------------------------------------
  */

  const [
    open,
    setOpen,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | SELECTED STATUS
  |--------------------------------------------------------------------------
  */

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState(
    application?.status ||
    "SUBMITTED"
  );


  /*
  |--------------------------------------------------------------------------
  | SAVING STATE
  |--------------------------------------------------------------------------
  */

  const [
    saving,
    setSaving,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  const [
    error,
    setError,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | SYNC STATUS WITH APPLICATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    setSelectedStatus(
      application?.status ||
      "SUBMITTED"
    );

  }, [
    application?.status,
  ]);


  /*
  |--------------------------------------------------------------------------
  | CLOSE MENU WHEN CLICKING OUTSIDE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const handleOutsideClick = (
      event
    ) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {

        setOpen(false);

        setError("");

      }

    };


    if (open) {

      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );

    }


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, [
    open,
  ]);


  /*
  |--------------------------------------------------------------------------
  | OPEN / CLOSE ACTION MENU
  |--------------------------------------------------------------------------
  */

  const toggleMenu = () => {

    if (saving) {
      return;
    }


    setError("");


    setOpen(
      (previous) =>
        !previous
    );

  };


  /*
  |--------------------------------------------------------------------------
  | EDIT APPLICATION
  |--------------------------------------------------------------------------
  |
  | Edit is deliberately separate from the status menu.
  |
  | The parent can later open the actual edit interface.
  |
  |--------------------------------------------------------------------------
  */

  const handleEdit = () => {

    if (saving) {
      return;
    }


    setOpen(false);

    setError("");


    if (onEdit) {

      onEdit();

    }

  };


  /*
  |--------------------------------------------------------------------------
  | CHANGE APPLICATION STATUS
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (
    status
  ) => {

    /*
    ------------------------------------------------------------
    | Nothing to update if the selected status is already
    | the current application status.
    ------------------------------------------------------------
    */

    if (
      status ===
      application?.status
    ) {

      setOpen(false);

      return;

    }


    try {

      setSaving(true);

      setError("");


      /*
      ----------------------------------------------------------
      | API REQUEST
      ----------------------------------------------------------
      */

      const response =
        await adminApplicationsService
          .updateApplicationStatus(
            application._id,
            status
          );


      /*
      ----------------------------------------------------------
      | NORMALIZE RESPONSE
      ----------------------------------------------------------
      */

      const updatedApplication =
        response?.data ||
        response;


      /*
      ----------------------------------------------------------
      | UPDATE PARENT
      ----------------------------------------------------------
      */

      if (
        onUpdated &&
        updatedApplication
      ) {

        onUpdated(
          updatedApplication
        );

      }


      /*
      ----------------------------------------------------------
      | UPDATE LOCAL STATUS
      ----------------------------------------------------------
      */

      setSelectedStatus(
        status
      );


      /*
      ----------------------------------------------------------
      | CLOSE MENU
      ----------------------------------------------------------
      */

      setOpen(false);


    } catch (
    requestError
    ) {

      console.error(
        "FAILED TO UPDATE APPLICATION STATUS:",
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        "Unable to update application status."
      );


    } finally {

      setSaving(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="applicationActions"
      ref={menuRef}
    >

      {/* ====================================================
          EDIT APPLICATION
      ==================================================== */}

      <button
        type="button"
        className="applicationActions__edit"
        onClick={handleEdit}
        disabled={saving}
      >

        <HiOutlinePencil />

        <span>

          {saving
            ? "Updating..."
            : "Edit Application"}

        </span>

      </button>


      {/* ====================================================
          ACTION MENU TOGGLE
      ==================================================== */}

      <button
        type="button"
        className="applicationActions__toggle"
        onClick={toggleMenu}
        disabled={saving}
        aria-label="Application actions"
        aria-expanded={open}
        aria-haspopup="menu"
      >

        <HiOutlineChevronDown />

      </button>


      {/* ====================================================
          STATUS MENU
      ==================================================== */}

      {open && (

        <div
          className="applicationActions__menu"
          role="menu"
        >

          {/* ==================================================
              MENU HEADER
          ================================================== */}

          <div
            className="
              applicationActions__menuHeader
            "
          >

            <span>
              UPDATE APPLICATION
            </span>


            <strong>
              {getCurrentStatusLabel(
                application?.status
              )}
            </strong>

          </div>


          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (

            <div
              className="
                applicationActions__error
              "
              role="alert"
            >

              {error}

            </div>

          )}


          {/* ==================================================
              STATUS OPTIONS
          ================================================== */}

          <div
            className="
              applicationActions__options
            "
          >

            {STATUS_OPTIONS.map(
              (option) => {

                const active =
                  selectedStatus ===
                  option.value;


                return (

                  <button
                    key={
                      option.value
                    }

                    type="button"

                    role="menuitem"

                    className={
                      `
                      applicationActions__option
                      ${active
                        ? "applicationActions__option--active"
                        : ""
                      }
                      `
                    }

                    onClick={() =>
                      handleStatusChange(
                        option.value
                      )
                    }

                    disabled={
                      saving
                    }

                    aria-current={
                      active
                        ? "true"
                        : undefined
                    }
                  >

                    {/* ======================================
                        STATUS INDICATOR
                    ====================================== */}

                    <span
                      className="
                        applicationActions__optionIndicator
                      "
                    >

                      {active && (

                        <HiOutlineCheck />

                      )}

                    </span>


                    {/* ======================================
                        STATUS CONTENT
                    ====================================== */}

                    <span
                      className="
                        applicationActions__optionContent
                      "
                    >

                      <strong>
                        {option.label}
                      </strong>


                      <small>
                        {option.description}
                      </small>

                    </span>

                  </button>

                );

              }
            )}

          </div>

        </div>

      )}

    </div>

  );

};


export default ApplicationActions;