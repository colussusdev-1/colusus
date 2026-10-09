import {
    FiAlertCircle,
    FiClock,
    FiFileText,
    FiXCircle,
} from "react-icons/fi";

import "./FinanceAttention.css";

const FinanceAttention = ({ overview }) => {
    const payments = overview?.payments || {};
    const recentPayments = overview?.recentPayments || [];
    const recentInvoices = overview?.recentInvoices || [];

    const processingCount =
        Number(payments.processing?.count) || 0;

    const failedCount =
        Number(payments.failed?.count) || 0;

    const overdueInvoices = recentInvoices.filter(
        (invoice) =>
            String(invoice.status || "").toUpperCase() ===
            "OVERDUE",
    );

    const attentionItems = [];

    if (failedCount > 0) {
        attentionItems.push({
            key: "failed-payments",
            type: "error",
            icon: FiXCircle,
            title: "Failed payments",
            description: `${failedCount} payment${failedCount === 1 ? "" : "s"
                } require attention.`,
            count: failedCount,
        });
    }

    if (processingCount > 0) {
        attentionItems.push({
            key: "processing-payments",
            type: "warning",
            icon: FiClock,
            title: "Processing payments",
            description: `${processingCount} payment${processingCount === 1 ? "" : "s"
                } are still processing.`,
            count: processingCount,
        });
    }

    if (overdueInvoices.length > 0) {
        attentionItems.push({
            key: "overdue-invoices",
            type: "warning",
            icon: FiFileText,
            title: "Overdue invoices",
            description: `${overdueInvoices.length} recent invoice${overdueInvoices.length === 1 ? "" : "s"
                } are overdue.`,
            count: overdueInvoices.length,
        });
    }

    return (
        <section className="finance-attention">
            <div className="finance-attention__header">
                <div>
                    <span className="finance-attention__eyebrow">
                        Action Required
                    </span>

                    <h2>Needs Attention</h2>

                    <p>
                        Financial activity that may require review.
                    </p>
                </div>

                <FiAlertCircle />
            </div>

            {attentionItems.length === 0 ? (
                <div className="finance-attention__empty">
                    <div className="finance-attention__empty-icon">
                        <FiAlertCircle />
                    </div>

                    <div>
                        <strong>Everything looks good</strong>

                        <span>
                            No payment or invoice issues require
                            attention right now.
                        </span>
                    </div>
                </div>
            ) : (
                <div className="finance-attention__list">
                    {attentionItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                className={`finance-attention__item finance-attention__item--${item.type}`}
                                key={item.key}
                            >
                                <div
                                    className={`finance-attention__icon finance-attention__icon--${item.type}`}
                                >
                                    <Icon />
                                </div>

                                <div className="finance-attention__content">
                                    <strong>
                                        {item.title}
                                    </strong>

                                    <span>
                                        {item.description}
                                    </span>
                                </div>

                                <strong className="finance-attention__count">
                                    {item.count}
                                </strong>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default FinanceAttention;