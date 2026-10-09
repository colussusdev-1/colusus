import {
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";

import "./FinancePayments.css";

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

const FinancePayments = ({
    payments,
    pagination,
    page,
    onPageChange,
    loading,
}) => {
    return (
        <section className="finance-list-panel">
            <div className="finance-list-panel__header">
                <div>
                    <h2>Payments</h2>
                    <p>
                        Payment transactions across Finance.
                    </p>
                </div>

                <span>
                    {pagination?.total || 0} total
                </span>
            </div>

            {loading ? (
                <div className="finance-list-panel__loading">
                    Loading payments...
                </div>
            ) : payments.length === 0 ? (
                <div className="finance-list-panel__empty">
                    No payments found.
                </div>
            ) : (
                <div className="finance-list-panel__table">
                    <table>
                        <thead>
                            <tr>
                                <th>Reference</th>
                                <th>Customer</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Provider</th>
                                <th>Status</th>
                                <th>Transaction</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment._id}>
                                    <td>
                                        <strong>
                                            {payment.reference}
                                        </strong>
                                    </td>

                                    <td>
                                        <div className="finance-list-customer">
                                            <strong>
                                                {payment.customerName}
                                            </strong>
                                            <span>
                                                {payment.customerEmail}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        {titleCase(
                                            payment.paymentType,
                                        )}
                                    </td>

                                    <td>
                                        <strong>
                                            {formatCurrency(
                                                payment.amount,
                                            )}
                                        </strong>
                                    </td>

                                    <td>
                                        {payment.provider || "—"}
                                    </td>

                                    <td>
                                        <span
                                            className={`finance-payment-status finance-payment-status--${String(
                                                payment.status || "",
                                            ).toLowerCase()}`}
                                        >
                                            {titleCase(payment.status)}
                                        </span>
                                    </td>

                                    <td>
                                        {payment.transactionId || "—"}
                                    </td>

                                    <td>
                                        {formatDate(payment.createdAt)}
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

export default FinancePayments;