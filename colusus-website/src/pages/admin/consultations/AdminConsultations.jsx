import { useEffect, useState } from "react";

import consultationService from "../../../services/consultation.service";

import "./AdminConsultations.css";

const AdminConsultations = () => {

    const [consultations, setConsultations] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Fetch Consultations
    |--------------------------------------------------------------------------
    */

    const fetchConsultations = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await consultationService
                    .getAllConsultations();

            setConsultations(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch consultations:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to load consultations."
            );

        } finally {

            setLoading(false);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        fetchConsultations();

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <main className="adminConsultations">

            <div className="adminConsultations__container">

                {/* Header */}

                <header className="adminConsultations__header">

                    <div>

                        <span className="adminConsultations__eyebrow">
                            Administration
                        </span>

                        <h1>
                            Consultations
                        </h1>

                        <p>
                            View and manage incoming
                            consultation bookings.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="adminConsultations__refresh"
                        onClick={fetchConsultations}
                        disabled={loading}
                    >
                        {loading
                            ? "Refreshing..."
                            : "Refresh"
                        }
                    </button>

                </header>

                {/* Error */}

                {error && (

                    <div className="adminConsultations__error">

                        {error}

                    </div>

                )}

                {/* Loading */}

                {loading ? (

                    <div className="adminConsultations__state">

                        Loading consultations...

                    </div>

                ) : consultations.length === 0 ? (

                    <div className="adminConsultations__state">

                        <h2>
                            No consultations yet
                        </h2>

                        <p>
                            New consultation bookings
                            will appear here.
                        </p>

                    </div>

                ) : (

                    <section className="adminConsultations__tableWrapper">

                        <table className="adminConsultations__table">

                            <thead>

                                <tr>

                                    <th>
                                        Client
                                    </th>

                                    <th>
                                        Consultation
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Payment
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {consultations.map(
                                    (consultation) => (

                                        <tr
                                            key={
                                                consultation._id
                                            }
                                        >

                                            <td>

                                                <div className="adminConsultations__client">

                                                    <strong>
                                                        {
                                                            consultation.fullName
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            consultation.email
                                                        }
                                                    </span>

                                                </div>

                                            </td>

                                            <td>

                                                {
                                                    consultation.consultationType
                                                }

                                            </td>

                                            <td>

                                                {
                                                    new Date(
                                                        consultation.consultationDate
                                                    ).toLocaleDateString()
                                                }

                                            </td>

                                            <td>

                                                <span
                                                    className={`adminConsultations__badge adminConsultations__badge--${consultation.paymentStatus?.toLowerCase()}`}
                                                >

                                                    {
                                                        consultation.paymentStatus
                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={`adminConsultations__badge adminConsultations__badge--${consultation.bookingStatus?.toLowerCase()}`}
                                                >

                                                    {
                                                        consultation.bookingStatus
                                                    }

                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </section>

                )}

            </div>

        </main>

    );

};

export default AdminConsultations;