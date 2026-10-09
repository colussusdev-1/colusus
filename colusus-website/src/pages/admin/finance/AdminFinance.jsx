import { useCallback, useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

import adminFinanceService from "../../../services/adminFinance.service.js";

import FinanceHeader from "./components/FinanceHeader";
import FinanceStats from "./components/FinanceStats";
import FinanceTabs from "./components/FinanceTabs";
import FinanceOverview from "./components/FinanceOverview";
import FinanceInvoices from "./components/FinanceInvoices";
import FinancePayments from "./components/FinancePayements.jsx";
import FinanceReceipts from "./components/FinanceReceipts.jsx";

import "./AdminFinance.css";

const AdminFinance = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [overview, setOverview] = useState(null);

  const [invoices, setInvoices] = useState([]);
  const [invoicePagination, setInvoicePagination] = useState(null);

  const [payments, setPayments] = useState([]);
  const [paymentPagination, setPaymentPagination] = useState(null);

  const [receipts, setReceipts] = useState([]);
  const [receiptPagination, setReceiptPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState("");

  const [invoicePage, setInvoicePage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const [receiptPage, setReceiptPage] = useState(1);

  /* ------------------------------------------------------------------------ */
  /* OVERVIEW                                                                 */
  /* ------------------------------------------------------------------------ */

  const loadOverview = useCallback(async () => {
    try {
      const data = await adminFinanceService.getOverview();

      setOverview(data || null);
    } catch (err) {
      console.error("ADMIN FINANCE OVERVIEW ERROR", err);

      throw err;
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /* INVOICES                                                                 */
  /* ------------------------------------------------------------------------ */

  const loadInvoices = useCallback(async () => {
    const data = await adminFinanceService.getInvoices({
      page: invoicePage,
      limit: 20,
    });

    setInvoices(data?.invoices || []);
    setInvoicePagination(data?.pagination || null);
  }, [invoicePage]);

  /* ------------------------------------------------------------------------ */
  /* PAYMENTS                                                                 */
  /* ------------------------------------------------------------------------ */

  const loadPayments = useCallback(async () => {
    const data = await adminFinanceService.getPayments({
      page: paymentPage,
      limit: 20,
    });

    setPayments(data?.payments || []);
    setPaymentPagination(data?.pagination || null);
  }, [paymentPage]);

  /* ------------------------------------------------------------------------ */
  /* RECEIPTS                                                                 */
  /* ------------------------------------------------------------------------ */

  const loadReceipts = useCallback(async () => {
    const data = await adminFinanceService.getReceipts({
      page: receiptPage,
      limit: 20,
    });

    setReceipts(data?.receipts || []);
    setReceiptPagination(data?.pagination || null);
  }, [receiptPage]);

  /* ------------------------------------------------------------------------ */
  /* INITIAL LOAD                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const loadFinance = async () => {
      try {
        setLoading(true);
        setError("");

        await loadOverview();
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load Finance data.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadFinance();
  }, [loadOverview]);

  /* ------------------------------------------------------------------------ */
  /* TAB LOAD                                                                 */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (activeTab === "overview") {
      return;
    }

    const loadTab = async () => {
      try {
        setTabLoading(true);
        setError("");

        if (activeTab === "invoices") {
          await loadInvoices();
        }

        if (activeTab === "payments") {
          await loadPayments();
        }

        if (activeTab === "receipts") {
          await loadReceipts();
        }
      } catch (err) {
        console.error("ADMIN FINANCE TAB ERROR", err);

        setError(
          err.response?.data?.message ||
          "Unable to load Finance data.",
        );
      } finally {
        setTabLoading(false);
      }
    };

    loadTab();
  }, [
    activeTab,
    loadInvoices,
    loadPayments,
    loadReceipts,
  ]);

  /* ------------------------------------------------------------------------ */
  /* REFRESH                                                                  */
  /* ------------------------------------------------------------------------ */

  const handleRefresh = async () => {
    try {
      setError("");

      if (activeTab === "overview") {
        setTabLoading(true);
        await loadOverview();
      }

      if (activeTab === "invoices") {
        setTabLoading(true);
        await loadInvoices();
      }

      if (activeTab === "payments") {
        setTabLoading(true);
        await loadPayments();
      }

      if (activeTab === "receipts") {
        setTabLoading(true);
        await loadReceipts();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to refresh Finance data.",
      );
    } finally {
      setTabLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="admin-finance">
      <FinanceHeader
        onRefresh={handleRefresh}
        refreshing={tabLoading}
      />

      {error && (
        <div className="admin-finance__error">
          <span>{error}</span>

          <button
            type="button"
            onClick={handleRefresh}
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="admin-finance__loading">
          <div className="admin-finance__spinner" />
          <span>Loading Finance...</span>
        </div>
      ) : (
        <>
          <FinanceStats overview={overview} />

          <FinanceTabs
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <section className="admin-finance__content">
            {activeTab === "overview" && (
              <FinanceOverview
                overview={overview}
              />
            )}

            {activeTab === "invoices" && (
              <FinanceInvoices
                invoices={invoices}
                pagination={invoicePagination}
                page={invoicePage}
                onPageChange={setInvoicePage}
                loading={tabLoading}
              />
            )}

            {activeTab === "payments" && (
              <FinancePayments
                payments={payments}
                pagination={paymentPagination}
                page={paymentPage}
                onPageChange={setPaymentPage}
                loading={tabLoading}
              />
            )}

            {activeTab === "receipts" && (
              <FinanceReceipts
                receipts={receipts}
                pagination={receiptPagination}
                page={receiptPage}
                onPageChange={setReceiptPage}
                loading={tabLoading}
              />
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default AdminFinance;