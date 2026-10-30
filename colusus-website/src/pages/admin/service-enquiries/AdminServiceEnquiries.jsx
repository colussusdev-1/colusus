
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
    Search,
    RefreshCw,
    Filter,
    Users,
    FileText,
    Clock3,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    X,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    BriefcaseBusiness,
    GraduationCap,
    Globe2,
    Wrench,
    Download,
    ExternalLink,
    MessageSquare,
    ClipboardList,
    ArrowUpRight,
    LoaderCircle,
    AlertCircle,
    Save,
    UserRound,
} from "lucide-react";

import api from "../../../services/api";
import "./AdminServiceEnquiries.css";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const SERVICE_TYPES = {
    INTERNATIONAL_RECRUITMENT: {
        label: "International Recruitment",
        icon: BriefcaseBusiness,
        color: "blue",
    },

    STUDY_ABROAD: {
        label: "Study Abroad",
        icon: GraduationCap,
        color: "purple",
    },

    SKILLED_MIGRATION: {
        label: "Skilled Migration",
        icon: Globe2,
        color: "green",
    },

    TRAINEE_APPRENTICESHIP: {
        label: "Trainee & Apprenticeship",
        icon: Wrench,
        color: "orange",
    },
};

const STATUSES = [
    "NEW",
    "REVIEWING",
    "CONTACTED",
    "QUALIFIED",
    "CONVERTED",
    "CLOSED",
];

const STATUS_LABELS = {
    NEW: "New",
    REVIEWING: "Reviewing",
    CONTACTED: "Contacted",
    QUALIFIED: "Qualified",
    CONVERTED: "Converted",
    CLOSED: "Closed",
};

const PAGE_SIZE = 10;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatLabel = (value = "") =>
    String(value)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const extractList = (response) => {
    const payload = response?.data;

    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.submissions)) return payload.submissions;
    if (Array.isArray(payload?.enquiries)) return payload.enquiries;

    if (Array.isArray(payload?.data?.submissions)) {
        return payload.data.submissions;
    }

    if (Array.isArray(payload?.data?.enquiries)) {
        return payload.data.enquiries;
    }

    return [];
};

const extractItem = (response) => {
    const payload = response?.data;

    return (
        payload?.data?.submission ||
        payload?.data?.enquiry ||
        payload?.data ||
        payload?.submission ||
        payload?.enquiry ||
        payload
    );
};

const getApplicant = (enquiry) => enquiry?.applicant || {};

const getServiceName = (enquiry) =>
    SERVICE_TYPES[enquiry?.serviceType]?.label ||
    enquiry?.serviceName ||
    formatLabel(enquiry?.serviceType || "Service enquiry");

const getDocuments = (enquiry) => enquiry?.documents || [];

const getEnquiryId = (enquiry) => enquiry?._id || enquiry?.id;

