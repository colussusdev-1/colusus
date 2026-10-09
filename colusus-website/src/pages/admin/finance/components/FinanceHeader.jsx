import {
    FiDollarSign,
    FiRefreshCw,
} from "react-icons/fi";

import "./FinanceHeader.css";

const FinanceHeader = ({
    onRefresh,
    refreshing,
}) => {
    return (
        <header className="finance-header">
            <div className="finance-header__identity">
                <div className="finance-header__icon">
                    <FiDollarSign />
                </div>

                <div>
                    <p className="finance-header__eyebrow">
                        ADMINISTRATION
                    </p>

                    <h1>Finance</h1>

                    <p className="finance-header__description">
                        Monitor invoices, payments, receipts and
                        financial activity.
                    </p>
                </div>
            </div>

            <button
                type="button"
                className="finance-header__refresh"
                onClick={onRefresh}
                disabled={refreshing}
            >
                <FiRefreshCw
                    className={
                        refreshing
                            ? "finance-header__refresh-icon finance-header__refresh-icon--spinning"
                            : "finance-header__refresh-icon"
                    }
                />

                {refreshing ? "Refreshing..." : "Refresh"}
            </button>
        </header>
    );
};

export default FinanceHeader;