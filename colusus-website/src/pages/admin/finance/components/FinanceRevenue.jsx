import { FiTrendingUp } from "react-icons/fi";

import "./FinanceRevenue.css";

const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
};

const titleCase = (value) => {
    if (!value) return "Other";

    return String(value)
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const FinanceRevenue = ({ overview }) => {
    const revenueByType = overview?.revenueByType || {};

    const entries = Object.entries(revenueByType)
        .map(([type, value]) => ({
            type,
            amount: Number(value?.amount) || 0,
            count: Number(value?.count) || 0,
        }))
        .filter((item) => item.amount > 0 || item.count > 0)
        .sort((a, b) => b.amount - a.amount);

    const totalRevenue = entries.reduce(
        (total, item) => total + item.amount,
        0,
    );

    const totalPayments = entries.reduce(
        (total, item) => total + item.count,
        0,
    );

    return (
        <section className="finance-revenue">

            {/* ---------------------------------------------------------------- */}
            {/* HEADER                                                           */}
            {/* ---------------------------------------------------------------- */}

            <header className="finance-revenue__header">

                <div>
                    <span className="finance-revenue__eyebrow">
                        Revenue
                    </span>

                    <h2>
                        Revenue Composition
                    </h2>

                    <p>
                        Successful collections grouped by source.
                    </p>
                </div>

                <div className="finance-revenue__icon">
                    <FiTrendingUp />
                </div>

            </header>

            {/* ---------------------------------------------------------------- */}
            {/* TOTAL                                                            */}
            {/* ---------------------------------------------------------------- */}

            <div className="finance-revenue__hero">

                <div className="finance-revenue__hero-label">
                    <span>
                        Total Collected
                    </span>

                    <span>
                        {totalPayments} payment
                        {totalPayments === 1 ? "" : "s"}
                    </span>
                </div>

                <strong>
                    {formatCurrency(totalRevenue)}
                </strong>

            </div>

            {/* ---------------------------------------------------------------- */}
            {/* COMPOSITION BAR                                                  */}
            {/* ---------------------------------------------------------------- */}

            {entries.length > 0 && totalRevenue > 0 && (
                <div className="finance-revenue__composition">

                    <div className="finance-revenue__composition-header">

                        <span>
                            Collection composition
                        </span>

                        <span>
                            By payment source
                        </span>

                    </div>

                    <div className="finance-revenue__composition-bar">

                        {entries.map((item) => {
                            const percentage =
                                (item.amount / totalRevenue) * 100;

                            return (
                                <div
                                    key={item.type}
                                    className={`finance-revenue__composition-segment finance-revenue__composition-segment--${item.type.toLowerCase()}`}
                                    style={{
                                        width: `${percentage}%`,
                                    }}
                                    title={`${titleCase(item.type)}: ${percentage.toFixed(1)}%`}
                                />
                            );
                        })}

                    </div>

                </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* BREAKDOWN                                                        */}
            {/* ---------------------------------------------------------------- */}

            <div className="finance-revenue__breakdown">

                <div className="finance-revenue__breakdown-header">

                    <span>
                        Revenue source
                    </span>

                    <span>
                        Amount
                    </span>

                </div>

                {entries.length === 0 ? (

                    <div className="finance-revenue__empty">
                        No revenue data available.
                    </div>

                ) : (

                    <div className="finance-revenue__list">

                        {entries.map((item, index) => {

                            const percentage =
                                totalRevenue > 0
                                    ? (item.amount / totalRevenue) * 100
                                    : 0;

                            return (
                                <div
                                    className="finance-revenue__item"
                                    key={item.type}
                                >

                                    <div className="finance-revenue__item-main">

                                        <span className="finance-revenue__rank">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <div className="finance-revenue__item-info">

                                            <strong>
                                                {titleCase(item.type)}
                                            </strong>

                                            <span>
                                                {item.count} payment
                                                {item.count === 1
                                                    ? ""
                                                    : "s"}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="finance-revenue__item-finance">

                                        <strong>
                                            {formatCurrency(item.amount)}
                                        </strong>

                                        <span>
                                            {percentage.toFixed(1)}%
                                        </span>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

        </section>
    );
};

export default FinanceRevenue;