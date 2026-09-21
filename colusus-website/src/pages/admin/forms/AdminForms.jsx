
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    HiOutlineArrowRight,
    HiOutlineCollection,
    HiOutlineRefresh,
    HiOutlineSearch,
} from "react-icons/hi";

import api from "../../../services/api";

import "./AdminForms.css";


function AdminForms() {

    const navigate = useNavigate();

    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");


    /*
    ============================================================
    LOAD FORMS
    ============================================================
    */

    const fetchForms = async ({
        isRefresh = false,
    } = {}) => {

        try {

            setError("");

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }


            const { data } = await api.get(
                "/form-submissions/forms",
            );


            setForms(
                Array.isArray(data?.data)
                    ? data.data
                    : [],
            );


        } catch (err) {

            console.error(
                "AdminForms fetch error:",
                err,
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load forms.",
            );


        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    /*
    ============================================================
    INITIAL LOAD
    ============================================================
    */

    useEffect(() => {

        fetchForms();

    }, []);


    /*
    ============================================================
    FILTERED FORMS
    ============================================================
    */

    const filteredForms = useMemo(() => {

        const value = search
            .trim()
            .toLowerCase();


        if (!value) {
            return forms;
        }


        return forms.filter((form) => {

            return (
                form?.name
                    ?.toLowerCase()
                    .includes(value) ||

                form?.description
                    ?.toLowerCase()
                    .includes(value) ||

                form?.key
                    ?.toLowerCase()
                    .includes(value)
            );

        });

    }, [forms, search]);


    /*
    ============================================================
    FORM COUNTS
    ============================================================
    */

    const activeForms = forms.filter(
        (form) => form?.active,
    ).length;


    const inactiveForms =
        forms.length - activeForms;


    /*
    ============================================================
    OPEN FORM
    ============================================================
    */

    const handleOpenForm = (form) => {

        if (!form?.key) {
            return;
        }


        navigate(
            `/admin/forms/${encodeURIComponent(
                form.key,
            )}`,
        );

    };


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (

        <div className="admin-forms-page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <section className="admin-forms-hero">

                <div className="admin-forms-hero-content">

                    <div className="admin-forms-eyebrow">

                        <span className="admin-forms-eyebrow-icon">
                            <HiOutlineCollection />
                        </span>

                        <span>
                            Website submissions
                        </span>

                    </div>


                    <h1>
                        Forms
                    </h1>


                    <p>
                        Manage and review submissions
                        collected through the public website.
                    </p>

                </div>


                <button
                    type="button"
                    className="admin-forms-refresh"
                    onClick={() =>
                        fetchForms({
                            isRefresh: true,
                        })
                    }
                    disabled={
                        loading ||
                        refreshing
                    }
                >

                    <HiOutlineRefresh
                        className={
                            refreshing
                                ? "is-spinning"
                                : ""
                        }
                    />

                    <span>
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </span>

                </button>

            </section>


            {/* ==================================================
                SUMMARY
            ================================================== */}

            {!loading && !error && (

                <section className="admin-forms-summary">

                    <div className="admin-forms-summary-item">

                        <span className="admin-forms-summary-label">
                            Total forms
                        </span>

                        <strong>
                            {forms.length}
                        </strong>

                    </div>


                    <div className="admin-forms-summary-divider" />


                    <div className="admin-forms-summary-item">

                        <span className="admin-forms-summary-label">
                            Active
                        </span>

                        <strong>
                            {activeForms}
                        </strong>

                    </div>


                    <div className="admin-forms-summary-divider" />


                    <div className="admin-forms-summary-item">

                        <span className="admin-forms-summary-label">
                            Inactive
                        </span>

                        <strong>
                            {inactiveForms}
                        </strong>

                    </div>

                </section>

            )}


            {/* ==================================================
                SEARCH
            ================================================== */}

            {!loading && !error && forms.length > 0 && (

                <section className="admin-forms-toolbar">

                    <div className="admin-forms-search">

                        <HiOutlineSearch />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value,
                                )
                            }
                            placeholder="Search forms..."
                            aria-label="Search forms"
                        />

                    </div>


                    {search && (

                        <span className="admin-forms-result-count">

                            {filteredForms.length}
                            {" "}
                            {filteredForms.length === 1
                                ? "form"
                                : "forms"}

                        </span>

                    )}

                </section>

            )}


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <section className="admin-forms-error">

                    <div>

                        <strong>
                            Unable to load forms
                        </strong>

                        <span>
                            {error}
                        </span>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            fetchForms()
                        }
                    >
                        Try again
                    </button>

                </section>

            )}


            {/* ==================================================
                LOADING
            ================================================== */}

            {loading && (

                <div className="admin-forms-grid">

                    {[1, 2, 3, 4].map(
                        (item) => (

                            <div
                                key={item}
                                className="admin-form-card admin-form-card-skeleton"
                            >

                                <div className="skeleton-top">

                                    <div className="skeleton-icon" />

                                    <div className="skeleton-status" />

                                </div>


                                <div className="skeleton-line title" />

                                <div className="skeleton-line" />

                                <div className="skeleton-line short" />


                                <div className="skeleton-footer" />

                            </div>

                        ),
                    )}

                </div>

            )}


            {/* ==================================================
                EMPTY
            ================================================== */}

            {!loading &&
                !error &&
                forms.length === 0 && (

                    <section className="admin-forms-empty">

                        <div className="admin-forms-empty-icon">

                            <HiOutlineCollection />

                        </div>


                        <h2>
                            No forms registered
                        </h2>


                        <p>
                            Public website forms will
                            appear here once they are
                            registered in the system.
                        </p>

                    </section>

                )}


            {/* ==================================================
                NO SEARCH RESULTS
            ================================================== */}

            {!loading &&
                !error &&
                forms.length > 0 &&
                filteredForms.length === 0 && (

                    <section className="admin-forms-empty">

                        <div className="admin-forms-empty-icon">

                            <HiOutlineSearch />

                        </div>


                        <h2>
                            No matching forms
                        </h2>


                        <p>
                            Try a different form name
                            or search term.
                        </p>

                    </section>

                )}


            {/* ==================================================
                FORM CARDS
            ================================================== */}

            {!loading &&
                !error &&
                filteredForms.length > 0 && (

                    <section className="admin-forms-grid">

                        {filteredForms.map(
                            (form, index) => (

                                <button
                                    key={form.key}
                                    type="button"
                                    className="admin-form-card"
                                    onClick={() =>
                                        handleOpenForm(
                                            form,
                                        )
                                    }
                                >

                                    {/* --------------------------
                                        CARD HEADER
                                    --------------------------- */}

                                    <div className="admin-form-card-header">

                                        <div className="admin-form-card-icon">

                                            <HiOutlineCollection />

                                        </div>


                                        <span
                                            className={
                                                form.active
                                                    ? "admin-form-status active"
                                                    : "admin-form-status inactive"
                                            }
                                        >

                                            <span className="admin-form-status-dot" />

                                            {form.active
                                                ? "Active"
                                                : "Inactive"}

                                        </span>

                                    </div>


                                    {/* --------------------------
                                        CARD CONTENT
                                    --------------------------- */}

                                    <div className="admin-form-card-content">

                                        <span className="admin-form-number">

                                            {String(
                                                index + 1,
                                            ).padStart(
                                                2,
                                                "0",
                                            )}

                                        </span>


                                        <h2>
                                            {form.name}
                                        </h2>


                                        <p>
                                            {form.description ||
                                                "Public website form submissions."}
                                        </p>

                                    </div>


                                    {/* --------------------------
                                        FORM KEY
                                    --------------------------- */}

                                    <div className="admin-form-key">

                                        <span>
                                            FORM KEY
                                        </span>

                                        <code>
                                            {form.key}
                                        </code>

                                    </div>


                                    {/* --------------------------
                                        CARD FOOTER
                                    --------------------------- */}

                                    <div className="admin-form-card-footer">

                                        <span>
                                            View submissions
                                        </span>


                                        <span className="admin-form-arrow">

                                            <HiOutlineArrowRight />

                                        </span>

                                    </div>

                                </button>

                            ),
                        )}

                    </section>

                )}

        </div>

    );

}


export default AdminForms;

