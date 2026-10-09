
import api from "./api";

/*
|--------------------------------------------------------------------------
| ADMIN FINANCE SERVICE
|--------------------------------------------------------------------------
|
| All finance requests use the shared API client.
|
| The shared API client is responsible for attaching:
|
| Authorization: Bearer <colossus_token>
|
|--------------------------------------------------------------------------
*/

const adminFinanceService = {

    /* ------------------------------------------------------------------ */
    /* OVERVIEW                                                           */
    /* ------------------------------------------------------------------ */

    getOverview: async ({
        from = null,
        to = null,
    } = {}) => {

        const params = {};

        if (from) {
            params.from = from;
        }

        if (to) {
            params.to = to;
        }

        const response =
            await api.get(
                "/admin/finance/overview",
                {
                    params,
                },
            );

        return response.data?.data;
    },


    /* ------------------------------------------------------------------ */
    /* INVOICES                                                           */
    /* ------------------------------------------------------------------ */

    getInvoices: async ({
        page = 1,
        limit = 20,
        status = null,
        invoiceType = null,
        customerId = null,
        from = null,
        to = null,
        search = null,
    } = {}) => {

        const params = {
            page,
            limit,
        };

        if (status) {
            params.status = status;
        }

        if (invoiceType) {
            params.invoiceType = invoiceType;
        }

        if (customerId) {
            params.customerId = customerId;
        }

        if (from) {
            params.from = from;
        }

        if (to) {
            params.to = to;
        }

        if (search) {
            params.search = search;
        }

        const response =
            await api.get(
                "/admin/finance/invoices",
                {
                    params,
                },
            );

        return response.data?.data;
    },


    /* ------------------------------------------------------------------ */
    /* INVOICE DETAILS                                                    */
    /* ------------------------------------------------------------------ */

    getInvoiceDetails: async (
        invoiceId,
    ) => {

        const response =
            await api.get(
                `/admin/finance/invoices/${invoiceId}`,
            );

        return response.data?.data;
    },


    /* ------------------------------------------------------------------ */
    /* PAYMENTS                                                           */
    /* ------------------------------------------------------------------ */

    getPayments: async ({
        page = 1,
        limit = 20,
        status = null,
        paymentType = null,
        customerId = null,
        from = null,
        to = null,
        search = null,
    } = {}) => {

        const params = {
            page,
            limit,
        };

        if (status) {
            params.status = status;
        }

        if (paymentType) {
            params.paymentType = paymentType;
        }

        if (customerId) {
            params.customerId = customerId;
        }

        if (from) {
            params.from = from;
        }

        if (to) {
            params.to = to;
        }

        if (search) {
            params.search = search;
        }

        const response =
            await api.get(
                "/admin/finance/payments",
                {
                    params,
                },
            );

        return response.data?.data;
    },


    /* ------------------------------------------------------------------ */
    /* PAYMENT DETAILS                                                    */
    /* ------------------------------------------------------------------ */

    getPaymentDetails: async (
        reference,
    ) => {

        const response =
            await api.get(
                `/admin/finance/payments/${encodeURIComponent(reference)}`,
            );

        return response.data?.data;
    },


    /* ------------------------------------------------------------------ */
    /* RECEIPTS                                                           */
    /* ------------------------------------------------------------------ */

    getReceipts: async ({
        page = 1,
        limit = 20,
        paymentType = null,
        customerId = null,
        from = null,
        to = null,
        search = null,
    } = {}) => {

        const params = {
            page,
            limit,
        };

        if (paymentType) {
            params.paymentType = paymentType;
        }

        if (customerId) {
            params.customerId = customerId;
        }

        if (from) {
            params.from = from;
        }

        if (to) {
            params.to = to;
        }

        if (search) {
            params.search = search;
        }

        const response =
            await api.get(
                "/admin/finance/receipts",
                {
                    params,
                },
            );

        return response.data?.data;
    },

};

export default adminFinanceService;

