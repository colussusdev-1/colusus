import { FiDollarSign } from "react-icons/fi";

import "./FinanceCollection.css";

const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
};

const FinanceCollection = ({ overview }) => {
    const financials = overview?.financials || {};

    const totalInvoiced =
        Number(financials.totalInvoiced) || 0;

    const totalCollected =
        Number(financials.totalCollected) || 0;

    const outstandingBalance =
        Number(financials.outstandingBalance) || 0;

    const collectionRate =
        totalInvoiced > 0
            ? Math.min(
                100,
                (totalCollected / totalInvoiced) * 100,
            )
            : 0;

    return (
        <section className="finance-collection">
            <div className="finance-collection__header">
                <div>
                    <span className="finance-collection__eyebrow">
                        Financial Position
                    </span>

                    <h2>Collection Overview</h2>

                    <p>
                        Invoiced value versus successfully collected
                        revenue.
                    </p>
                </div>

                <div className="finance-collection__icon">
                    <FiDollarSign />
                </div>
            </div>

            <div className="finance-collection__body">
                <div className="finance-collection__main">
                    <span className="finance-collection__label">
                        Total Invoiced
                    </span>

                    <strong className="finance-collection__total">
                        {formatCurrency(totalInvoiced)}
                    </strong>

                    <div className="finance-collection__progress">
                        <div className="finance-collection__progress-meta">
                            <span>Collection rate</span>

                            <strong>
                                {collectionRate.toFixed(1)}%
                            </strong>
                        </div>

                        <div className="finance-collection__track">
                            <div
                                className="finance-collection__bar"
                                style={{
                                    width: `${collectionRate}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="finance-collection__breakdown">
                    <div className="finance-collection__metric">
                        <span>
                            <i className="finance-collection__dot finance-collection__dot--collected" />
                            Collected
                        </span>

                        <strong className="finance-collection__metric-value--collected">
                            {formatCurrency(totalCollected)}
                        </strong>
                    </div>

                    <div className="finance-collection__metric">
                        <span>
                            <i className="finance-collection__dot finance-collection__dot--outstanding" />
                            Outstanding
                        </span>

                        <strong className="finance-collection__metric-value--outstanding">
                            {formatCurrency(
                                outstandingBalance,
                            )}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="finance-collection__footer">
                <span>
                    {formatCurrency(totalCollected)} collected
                </span>

                <span>
                    {formatCurrency(outstandingBalance)} remaining
                </span>
            </div>
        </section>
    );
};

export default FinanceCollection;