const getFieldEntries = (data = {}) =>
    Object.entries(data).filter(
        ([key, value]) =>
            !["_id", "__v", "createdAt", "updatedAt"].includes(key) &&
            value !== undefined &&
            value !== null &&
            value !== ""
    );

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const AdminServiceEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [search, setSearch] = useState("");
    const [serviceFilter, setServiceFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [page, setPage] = useState(1);

    const [statusDraft, setStatusDraft] = useState("NEW");
    const [internalNote, setInternalNote] = useState("");

    /* ---------------------------------------------------------------------- */
    /* FETCH ENQUIRIES                                                        */
    /* ---------------------------------------------------------------------- */

    const fetchEnquiries = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/service-enquiries");

            setEnquiries(extractList(response));
        } catch (err) {
            console.error("Service enquiries fetch error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load service enquiries. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEnquiries();
    }, [fetchEnquiries]);

    /* ---------------------------------------------------------------------- */
    /* FILTERING                                                              */
    /* ---------------------------------------------------------------------- */

    const filteredEnquiries = useMemo(() => {
        return enquiries.filter((enquiry) => {
            const applicant = getApplicant(enquiry);

            const matchesService =
                serviceFilter === "ALL" ||
                enquiry.serviceType === serviceFilter;

            const matchesStatus =
                statusFilter === "ALL" ||
                enquiry.status === statusFilter;

            const searchValue = search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                [
                    applicant.fullName,
                    applicant.email,
                    applicant.phone,
                    applicant.countryOfResidence,
                    enquiry.serviceName,
                    enquiry.serviceType,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value).toLowerCase().includes(searchValue)
                    );

            return matchesService && matchesStatus && matchesSearch;
        });
    }, [enquiries, serviceFilter, statusFilter, search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredEnquiries.length / PAGE_SIZE)
    );

    const paginatedEnquiries = filteredEnquiries.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    useEffect(() => {
        setPage(1);
    }, [search, serviceFilter, statusFilter]);

    /* ---------------------------------------------------------------------- */
    /* STATISTICS                                                             */
    /* ---------------------------------------------------------------------- */

    const statistics = useMemo(() => {
        const count = (status) =>
            enquiries.filter((item) => item.status === status).length;

        return [
            {
                label: "Total enquiries",
                value: enquiries.length,
                icon: Users,
                color: "blue",
            },
            {
                label: "New enquiries",
                value: count("NEW"),
                icon: FileText,
                color: "purple",
            },
            {
                label: "Under review",
                value: count("REVIEWING"),
                icon: Clock3,
                color: "orange",
            },
            {
                label: "Qualified",
                value: count("QUALIFIED"),
                icon: CheckCircle2,
                color: "green",
            },
        ];
    }, [enquiries]);

    /* ---------------------------------------------------------------------- */
    /* OPEN ENQUIRY                                                           */
    /* ---------------------------------------------------------------------- */

    const openEnquiry = async (enquiry) => {
        const id = getEnquiryId(enquiry);

        if (!id) return;

        setSelectedEnquiry(enquiry);
        setDetailLoading(true);
        setSuccessMessage("");
        setError("");

        try {
            const response = await api.get(`/service-enquiries/${id}`);

            const detailedEnquiry = extractItem(response);

            setSelectedEnquiry(detailedEnquiry);

            setStatusDraft(detailedEnquiry.status || "NEW");
            setInternalNote("");
        } catch (err) {
            console.error("Enquiry details error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load enquiry details."
            );
        } finally {
            setDetailLoading(false);
        }
    };

    /* ---------------------------------------------------------------------- */
    /* CLOSE DETAILS                                                          */
    /* ---------------------------------------------------------------------- */

    const closeDetails = () => {
        if (saving) return;

        setSelectedEnquiry(null);
        setDetailLoading(false);
        setSuccessMessage("");
        setError("");
        setInternalNote("");
    };

    /* ---------------------------------------------------------------------- */
    /* UPDATE ENQUIRY                                                         */
    /* ---------------------------------------------------------------------- */

    const saveEnquiryChanges = async () => {
        if (!selectedEnquiry) return;

        const id = getEnquiryId(selectedEnquiry);

        setSaving(true);
        setError("");
        setSuccessMessage("");

        try {
            const payload = {
                status: statusDraft,
            };

            if (internalNote.trim()) {
                payload.internalNote = internalNote.trim();
            }

            await api.patch(`/service-enquiries/${id}`, payload);

            setSuccessMessage("Enquiry updated successfully.");
            setInternalNote("");

            await fetchEnquiries();

            const response = await api.get(`/service-enquiries/${id}`);

            const updated = extractItem(response);

            setSelectedEnquiry(updated);
            setStatusDraft(updated.status || "NEW");
        } catch (err) {
            console.error("Enquiry update error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to update this enquiry."
            );
        } finally {
            setSaving(false);
        }
    };

    /* ---------------------------------------------------------------------- */
    /* DOCUMENT VIEW                                                          */
    /* ---------------------------------------------------------------------- */

    const viewDocument = async (document) => {
        if (!selectedEnquiry) return;

        const id = getEnquiryId(selectedEnquiry);

        try {
            const response = await api.get(
                `/service-enquiries/${id}/documents/${document._id}/view`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], {
                type: document.mimeType || "application/pdf",
            });

            const fileUrl = window.URL.createObjectURL(blob);

            window.open(fileUrl, "_blank", "noopener,noreferrer");

            setTimeout(() => {
                window.URL.revokeObjectURL(fileUrl);
            }, 60000);
        } catch (err) {
            console.error("Document preview error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to open this document."
            );
        }
    };

    /* ---------------------------------------------------------------------- */
    /* EXPORT CSV                                                             */
    /* ---------------------------------------------------------------------- */

    const exportEnquiries = () => {
        const headers = [
            "Full Name",
            "Email",
            "Phone",
            "Country",
            "Service",
            "Status",
            "Submitted",
        ];

        const rows = filteredEnquiries.map((item) => {
            const applicant = getApplicant(item);

            return [
                applicant.fullName,
                applicant.email,
                applicant.phone,
                applicant.countryOfResidence,
                getServiceName(item),
                item.status,
                formatDate(item.createdAt),
            ];
        });

        const csv = [headers, ...rows]
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(value ?? "").replace(/"/g, '""')}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "colossus-service-enquiries.csv";
        link.click();

        URL.revokeObjectURL(url);
    };

    /* ---------------------------------------------------------------------- */
    /* RENDER ENQUIRY FIELD                                                   */
    /* ---------------------------------------------------------------------- */

    const renderEnquiryField = (key, value) => {
        if (Array.isArray(value)) {
            value = value.join(", ");
        }

        if (typeof value === "object" && value !== null) {
            value = JSON.stringify(value);
        }

        return (
            <div className="se-detail-field" key={key}>
                <span>{formatLabel(key)}</span>
                <strong>{String(value)}</strong>
            </div>
        );
    };

    /* ---------------------------------------------------------------------- */
    /* MAIN RENDER                                                            */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="admin-service-enquiries">

            {/* PAGE HEADER */}

            <div className="se-page-header">
                <div>
                    <span className="se-eyebrow">CLIENT MANAGEMENT</span>

                    <h1>Service Enquiries</h1>

                    <p>
                        Manage applications and enquiries received through
                        your service pages.
                    </p>
                </div>

                <div className="se-header-actions">
                    <button
                        className="se-button se-button-secondary"
                        onClick={exportEnquiries}
                        disabled={!filteredEnquiries.length}
                    >
                        <Download size={16} />
                        Export CSV
                    </button>

                    <button
                        className="se-button se-button-primary"
                        onClick={fetchEnquiries}
                        disabled={loading}
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "se-spinning" : ""}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            {/* ERROR */}

            {error && !selectedEnquiry && (
                <div className="se-alert se-alert-error">
                    <AlertCircle size={17} />
                    {error}

                    <button onClick={() => setError("")}>
                        <X size={15} />
                    </button>
                </div>
            )}

            {/* STATISTICS */}

            <div className="se-statistics">
                {statistics.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div className="se-stat-card" key={stat.label}>
                            <div className={`se-stat-icon ${stat.color}`}>
                                <Icon size={21} />
                            </div>

                            <div>
                                <span>{stat.label}</span>
                                <strong>{stat.value}</strong>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* SERVICE CATEGORIES */}

            <div className="se-service-breakdown">
                <div className="se-section-heading">
                    <div>
                        <h2>Enquiry categories</h2>
                        <p>
                            Applications received across our services.
                        </p>
                    </div>
                </div>

                <div className="se-category-grid">
                    {Object.entries(SERVICE_TYPES).map(([key, service]) => {
                        const Icon = service.icon;

                        const count = enquiries.filter(
                            (item) => item.serviceType === key
                        ).length;

                        return (
                            <button
                                key={key}
                                className={`se-category-card ${service.color} ${serviceFilter === key ? "active" : ""
                                    }`}
                                onClick={() =>
                                    setServiceFilter(
                                        serviceFilter === key ? "ALL" : key
                                    )
                                }
                            >
                                <div className="se-category-icon">
                                    <Icon size={19} />
                                </div>

                                <div>
                                    <strong>{count}</strong>
                                    <span>{service.label}</span>
                                </div>

                                <ArrowUpRight size={16} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ENQUIRY TABLE */}

            <div className="se-table-container">
                <div className="se-table-heading">
                    <div>
                        <h2>All enquiries</h2>

                        <p>
                            {filteredEnquiries.length}{" "}
                            {filteredEnquiries.length === 1
                                ? "enquiry"
                                : "enquiries"}{" "}
                            found
                        </p>
                    </div>
                </div>

                {/* TOOLBAR */}

                <div className="se-toolbar">
                    <div className="se-search">
                        <Search size={17} />

                        <input
                            type="search"
                            placeholder="Search name, email or phone..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <div className="se-filter">
                        <Filter size={15} />

                        <select
                            value={serviceFilter}
                            onChange={(event) =>
                                setServiceFilter(event.target.value)
                            }
                        >
                            <option value="ALL">All services</option>

                            {Object.entries(SERVICE_TYPES).map(
                                ([key, service]) => (
                                    <option key={key} value={key}>
                                        {service.label}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="se-filter">
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="ALL">All statuses</option>

                            {STATUSES.map((status) => (
                                <option value={status} key={status}>
                                    {STATUS_LABELS[status]}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* LOADING */}

                {loading ? (
                    <div className="se-loading">
                        <LoaderCircle
                            size={28}
                            className="se-spinning"
                        />
                        <span>Loading service enquiries...</span>
                    </div>
                ) : paginatedEnquiries.length === 0 ? (
                    <div className="se-empty-state">
                        <div>
                            <ClipboardList size={30} />
                        </div>

                        <h3>No enquiries found</h3>

                        <p>
                            There are no enquiries matching your current
                            filters.
                        </p>

                        <button
                            onClick={() => {
                                setSearch("");
                                setServiceFilter("ALL");
                                setStatusFilter("ALL");
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="se-table-scroll">
                            <table className="se-table">
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Service</th>
                                        <th>Contact</th>
                                        <th>Submitted</th>
                                        <th>Status</th>
                                        <th>Documents</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedEnquiries.map((enquiry) => {
                                        const applicant =
                                            getApplicant(enquiry);

                                        return (
                                            <tr key={getEnquiryId(enquiry)}>
                                                <td>
                                                    <div className="se-applicant-cell">
                                                        <div className="se-avatar">
                                                            {getInitials(
                                                                applicant.fullName
                                                            )}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {applicant.fullName ||
                                                                    "Unknown applicant"}
                                                            </strong>

                                                            <span>
                                                                {applicant.countryOfResidence ||
                                                                    "—"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="se-service-name">
                                                        {getServiceName(enquiry)}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="se-contact-cell">
                                                        <span>
                                                            {applicant.email ||
                                                                "—"}
                                                        </span>

                                                        <span>
                                                            {applicant.phone ||
                                                                "—"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        enquiry.createdAt
                                                    )}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`se-status ${(
                                                                enquiry.status ||
                                                                "NEW"
                                                            ).toLowerCase()
                                                            }`}
                                                    >
                                                        {STATUS_LABELS[
                                                            enquiry.status
                                                        ] ||
                                                            enquiry.status ||
                                                            "New"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="se-document-count">
                                                        <FileText size={14} />
                                                        {
                                                            getDocuments(
                                                                enquiry
                                                            ).length
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <button
                                                        className="se-view-button"
                                                        onClick={() =>
                                                            openEnquiry(enquiry)
                                                        }
                                                    >
                                                        View
                                                        <ArrowUpRight
                                                            size={15}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}

                        <div className="se-pagination">
                            <span>
                                Showing{" "}
                                {filteredEnquiries.length === 0
                                    ? 0
                                    : (page - 1) * PAGE_SIZE + 1}{" "}
                                to{" "}
                                {Math.min(
                                    page * PAGE_SIZE,
                                    filteredEnquiries.length
                                )}{" "}
                                of {filteredEnquiries.length}
                            </span>

                            <div>
                                <button
                                    disabled={page <= 1}
                                    onClick={() =>
                                        setPage((current) => current - 1)
                                    }
                                >
                                    <ChevronLeft size={17} />
                                </button>

                                <strong>
                                    {page} / {totalPages}
                                </strong>

                                <button
                                    disabled={page >= totalPages}
                                    onClick={() =>
                                        setPage((current) => current + 1)
                                    }
                                >
                                    <ChevronRight size={17} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* DETAILS DRAWER */}

            {selectedEnquiry && (
                <div
                    className="se-drawer-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeDetails();
                        }
                    }}
                >
                    <aside className="se-drawer">

                        {/* DRAWER HEADER */}

                        <div className="se-drawer-header">
                            <div>
                                <span className="se-eyebrow">
                                    ENQUIRY DETAILS
                                </span>

                                <h2>Applicant profile</h2>
                            </div>

                            <button
                                className="se-icon-button"
                                onClick={closeDetails}
                                disabled={saving}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="se-loading">
                                <LoaderCircle
                                    size={28}
                                    className="se-spinning"
                                />
                                Loading applicant information...
                            </div>
                        ) : (
                            <div className="se-drawer-body">

                                {/* ALERTS */}

                                {error && (
                                    <div className="se-alert se-alert-error">
                                        <AlertCircle size={17} />
                                        {error}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="se-alert se-alert-success">
                                        <CheckCircle2 size={17} />
                                        {successMessage}
                                    </div>
                                )}

                                {/* APPLICANT PROFILE */}

                                <section className="se-detail-section">
                                    <div className="se-profile-heading">
                                        <div className="se-profile-avatar">
                                            {getInitials(
                                                getApplicant(
                                                    selectedEnquiry
                                                ).fullName
                                            )}
                                        </div>

                                        <div>
                                            <h3>
                                                {getApplicant(
                                                    selectedEnquiry
                                                ).fullName}
                                            </h3>

                                            <span>
                                                {getServiceName(
                                                    selectedEnquiry
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="se-contact-list">
                                        <div>
                                            <Mail size={16} />
                                            <span>
                                                {getApplicant(
                                                    selectedEnquiry
                                                ).email}
                                            </span>
                                        </div>

                                        <div>
                                            <Phone size={16} />
                                            <span>
                                                {getApplicant(
                                                    selectedEnquiry
                                                ).phone}
                                            </span>
                                        </div>

                                        <div>
                                            <MapPin size={16} />
                                            <span>
                                                {getApplicant(
                                                    selectedEnquiry
                                                ).countryOfResidence}
                                            </span>
                                        </div>

                                        <div>
                                            <CalendarDays size={16} />
                                            <span>
                                                Submitted{" "}
                                                {formatDateTime(
                                                    selectedEnquiry.createdAt
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </section>

                                {/* SUBMITTED INFORMATION */}

                                <section className="se-detail-section">
                                    <div className="se-detail-title">
                                        <ClipboardList size={17} />
                                        <h3>Submitted information</h3>
                                    </div>

                                    <div className="se-detail-fields">
                                        {getFieldEntries(
                                            selectedEnquiry.enquiryData
                                        ).map(([key, value]) =>
                                            renderEnquiryField(key, value)
                                        )}
                                    </div>
                                </section>

                                {/* UPLOADED DOCUMENTS */}

                                <section className="se-detail-section">
                                    <div className="se-detail-title">
                                        <FileText size={17} />
                                        <h3>Uploaded documents</h3>

                                        <span className="se-count-badge">
                                            {
                                                getDocuments(
                                                    selectedEnquiry
                                                ).length
                                            }
                                        </span>
                                    </div>

                                    {getDocuments(selectedEnquiry).length ===
                                        0 ? (
                                        <div className="se-no-documents">
                                            No documents were uploaded.
                                        </div>
                                    ) : (
                                        <div className="se-document-list">
                                            {getDocuments(
                                                selectedEnquiry
                                            ).map((document) => (
                                                <div
                                                    className="se-document-item"
                                                    key={document._id}
                                                >
                                                    <div className="se-document-icon">
                                                        <FileText size={20} />
                                                    </div>

                                                    <div className="se-document-info">
                                                        <strong>
                                                            {document.name}
                                                        </strong>

                                                        <span>
                                                            {formatLabel(
                                                                document.documentType ||
                                                                document.fieldName
                                                            )}

                                                            {document.size
                                                                ? ` · ${(
                                                                    document.size /
                                                                    1024
                                                                ).toFixed(
                                                                    0
                                                                )} KB`
                                                                : ""}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            viewDocument(
                                                                document
                                                            )
                                                        }
                                                        title="Preview document"
                                                    >
                                                        <ExternalLink
                                                            size={17}
                                                        />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {/* ENQUIRY MANAGEMENT */}

                                <section className="se-detail-section se-management-section">
                                    <div className="se-detail-title">
                                        <UserRound size={17} />
                                        <h3>Manage enquiry</h3>
                                    </div>

                                    <div className="se-management-field">
                                        <label>Enquiry status</label>

                                        <select
                                            value={statusDraft}
                                            onChange={(event) =>
                                                setStatusDraft(
                                                    event.target.value
                                                )
                                            }
                                        >
                                            {STATUSES.map((status) => (
                                                <option
                                                    value={status}
                                                    key={status}
                                                >
                                                    {STATUS_LABELS[status]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="se-management-field">
                                        <label>
                                            <MessageSquare size={14} />
                                            Add internal note
                                        </label>

                                        <textarea
                                            rows="4"
                                            placeholder="Add notes about this applicant..."
                                            value={internalNote}
                                            onChange={(event) =>
                                                setInternalNote(
                                                    event.target.value
                                                )
                                            }
                                        />

                                        <small>
                                            Internal notes are for your
                                            administrative records and are not
                                            visible to the applicant.
                                        </small>
                                    </div>

                                    <button
                                        className="se-button se-button-primary se-save-button"
                                        onClick={saveEnquiryChanges}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <LoaderCircle
                                                    size={17}
                                                    className="se-spinning"
                                                />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={17} />
                                                Save changes
                                            </>
                                        )}
                                    </button>
                                </section>

                                {/* PREVIOUS NOTES */}

                                {selectedEnquiry.internalNotes?.length > 0 && (
                                    <section className="se-detail-section">
                                        <div className="se-detail-title">
                                            <MessageSquare size={17} />
                                            <h3>Previous internal notes</h3>
                                        </div>

                                        <div className="se-notes-list">
                                            {selectedEnquiry.internalNotes.map(
                                                (note, index) => (
                                                    <div
                                                        className="se-note-item"
                                                        key={note._id || index}
                                                    >
                                                        <p>
                                                            {note.message ||
                                                                note.note ||
                                                                note.content}
                                                        </p>

                                                        <span>
                                                            {note.createdAt
                                                                ? formatDateTime(
                                                                    note.createdAt
                                                                )
                                                                : "Previously added"}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                    </aside>
                </div>
            )}
        </div>
    );
};

export default AdminServiceEnquiries;

