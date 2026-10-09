import {
    FiBarChart2,
    FiCheckCircle,
    FiCreditCard,
    FiFileText,
} from "react-icons/fi";

import "./FinanceTabs.css";

const tabs = [
    {
        id: "overview",
        label: "Overview",
        description: "Financial summary",
        icon: FiBarChart2,
    },
    {
        id: "invoices",
        label: "Invoices",
        description: "Billing records",
        icon: FiFileText,
    },
    {
        id: "payments",
        label: "Payments",
        description: "Transactions",
        icon: FiCreditCard,
    },
    {
        id: "receipts",
        label: "Receipts",
        description: "Payment records",
        icon: FiCheckCircle,
    },
];

const FinanceTabs = ({ activeTab, onChange }) => {
    return (
        <nav className="finance-tabs" aria-label="Finance sections">
            <div className="finance-tabs__inner">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            className={
                                isActive
                                    ? "finance-tab finance-tab--active"
                                    : "finance-tab"
                            }
                            onClick={() => onChange(tab.id)}
                            aria-current={
                                isActive ? "page" : undefined
                            }
                        >
                            <span className="finance-tab__icon">
                                <Icon />
                            </span>

                            <span className="finance-tab__content">
                                <span className="finance-tab__label">
                                    {tab.label}
                                </span>

                                <span className="finance-tab__description">
                                    {tab.description}
                                </span>
                            </span>

                            {isActive && (
                                <span className="finance-tab__indicator" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default FinanceTabs;