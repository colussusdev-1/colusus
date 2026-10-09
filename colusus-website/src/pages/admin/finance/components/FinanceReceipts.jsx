import {
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";

import "./FinanceReceipts.css";

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

const FinanceReceipts = ({
    receipts,
    pagination,
    page,
    onPageChange,
    loading,
}) => {
    return (
        <section className="finance-list-panel">
            <div className="finance-list-panel__header">
                <div>
                    <h2>Receipts</h2>
                    <p>
                        Historical records of successful payments.
                    </p>
                </div>

                <span>
                    {pagination?.total || 0} total
                </span>
            </div>

            {loading ? (
                <div className="finance-list-panel__loading">
                    Loading receipts...
                </div>
            ) : receipts.length === 0 ? (
                <div className="finance-list-panel__empty">
                    No receipts found.
                </div>
            ) : (
                <div className="finance-list-panel__table">
                    <table>
                        <thead>
                            <tr>
                                <th>Receipt</th>
                                <th>Payment</th>
                                <th>Customer</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Paid</th>
                            </tr>
                        </thead>

                        <tbody>
                            {receipts.map((receipt) => (
                                <tr key={receipt._id}>
                                    <td>
                                        <strong>
                                            {receipt.receiptNumber}
                                        </strong>
                                    </td>

                                    <td>
                                        {receipt.paymentReference ||
                                            "—"}
                                    </td>

                                    <td>
                                        <div className="finance-list-customer">
                                            <strong>
                                                {receipt.customerName}
                                            </strong>
                                            <span>
                                                {receipt.customerEmail}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        {titleCase(
                                            receipt.paymentType,
                                        )}
                                    </td>

                                    <td>
                                        <strong>
                                            {formatCurrency(
                                                receipt.amount,
                                            )}
                                        </strong>
                                    </td>

                                    <td>
                                        <span
                                            className={`finance-receipt-status finance-receipt-status--${String(
                                                receipt.status || "",
                                            ).toLowerCase()}`}
                                        >
                                            {titleCase(receipt.status)}
                                        </span>
                                    </td>

                                    <td>
                                        {formatDate(receipt.paidAt)}
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

export default FinanceReceipts;