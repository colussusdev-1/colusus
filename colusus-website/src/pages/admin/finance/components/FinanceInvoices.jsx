import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import "./FinanceInvoices.css";

const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
};

const formatDate = (date) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

const titleCase = (value) => {
    if (!value) return "—";

    return String(value)
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
        );
};

const FinanceInvoices = ({
    invoices,
    pagination,
    page,
    onPageChange,
    loading,
}) => {
    return (
        <section className="finance-list-panel">
            <div className="finance-list-panel__header">
                <div>
                    <h2>Invoices</h2>
                    <p>
                        Financial documents issued to clients.
                    </p>
                </div>

                <span>
                    {pagination?.total || 0} total
                </span>
            </div>

            {loading ? (
                <div className="finance-list-panel__loading">
                    Loading invoices...
                </div>
            ) : invoices.length === 0 ? (
                <div className="finance-list-panel__empty">
                    No invoices found.
                </div>
            ) : (
                <div className="finance-list-panel__table">
                    <table>
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
                            {invoices.map((invoice) => (
                                <tr key={invoice._id}>
                                    <td>
                                        <strong>
                                            {invoice.invoiceNumber}
                                        </strong>
                                    </td>

                                    <td>
                                        <div className="finance-list-customer">
                                            <strong>
                                                {invoice.customerName}
                                            </strong>
                                            <span>
                                                {invoice.customerEmail}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        {titleCase(
                                            invoice.invoiceType,
                                        )}
                                    </td>

                                    <td>
                                        {formatCurrency(invoice.total)}
                                    </td>

                                    <td>
                                        {formatCurrency(
                                            invoice.amountPaid,
                                        )}
                                    </td>

                                    <td>
                                        <strong>
                                            {formatCurrency(
                                                invoice.balanceDue,
                                            )}
                                        </strong>
                                    </td>

                                    <td>
                                        <span
                                            className={`finance-list-status finance-list-status--${String(
                                                invoice.status || "",
                                            ).toLowerCase()}`}
                                        >
                                            {titleCase(invoice.status)}
                                        </span>
                                    </td>

                                    <td>
                                        {formatDate(invoice.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="finance-pagination">
                <span>
                    Page {pagination?.page || page} of{" "}
                    {pagination?.pages || 1}
                </span>

                <div>
                    <button
                        type="button"
                        disabled={
                            page <= 1 || loading
                        }
                        onClick={() =>
                            onPageChange(page - 1)
                        }
                    >
                        <FiChevronLeft />
                    </button>

                    <button
                        type="button"
                        disabled={
                            page >=
                            (pagination?.pages || 1) ||
                            loading
                        }
                        onClick={() =>
                            onPageChange(page + 1)
                        }
                    >
                        <FiChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FinanceInvoices;