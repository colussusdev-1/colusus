import { FiCreditCard } from "react-icons/fi";

import "./FinanceRecentPayments.css";

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

const FinanceRecentPayments = ({ payments = [] }) => {
    return (
        <section className="finance-recent-payments">
            <div className="finance-recent-payments__header">
                <div>
                    <span className="finance-recent-payments__eyebrow">
                        Transactions
                    </span>

                    <h2>Recent Payments</h2>

                    <p>
                        Latest payment activity across the platform.
                    </p>
                </div>

                <div className="finance-recent-payments__icon">
                    <FiCreditCard />
                </div>
            </div>

            {payments.length === 0 ? (
                <div className="finance-recent-payments__empty">
                    No payments found.
                </div>
            ) : (
                <div className="finance-recent-payments__table-wrap">
                    <table className="finance-recent-payments__table">
                        <thead>
                            <tr>
                                <th>Reference</th>
                                <th>Customer</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Provider</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payments.map((payment, index) => (
                                <tr
                                    key={
                                        payment.reference ||
                                        payment._id ||
                                        index
                                    }
                                >
                                    <td>
                                        <strong>
                                            {payment.reference || "—"}
                                        </strong>
                                    </td>

                                    <td>
                                        <div className="finance-recent-payments__customer">
                                            <strong>
                                                {payment.customerName ||
                                                    "Unknown"}
                                            </strong>

                                            <span>
                                                {payment.customerEmail ||
                                                    "—"}
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
                                        {titleCase(
                                            payment.provider,
                                        )}
                                    </td>

                                    <td>
                                        <span
                                            className={`finance-recent-payments__status finance-recent-payments__status--${String(
                                                payment.status || "",
                                            ).toLowerCase()}`}
                                        >
                                            {titleCase(
                                                payment.status,
                                            )}
                                        </span>
                                    </td>

                                    <td>
                                        {formatDate(
                                            payment.createdAt,
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

export default FinanceRecentPayments;