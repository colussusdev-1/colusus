import React, {
  useEffect,
  useState,
} from "react";

import {
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineX,
  HiOutlineRefresh,
} from "react-icons/hi";

import adminApplicationsService from "../../../../applications.service";

import "./AssignedStaff.css";


/*
|--------------------------------------------------------------------------
| ASSIGNED STAFF
|--------------------------------------------------------------------------
|
| Responsibilities:
|
| - Display currently assigned staff
| - Load real ADMIN / STAFF users
| - Assign an application
| - Reassign an application
| - Unassign an application
| - Immediately update the UI after a successful save
| - Notify the parent application state when possible
|
|--------------------------------------------------------------------------
*/


const AssignedStaff = ({
  application,
  onAssignmentChange,
}) => {


  /*
  |--------------------------------------------------------------------------
  | STAFF LIST
  |--------------------------------------------------------------------------
  */

  const [
    staffList,
    setStaffList,
  ] = useState([]);


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  const [
    loadingStaff,
    setLoadingStaff,
  ] = useState(false);


  const [
    saving,
    setSaving,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | SELECTOR
  |--------------------------------------------------------------------------
  */

  const [
    selectorOpen,
    setSelectorOpen,
  ] = useState(false);


  const [
    selectedStaffId,
    setSelectedStaffId,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | LOCAL ASSIGNED STAFF
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | This prevents the component from waiting for the parent to
  | re-render before showing the successful assignment.
  |
  |--------------------------------------------------------------------------
  */

  const [
    localAssignedStaff,
    setLocalAssignedStaff,
  ] = useState(
    application?.assignedTo || null,
  );


  /*
  |--------------------------------------------------------------------------
  | FEEDBACK
  |--------------------------------------------------------------------------
  */

  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | SYNC WITH PARENT APPLICATION
  |--------------------------------------------------------------------------
  |
  | When the parent fetches a fresh application, keep the local
  | assignment synchronized with it.
  |
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    setLocalAssignedStaff(
      application?.assignedTo || null,
    );

  }, [
    application?.assignedTo,
  ]);


  /*
  |--------------------------------------------------------------------------
  | CURRENT STAFF
  |--------------------------------------------------------------------------
  */

  const staff =
    localAssignedStaff ||
    null;


  const hasStaff =
    Boolean(staff);


  const staffName =
    staff?.name ||
    "Unassigned";


  const staffEmail =
    staff?.email ||
    "";


  /*
  |--------------------------------------------------------------------------
  | STAFF INITIALS
  |--------------------------------------------------------------------------
  */

  const initials =
    hasStaff
      ? staffName
        .split(" ")
        .filter(Boolean)
        .map(
          (part) =>
            part.charAt(0),
        )
        .join("")
        .slice(0, 2)
        .toUpperCase()
      : null;


  /*
  |--------------------------------------------------------------------------
  | LOAD ASSIGNABLE STAFF
  |--------------------------------------------------------------------------
  */

  const loadStaff = async () => {

    try {

      setLoadingStaff(true);

      setError("");


      const response =
        await adminApplicationsService
          .getAssignableStaff();


      /*
      |----------------------------------------------------------------------
      | API RESPONSE
      |----------------------------------------------------------------------
      |
      | Expected:
      |
      | {
      |   success: true,
      |   data: [...]
      | }
      |
      | We also support a direct array response.
      |
      */

      const users =
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];


      setStaffList(users);

    } catch (error) {

      console.error(
        "FAILED TO LOAD ASSIGNABLE STAFF:",
        error,
      );


      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load staff members.",
      );

    } finally {

      setLoadingStaff(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | OPEN SELECTOR
  |--------------------------------------------------------------------------
  */

  const openSelector = async () => {

    setError("");

    setSuccess("");


    /*
    |----------------------------------------------------------------------
    | Preselect currently assigned staff.
    |----------------------------------------------------------------------
    */

    setSelectedStaffId(
      staff?._id ||
      staff?.id ||
      "",
    );


    setSelectorOpen(true);


    /*
    |----------------------------------------------------------------------
    | Load staff only when needed.
    |----------------------------------------------------------------------
    */

    if (
      staffList.length === 0
    ) {

      await loadStaff();

    }

  };


  /*
  |--------------------------------------------------------------------------
  | CLOSE SELECTOR
  |--------------------------------------------------------------------------
  */

  const closeSelector = () => {

    if (saving) {
      return;
    }


    setSelectorOpen(false);

    setError("");

    setSuccess("");

  };


  /*
  |--------------------------------------------------------------------------
  | UPDATE LOCAL + PARENT APPLICATION
  |--------------------------------------------------------------------------
  */

  const updateApplicationState = (
    updatedApplication,
  ) => {

    /*
    |----------------------------------------------------------------------
    | Get assigned staff from backend response.
    |----------------------------------------------------------------------
    */

    const updatedStaff =
      updatedApplication?.assignedTo ||
      null;


    /*
    |----------------------------------------------------------------------
    | UPDATE THIS COMPONENT IMMEDIATELY
    |----------------------------------------------------------------------
    */

    setLocalAssignedStaff(
      updatedStaff,
    );


    /*
    |----------------------------------------------------------------------
    | UPDATE PARENT APPLICATION
    |----------------------------------------------------------------------
    */

    if (
      typeof onAssignmentChange ===
      "function"
    ) {

      onAssignmentChange(
        updatedApplication,
      );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | ASSIGN / REASSIGN APPLICATION
  |--------------------------------------------------------------------------
  */

  const handleAssignment = async () => {

    const applicationId =
      application?._id ||
      application?.id;


    if (!applicationId) {

      setError(
        "Application ID is missing.",
      );

      return;

    }


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      /*
      |----------------------------------------------------------------------
      | null = unassign
      |----------------------------------------------------------------------
      */

      const staffId =
        selectedStaffId ||
        null;


      /*
      |----------------------------------------------------------------------
      | SEND REQUEST
      |----------------------------------------------------------------------
      */

      const response =
        await adminApplicationsService
          .assignApplication(
            applicationId,
            staffId,
          );


      /*
      |----------------------------------------------------------------------
      | EXTRACT UPDATED APPLICATION
      |----------------------------------------------------------------------
      |
      | Backend returns:
      |
      | {
      |   success: true,
      |   message: "...",
      |   data: application
      | }
      |
      */

      const updatedApplication =
        response?.data ||
        null;


      /*
      |----------------------------------------------------------------------
      | IMPORTANT
      |----------------------------------------------------------------------
      |
      | Do NOT wait for a page refresh.
      |
      | The backend has already returned the newly populated application.
      | Push that application directly into React state.
      |
      |----------------------------------------------------------------------
      */

      if (
        updatedApplication
      ) {

        updateApplicationState(
          updatedApplication,
        );

      } else {

        /*
        |------------------------------------------------------------------
        | Defensive fallback
        |------------------------------------------------------------------
        |
        | If the backend response somehow doesn't contain the application,
        | update the local UI using the selected staff from the loaded list.
        |
        |------------------------------------------------------------------
        */

        const fallbackStaff =
          staffList.find(
            (member) =>
              String(
                member?._id ||
                member?.id,
              ) ===
              String(
                staffId,
              ),
          ) ||
          null;


        setLocalAssignedStaff(
          fallbackStaff,
        );

      }


      /*
      |----------------------------------------------------------------------
      | SUCCESS MESSAGE
      |----------------------------------------------------------------------
      */

      setSuccess(
        staffId
          ? "Application assigned successfully."
          : "Application unassigned successfully.",
      );


      /*
      |----------------------------------------------------------------------
      | Close selector shortly after successful update.
      |----------------------------------------------------------------------
      */

      window.setTimeout(() => {

        setSelectorOpen(false);

        setSuccess("");

      }, 700);

    } catch (error) {

      console.error(
        "FAILED TO UPDATE APPLICATION ASSIGNMENT:",
        error,
      );


      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update application assignment.",
      );

    } finally {

      setSaving(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | UNASSIGN
  |--------------------------------------------------------------------------
  */

  const handleUnassign = () => {

    setSelectedStaffId("");

  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <section className="assignedStaff">


      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="assignedStaff__header">

        <span>
          ASSIGNED STAFF
        </span>

        <h2>
          Assigned Staff
        </h2>

      </div>


      {/* =========================================================
          CURRENT STAFF
      ========================================================= */}

      <div className="assignedStaff__person">


        <div
          className={
            `assignedStaff__avatar ${!hasStaff
              ? "is-empty"
              : ""
            }`
          }
        >

          {hasStaff ? (

            initials

          ) : (

            <HiOutlineUserGroup />

          )}

        </div>


        <div className="assignedStaff__identity">

          <strong>
            {staffName}
          </strong>


          <span>

            {hasStaff
              ? staffEmail
              : "No staff assigned"}

          </span>

        </div>


        <button
          type="button"
          className="assignedStaff__change"
          onClick={openSelector}
          disabled={saving}
        >

          {hasStaff
            ? "Change"
            : "Assign"}

        </button>

      </div>


      {/* =========================================================
          OUTSIDE ERROR
      ========================================================= */}

      {error && !selectorOpen && (

        <div
          className="
            assignedStaff__message
            assignedStaff__message--error
          "
        >

          {error}

        </div>

      )}


      {/* =========================================================
          ASSIGNMENT SELECTOR
      ========================================================= */}

      {selectorOpen && (

        <div className="assignedStaff__selector">


          {/* =====================================================
              SELECTOR HEADER
          ===================================================== */}

          <div className="assignedStaff__selectorHeader">

            <div>

              <strong>

                {hasStaff
                  ? "Change assigned staff"
                  : "Assign staff member"}

              </strong>


              <span>
                Select an ADMIN or STAFF member.
              </span>

            </div>


            <button
              type="button"
              className="assignedStaff__close"
              onClick={closeSelector}
              disabled={saving}
              aria-label="Close"
            >

              <HiOutlineX />

            </button>

          </div>


          {/* =====================================================
              STAFF LIST
          ===================================================== */}

          {loadingStaff ? (

            <div className="assignedStaff__loading">

              <span className="assignedStaff__spinner" />

              <span>
                Loading staff...
              </span>

            </div>

          ) : staffList.length === 0 ? (

            <div className="assignedStaff__empty">

              <HiOutlineUser />

              <span>
                No assignable staff found.
              </span>


              <button
                type="button"
                onClick={loadStaff}
              >

                Try again

              </button>

            </div>

          ) : (

            <div className="assignedStaff__list">

              {staffList.map(
                (member) => {

                  const memberId =
                    member?._id ||
                    member?.id;


                  const memberName =
                    member?.name ||
                    "Unnamed staff";


                  const memberEmail =
                    member?.email ||
                    "";


                  const memberRole =
                    member?.role ||
                    "STAFF";


                  const isSelected =
                    String(
                      selectedStaffId,
                    ) ===
                    String(
                      memberId,
                    );


                  const memberInitials =
                    memberName
                      .split(" ")
                      .filter(Boolean)
                      .map(
                        (part) =>
                          part.charAt(0),
                      )
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();


                  return (

                    <button
                      key={memberId}
                      type="button"
                      className={
                        `assignedStaff__option ${isSelected
                          ? "is-selected"
                          : ""
                        }`
                      }
                      onClick={() =>
                        setSelectedStaffId(
                          memberId,
                        )
                      }
                      disabled={saving}
                    >


                      <div className="assignedStaff__optionAvatar">

                        {memberInitials}

                      </div>


                      <div className="assignedStaff__optionIdentity">

                        <strong>
                          {memberName}
                        </strong>


                        <span>
                          {memberEmail}
                        </span>

                      </div>


                      <span className="assignedStaff__role">

                        {memberRole}

                      </span>


                      <span className="assignedStaff__radio">

                        {isSelected && (
                          <span />
                        )}

                      </span>

                    </button>

                  );

                },
              )}

            </div>

          )}


          {/* =====================================================
              ERROR
          ===================================================== */}

          {error && (

            <div
              className="
                assignedStaff__message
                assignedStaff__message--error
              "
            >

              {error}

            </div>

          )}


          {/* =====================================================
              SUCCESS
          ===================================================== */}

          {success && (

            <div
              className="
                assignedStaff__message
                assignedStaff__message--success
              "
            >

              {success}

            </div>

          )}


          {/* =====================================================
              ACTIONS
          ===================================================== */}

          <div className="assignedStaff__actions">


            {hasStaff && (

              <button
                type="button"
                className="assignedStaff__unassign"
                onClick={handleUnassign}
                disabled={saving}
              >

                <HiOutlineX />

                Unassign

              </button>

            )}


            <div className="assignedStaff__actionsRight">


              <button
                type="button"
                className="assignedStaff__cancel"
                onClick={closeSelector}
                disabled={saving}
              >

                Cancel

              </button>


              <button
                type="button"
                className="assignedStaff__save"
                onClick={handleAssignment}
                disabled={
                  saving ||
                  loadingStaff
                }
              >

                {saving ? (

                  <>

                    <HiOutlineRefresh
                      className="is-spinning"
                    />

                    Saving...

                  </>

                ) : (

                  hasStaff
                    ? "Save changes"
                    : "Assign staff"

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  );

};


export default AssignedStaff;