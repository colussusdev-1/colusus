import {
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiCreditCard,
    FiFileText,
    FiTrendingUp,
    FiXCircle,
} from "react-icons/fi";

import "./FinanceStats.css";

const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
};

const FinanceStats = ({ overview }) => {
    const financials = overview?.financials || {};
    const payments = overview?.payments || {};

    const stats = [
        {
            label: "Total Invoiced",
            value: formatCurrency(financials.totalInvoiced),
            icon: FiFileText,
            className: "invoiced",
            description: "Issued financial value",
        },
        {
            label: "Total Collected",
            value: formatCurrency(financials.totalCollected),
            icon: FiTrendingUp,
            className: "collected",
            description: "Money successfully collected",
        },
        {
            label: "Outstanding",
            value: formatCurrency(
                financials.outstandingBalance,
            ),
            icon: FiAlertCircle,
            className: "outstanding",
            description: "Balance still to collect",
        },
        {
            label: "Successful Payments",
            value: formatCurrency(
                financials.successfulPaymentAmount,
            ),
            icon: FiCheckCircle,
            className: "successful",
            description: "Successful transaction value",
        },
        {
            label: "Processing",
            value: String(
                payments.processing?.count || 0,
            ),
            icon: FiClock,
            className: "processing",
            description: "Awaiting completion",
        },
        {
            label: "Failed",
            value: String(
                payments.failed?.count || 0,
            ),
            icon: FiXCircle,
            className: "failed",
            description: "Transactions requiring review",
        },
    ];

    return (
        <section className="finance-stats">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <article
                        key={stat.label}
                        className={`finance-stat finance-stat--${stat.className}`}
                    >
                        <div className="finance-stat__header">
                            <div className="finance-stat__icon">
                                <Icon />
                            </div>

                            <span className="finance-stat__label">
                                {stat.label}
                            </span>
                        </div>

                        <div className="finance-stat__content">
                            <strong>{stat.value}</strong>

                            <span className="finance-stat__description">
                                {stat.description}
                            </span>
                        </div>

                        <div className="finance-stat__accent" />
                    </article>
                );
            })}
        </section>
    );
};

export default FinanceStats;