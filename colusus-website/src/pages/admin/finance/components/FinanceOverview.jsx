import FinanceCollection from "./FinanceCollection";
import FinanceRevenue from "./FinanceRevenue";
import FinanceAttention from "./FinanceAttention";
import FinanceRecentPayments from "./FinanceRecentPayments";
import FinanceRecentInvoices from "./FinanceRecentInvoices";

import "./FinanceOverview.css";

const FinanceOverview = ({ overview }) => {
    return (
        <div className="finance-overview">

            <FinanceCollection
                overview={overview}
            />



            <FinanceRevenue
                overview={overview}
            />


            <FinanceAttention
                overview={overview}
            />

            <FinanceRecentPayments
                payments={overview?.recentPayments || []}
            />

            <FinanceRecentInvoices
                invoices={overview?.recentInvoices || []}
            />

        </div>
    );
};

export default FinanceOverview;