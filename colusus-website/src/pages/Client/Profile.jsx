import React, {
    useEffect,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import "./Profile.css";

import ProfileHeader
    from "../../components/ClientPortal/Profile/ProfileHeader/ProfileHeader";

import ProfileCompletion
    from "../../components/ClientPortal/Profile/ProfileCompletion/ProfileCompletion";

import ProfileSecurityNotice
    from "../../components/ClientPortal/Profile/ProfileSecurityNotice/ProfileSecurityNotice";

import AccountInformation
    from "../../components/ClientPortal/Profile/AccountInformation/AccountInformation";

import PersonalInformation
    from "../../components/ClientPortal/Profile/PersonalInformation/PersonalInformation";

import clientProfileService
    from "../../services/clientPortal.service";

import applicationService
    from "../../services/application.service.js";


/*
============================================================
PROFILE
============================================================
*/

const Profile = () => {

    const navigate = useNavigate();

    const location = useLocation();


    /*
    ============================================================
    ROUTE / RESUME INFORMATION
    ============================================================
    */

    const searchParams =
        new URLSearchParams(
            location.search,
        );

    const returnTo =
        searchParams.get("returnTo");


    /*
    ============================================================
    STATE
    ============================================================
    */

    const [user, setUser] =
        useState(null);

    const [profile, setProfile] =
        useState(null);

    const [completion, setCompletion] =
        useState({
            exists: false,
            isComplete: false,
            percentage: 0,
            missingFields: [],
        });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [saveMessage, setSaveMessage] =
        useState("");

    const [resumingApplication, setResumingApplication] =
        useState(false);


    /*
    ============================================================
    LOAD PROFILE
    ============================================================
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


                setProfile(
                    profileData || null,
                );


                setUser(
                    profileData?.user || null,
                );


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
    ============================================================
    RESUME PENDING APPLICATION
    ============================================================
    */

    const resumePendingApplication = async () => {

        const pendingApplication =
            sessionStorage.getItem(
                "colossus_pending_application",
            );


        if (!pendingApplication) {
            return false;
        }


        let pendingData;


        try {

            pendingData =
                JSON.parse(
                    pendingApplication,
                );

        } catch (parseError) {

            console.error(
                "FAILED TO READ PENDING APPLICATION:",
                parseError,
            );


            sessionStorage.removeItem(
                "colossus_pending_application",
            );


            return false;

        }


        const opportunityId =
            pendingData?.opportunityId ||
            pendingData?.opportunity?._id;


        const destinationCountry =
            pendingData?.opportunity?.countryName ||
            pendingData?.opportunity?.destinationCountry ||
            "";


        if (!opportunityId) {

            sessionStorage.removeItem(
                "colossus_pending_application",
            );

            return false;

        }


        try {

            setResumingApplication(true);

            setError("");


            /*
            ========================================================
            CREATE THE APPLICATION
            ========================================================
            */

            const application =
                await applicationService.createApplication({

                    opportunity:
                        opportunityId,

                    destinationCountry,

                });


            /*
            ========================================================
            CLEAR PENDING PATHWAY
            ========================================================
            */

            sessionStorage.removeItem(
                "colossus_pending_application",
            );


            /*
            ========================================================
            OPEN APPLICATION
            ========================================================
            */

            const applicationId =
                application?._id ||
                application?.id;


            if (applicationId) {

                navigate(
                    `/portal/applications/${applicationId}`,
                    {
                        replace: true,
                    },
                );


                return true;

            }


            /*
            ========================================================
            FALLBACK
            ========================================================
            */

            navigate(
                "/portal/applications",
                {
                    replace: true,
                },
            );


            return true;

        } catch (err) {

            console.error(
                "FAILED TO RESUME PENDING APPLICATION:",
                err,
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Your profile was saved, but we couldn't start the application automatically. Please try again.",
            );


            return false;

        } finally {

            setResumingApplication(false);

        }

    };


    /*
    ============================================================
    SAVE PERSONAL INFORMATION
    ============================================================
    */

    const handleSavePersonalInformation = async (
        personalInformation,
    ) => {

        try {

            setSaving(true);

            setSaveMessage("");

            setError("");


            /*
            ========================================================
            UPDATE CLIENT PROFILE
            ========================================================
            */

            const updatedProfile =
                await clientProfileService.updateProfile(
                    personalInformation,
                );


            /*
            ========================================================
            UPDATE LOCAL PROFILE
            ========================================================
            */

            setProfile(
                updatedProfile || null,
            );


            setUser(
                updatedProfile?.user || null,
            );


            /*
            ========================================================
            REFRESH COMPLETION
            ========================================================
            */

            const updatedCompletion =
                await clientProfileService.getProfileCompletion();


            const normalizedCompletion = {

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

            };


            setCompletion(
                normalizedCompletion,
            );


            /*
            ========================================================
            PENDING APPLICATION CHECK
            ========================================================
            */

            const pendingApplication =
                sessionStorage.getItem(
                    "colossus_pending_application",
                );


            /*
            ========================================================
            PROFILE NOW COMPLETE
            ========================================================
            */

            if (
                normalizedCompletion.isComplete &&
                pendingApplication
            ) {

                setSaveMessage(
                    "Your profile is complete. Preparing your application...",
                );


                /*
                ====================================================
                RESUME APPLICATION
                ====================================================
                */

                await resumePendingApplication();


                return;

            }


            /*
            ========================================================
            NORMAL PROFILE SAVE
            ========================================================
            */

            setSaveMessage(
                "Your personal information has been saved successfully.",
            );


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
    ============================================================
    LOADING
    ============================================================
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
    ============================================================
    ERROR
    ============================================================
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
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try again
                        </button>

                    </div>

                </div>

            </main>

        );

    }


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (

        <main className="profile-page">

            <div className="profile-page-container">


                {/* =====================================================
                    RESUMING APPLICATION NOTICE
                ===================================================== */}

                {resumingApplication && (

                    <div className="profile-page-message profile-page-message-success">

                        <strong>
                            Profile complete.
                        </strong>

                        {" "}

                        Preparing your application...

                    </div>

                )}


                {/* =====================================================
                    SAVE SUCCESS
                ===================================================== */}

                {saveMessage && !resumingApplication && (

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
                    saving={
                        saving ||
                        resumingApplication
                    }
                />

            </div>

        </main>

    );

};


export default Profile;