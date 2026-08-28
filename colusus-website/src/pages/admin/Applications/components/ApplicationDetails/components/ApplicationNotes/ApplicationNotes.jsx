import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    HiOutlineChatAlt2,
    HiOutlinePaperAirplane,
    HiOutlineRefresh,
} from "react-icons/hi";

import adminApplicationsService
    from "../../../../applications.service";

import "./ApplicationNotes.css";


/*
|--------------------------------------------------------------------------
| APPLICATION NOTES
|--------------------------------------------------------------------------
|
| Internal notes are visible only to ADMIN / STAFF.
|
| API:
|
| GET  /api/v1/admin/applications/:id/notes
| POST /api/v1/admin/applications/:id/notes
|
|--------------------------------------------------------------------------
*/

const ApplicationNotes = ({
    application,
}) => {

    /*
    |--------------------------------------------------------------------------
    | APPLICATION ID
    |--------------------------------------------------------------------------
    */

    const applicationId =
        application?._id ||
        application?.id;


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [
        notes,
        setNotes,
    ] = useState([]);


    const [
        message,
        setMessage,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        submitting,
        setSubmitting,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | LOAD NOTES
    |--------------------------------------------------------------------------
    */

    const loadNotes = useCallback(
        async () => {

            if (!applicationId) {

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");


                const response =
                    await adminApplicationsService
                        .getApplicationNotes(
                            applicationId,
                        );


                /*
                ------------------------------------------------------------
                | SERVICE RETURNS data.data
                ------------------------------------------------------------
                */

                const applicationNotes =
                    Array.isArray(response)
                        ? response
                        : [];


                setNotes(
                    applicationNotes,
                );

            } catch (requestError) {

                console.error(
                    "FAILED TO LOAD APPLICATION NOTES:",
                    requestError,
                );


                setError(
                    requestError
                        ?.response
                        ?.data
                        ?.message ||
                    requestError?.message ||
                    "Unable to load application notes.",
                );

            } finally {

                setLoading(false);

            }

        },
        [
            applicationId,
        ],
    );


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadNotes();

    }, [
        loadNotes,
    ]);


    /*
    |--------------------------------------------------------------------------
    | ADD NOTE
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        event,
    ) => {

        event.preventDefault();


        const trimmedMessage =
            message.trim();


        if (
            !trimmedMessage ||
            submitting
        ) {

            return;

        }


        try {

            setSubmitting(true);

            setError("");


            await adminApplicationsService
                .addApplicationNote(
                    applicationId,
                    trimmedMessage,
                );


            /*
            ------------------------------------------------------------
            | CLEAR COMPOSER
            ------------------------------------------------------------
            */

            setMessage("");


            /*
            ------------------------------------------------------------
            | REFRESH NOTES
            ------------------------------------------------------------
            |
            | We fetch from MongoDB again rather than manually
            | constructing the note on the frontend.
            |
            ------------------------------------------------------------
            */

            await loadNotes();

        } catch (requestError) {

            console.error(
                "FAILED TO ADD APPLICATION NOTE:",
                requestError,
            );


            setError(
                requestError
                    ?.response
                    ?.data
                    ?.message ||
                requestError?.message ||
                "Unable to add application note.",
            );

        } finally {

            setSubmitting(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | FORMAT DATE
    |--------------------------------------------------------------------------
    */

    const formatDate = (
        date,
    ) => {

        if (!date) {

            return "—";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime(),
            )
        ) {

            return "—";

        }


        return parsedDate.toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short",
            },
        );

    };


    /*
    |--------------------------------------------------------------------------
    | EMPTY APPLICATION
    |--------------------------------------------------------------------------
    */

    if (!applicationId) {

        return (

            <section
                className="
          applicationNotes
        "
            >

                <div
                    className="
            applicationNotes__empty
          "
                >

                    <HiOutlineChatAlt2 />

                    <h3>
                        Application unavailable
                    </h3>

                    <p>
                        No application was selected.
                    </p>

                </div>

            </section>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <section
            className="
        applicationNotes
      "
        >


            {/* =========================================================
          HEADER
      ========================================================= */}

            <header
                className="
          applicationNotes__header
        "
            >

                <div>

                    <span
                        className="
              applicationNotes__eyebrow
            "
                    >
                        INTERNAL
                    </span>


                    <h2>
                        Application Notes
                    </h2>


                    <p>
                        Private notes for administrators
                        and staff managing this application.
                    </p>

                </div>


                <button
                    type="button"
                    className="
            applicationNotes__refresh
          "
                    onClick={loadNotes}
                    disabled={loading}
                    title="Refresh notes"
                    aria-label="Refresh notes"
                >

                    <HiOutlineRefresh />

                </button>

            </header>


            {/* =========================================================
          ERROR
      ========================================================= */}

            {error && (

                <div
                    className="
            applicationNotes__error
          "
                >

                    {error}

                </div>

            )}


            {/* =========================================================
          NOTE COMPOSER
      ========================================================= */}

            <form
                className="
          applicationNotes__composer
        "
                onSubmit={
                    handleSubmit
                }
            >

                <div
                    className="
            applicationNotes__composerIcon
          "
                >

                    <HiOutlineChatAlt2 />

                </div>


                <textarea
                    value={message}
                    onChange={(event) =>
                        setMessage(
                            event.target.value,
                        )
                    }
                    placeholder="Add an internal note about this application..."
                    rows={4}
                    disabled={submitting}
                />


                <div
                    className="
            applicationNotes__composerFooter
          "
                >

                    <span>
                        Internal note · Staff only
                    </span>


                    <button
                        type="submit"
                        disabled={
                            submitting ||
                            !message.trim()
                        }
                    >

                        <HiOutlinePaperAirplane />

                        <span>
                            {submitting
                                ? "Saving..."
                                : "Add Note"}
                        </span>

                    </button>

                </div>

            </form>


            {/* =========================================================
          NOTES LIST
      ========================================================= */}

            <div
                className="
          applicationNotes__list
        "
            >

                {loading ? (

                    <div
                        className="
              applicationNotes__state
            "
                    >

                        <div
                            className="
                applicationNotes__spinner
              "
                        />

                        <span>
                            Loading notes...
                        </span>

                    </div>

                ) : notes.length === 0 ? (

                    <div
                        className="
              applicationNotes__empty
            "
                    >

                        <HiOutlineChatAlt2 />

                        <h3>
                            No internal notes
                        </h3>

                        <p>
                            Add the first internal note
                            for this application.
                        </p>

                    </div>

                ) : (

                    notes.map(
                        (note) => {

                            const author =
                                note?.createdBy;


                            const authorName =
                                author?.name ||
                                "Staff member";


                            const initial =
                                authorName
                                    .charAt(0)
                                    .toUpperCase();


                            return (

                                <article
                                    key={
                                        note._id
                                    }
                                    className="
                    applicationNotes__item
                  "
                                >


                                    {/* =================================================
                      NOTE HEADER
                  ================================================= */}

                                    <div
                                        className="
                      applicationNotes__itemTop
                    "
                                    >

                                        <div
                                            className="
                        applicationNotes__author
                      "
                                        >

                                            <div
                                                className="
                          applicationNotes__avatar
                        "
                                            >

                                                {initial}

                                            </div>


                                            <div
                                                className="
                          applicationNotes__authorInfo
                        "
                                            >

                                                <strong>
                                                    {authorName}
                                                </strong>


                                                <span>
                                                    {author?.email ||
                                                        "Colusus staff"}
                                                </span>

                                            </div>

                                        </div>


                                        <time>
                                            {formatDate(
                                                note.createdAt,
                                            )}
                                        </time>

                                    </div>


                                    {/* =================================================
                      NOTE MESSAGE
                  ================================================= */}

                                    <p
                                        className="
                      applicationNotes__message
                    "
                                    >

                                        {note.message}

                                    </p>

                                </article>

                            );

                        },
                    )

                )}

            </div>

        </section>

    );

};


export default ApplicationNotes;