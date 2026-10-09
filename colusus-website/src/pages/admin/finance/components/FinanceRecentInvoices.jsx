import { FiFileText } from "react-icons/fi";

import "./FinanceRecentInvoices.css";

const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
};

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(parsedDate);
};

const titleCase = (value) => {
    if (!value) return "—";

    return String(value)
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const FinanceRecentInvoices = ({ invoices = [] }) => {
    return (
        <section className="finance-recent-invoices">
            <div className="finance-recent-invoices__header">
                <div>
                    <span className="finance-recent-invoices__eyebrow">
                        Billing
                    </span>

                    <h2>Recent Invoices</h2>

                    <p>
                        Latest invoices created across the platform.
                    </p>
                </div>

                <div className="finance-recent-invoices__icon">
                    <FiFileText />
                </div>
            </div>

            {invoices.length === 0 ? (
                <div className="finance-recent-invoices__empty">
                    No invoices found.
                </div>
            ) : (
                <div className="finance-recent-invoices__table-wrap">
                    <table className="finance-recent-invoices__table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Customer</th>
                                <th>Type</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Balance</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {invoices.map((invoice, index) => (
                                <tr
                                    key={
                                        invoice.invoiceNumber ||
                                        invoice._id ||
                                        index
                                    }
                                >
                                    <td>
                                        <strong>
                                            {invoice.invoiceNumber ||
                                                "—"}
                                        </strong>
                                    </td>

                                    <td>
                                        <div className="finance-recent-invoices__customer">
                                            <strong>
                                                {invoice.customerName ||
                                                    "Unknown"}
                                            </strong>

                                            <span>
                                                {invoice.customerEmail ||
                                                    "—"}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        {titleCase(
                                            invoice.invoiceType,
                                        )}
                                    </td>

                                    <td>
                                        <strong>
                                            {formatCurrency(
                                                invoice.total,
                                            )}
                                        </strong>
                                    </td>

                                    <td>
                                        {formatCurrency(
                                            invoice.amountPaid,
                                        )}
                                    </td>

                                    <td>
                                        {formatCurrency(
                                            invoice.balanceDue,
                                        )}
                                    </td>

                                    <td>
                                        <span
                                            className={`finance-recent-invoices__status finance-recent-invoices__status--${String(
                                                invoice.status || "",
                                            ).toLowerCase()}`}
                                        >
                                            {titleCase(
                                                invoice.status,
                                            )}
                                        </span>
                                    </td>

                                    <td>
                                        {formatDate(
                                            invoice.createdAt,
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default FinanceRecentInvoices;