import React, {
  useEffect,
  useState,
} from "react";

import "./Profile.css";

import ProfileHeader from "../../components/ClientPortal/Profile/ProfileHeader/ProfileHeader";
import ProfileCompletion from "../../components/ClientPortal/Profile/ProfileCompletion/ProfileCompletion";
import ProfileSecurityNotice from "../../components/ClientPortal/Profile/ProfileSecurityNotice/ProfileSecurityNotice";
import AccountInformation from "../../components/ClientPortal/Profile/AccountInformation/AccountInformation";
import PersonalInformation from "../../components/ClientPortal/Profile/PersonalInformation/PersonalInformation";

import clientProfileService from "../../services/clientPortal.service";


const Profile = () => {

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);

  const [completion, setCompletion] = useState({
    exists: false,
    isComplete: false,
    percentage: 0,
    missingFields: [],
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [saveMessage, setSaveMessage] = useState("");


  /*
  |--------------------------------------------------------------------------
  | LOAD PROFILE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    let isMounted = true;


    const loadProfile = async () => {

      try {

        setLoading(true);

        setError("");


        const [
          profileData,
          completionData,
        ] = await Promise.all([
          clientProfileService.getProfile(),
          clientProfileService.getProfileCompletion(),
        ]);


        if (!isMounted) {
          return;
        }


        setProfile(profileData || null);

        setUser(profileData?.user || null);


        setCompletion({

          exists:
            completionData?.exists ?? false,

          isComplete:
            completionData?.isComplete ?? false,

          percentage:
            completionData?.percentage ?? 0,

          missingFields:
            Array.isArray(
              completionData?.missingFields,
            )
              ? completionData.missingFields
              : [],

        });

      } catch (err) {

        console.error(
          "FAILED TO LOAD CLIENT PROFILE:",
          err,
        );


        if (!isMounted) {
          return;
        }


        setError(
          err?.response?.data?.message ||
          "Unable to load your profile. Please try again.",
        );

      } finally {

        if (isMounted) {

          setLoading(false);

        }

      }

    };


    loadProfile();


    return () => {

      isMounted = false;

    };

  }, []);


  /*
  |--------------------------------------------------------------------------
  | SAVE PERSONAL INFORMATION
  |--------------------------------------------------------------------------
  */

  const handleSavePersonalInformation = async (
    personalInformation,
  ) => {

    try {

      setSaving(true);

      setSaveMessage("");

      setError("");


      /*
      |--------------------------------------------------------------------------
      | UPDATE CLIENT PROFILE
      |--------------------------------------------------------------------------
      */

      const updatedProfile =
        await clientProfileService.updateProfile(
          personalInformation,
        );


      /*
      |--------------------------------------------------------------------------
      | UPDATE LOCAL PROFILE
      |--------------------------------------------------------------------------
      */

      setProfile(updatedProfile || null);

      setUser(updatedProfile?.user || null);


      /*
      |--------------------------------------------------------------------------
      | REFRESH COMPLETION
      |--------------------------------------------------------------------------
      |
      | We fetch this again because the percentage and
      | missing fields are calculated by the backend.
      |
      |--------------------------------------------------------------------------
      */

      const updatedCompletion =
        await clientProfileService.getProfileCompletion();


      setCompletion({

        exists:
          updatedCompletion?.exists ?? true,

        isComplete:
          updatedCompletion?.isComplete ?? false,

        percentage:
          updatedCompletion?.percentage ?? 0,

        missingFields:
          Array.isArray(
            updatedCompletion?.missingFields,
          )
            ? updatedCompletion.missingFields
            : [],

      });


      /*
      |--------------------------------------------------------------------------
      | SUCCESS MESSAGE
      |--------------------------------------------------------------------------
      */

      setSaveMessage(
        "Your personal information has been saved successfully.",
      );


      /*
      |--------------------------------------------------------------------------
      | REMOVE MESSAGE
      |--------------------------------------------------------------------------
      */

      window.setTimeout(() => {

        setSaveMessage("");

      }, 4000);

    } catch (err) {

      console.error(
        "FAILED TO SAVE PERSONAL INFORMATION:",
        err,
      );


      setError(
        err?.response?.data?.message ||
        "Unable to save your personal information. Please try again.",
      );

    } finally {

      setSaving(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <main className="profile-page">

        <div className="profile-page-container">

          <div className="profile-page-loading">

            <div className="profile-page-loader" />

            <p>
              Loading your profile...
            </p>

          </div>

        </div>

      </main>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error && !profile) {

    return (
      <main className="profile-page">

        <div className="profile-page-container">

          <div className="profile-page-error">

            <h2>
              Unable to load profile
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>

          </div>

        </div>

      </main>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <main className="profile-page">

      <div className="profile-page-container">

        {/* =====================================================
            SAVE SUCCESS
        ===================================================== */}

        {saveMessage && (

          <div className="profile-page-message profile-page-message-success">

            {saveMessage}

          </div>

        )}


        {/* =====================================================
            SAVE ERROR
        ===================================================== */}

        {error && (

          <div className="profile-page-message profile-page-message-error">

            {error}

          </div>

        )}


        {/* =====================================================
            PROFILE HEADER
        ===================================================== */}

        <ProfileHeader
          user={user}
          completion={completion.percentage}
        />


        {/* =====================================================
            PROFILE COMPLETION
        ===================================================== */}

        <ProfileCompletion
          percentage={completion.percentage}
          missingFields={completion.missingFields}
          isComplete={completion.isComplete}
        />


        {/* =====================================================
            SECURITY NOTICE
        ===================================================== */}

        <ProfileSecurityNotice />


        {/* =====================================================
            ACCOUNT INFORMATION
        ===================================================== */}

        <AccountInformation
          user={user}
        />


        {/* =====================================================
            PERSONAL INFORMATION
        ===================================================== */}

        <PersonalInformation
          profile={profile || {}}
          onSave={handleSavePersonalInformation}
          saving={saving}
        />

      </div>

    </main>
  );

};


export default Profile;