import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./pages/Home/sections/Footer/Footer";

import WhatsAppFloat from "./components/WhatsAppFloat";
import ConsultationPaymentSuccess from "./components/ConsultationBooking/ConsultationPaymentSuccess";
/* ======================================================
   PUBLIC WEBSITE PAGES
====================================================== */

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";

import CanadaMigration
    from "./pages/Services/CanadaMigration/CanadaMigration";

import GlobalWorkImmigration
    from "./pages/Services/GlobalWorkImmigration/GlobalWorkImmigration";

import TouristVisa
    from "./pages/Services/TouristVisa/TouristVisa";

import IrelandNursing
    from "./pages/Services/Ireland-nursing/IrelandNursing";

import Blog
    from "./pages/Blog/Blog";

import BlogPost
    from "./pages/BlogPost/BlogPost";

import Shop
    from "./pages/Shop/Shop";

import Contact
    from "./pages/Contact/Contact";

import Webinar
    from "./pages/Webinar/Webinar";

import Opportunities
    from "./pages/Opportunities/Opportunities";

import OpportunityDetails
    from "./pages/Opportunities/OpportunityDetails/OpportunityDetails";

import Pathways
    from "./pages/pathways/Pathways";

import Assessment
    from "./features/assessment/Assessment";

import ConsultationBooking
    from "./components/ConsultationBooking/ConsultationBooking";

/* ======================================================
   CLIENT PORTAL PAGES
====================================================== */

import NewApplication
    from "./pages/Client/NewApplication";

import PortalLayout
    from "./components/ClientPortal/PortalLayout/PortalLayout";

import ProtectedRoute
    from "./components/ClientPortal/ProtectedRoute";

import ClientDashboard
    from "./pages/Client/ClientDashboard";

import ClientFinance
    from "./components/ClientPortal/finance/ClientFinance";

import Applications
    from "./pages/Client/Applications";

import ApplicationDetail
    from "./pages/Client/ApplicationDetails";

import Documents
    from "./pages/Client/Documents";

import DocumentViewer
    from "./components/ClientPortal/dashboard/Documents/DocumentViewer/DocumentViewer";

import ClientUpdates
    from "./pages/Client/Updates/ClientUpdates";

import Profile
    from "./pages/Client/Profile";

/* ======================================================
   AUTHENTICATION
====================================================== */

import AdminLogin
    from "./pages/admin/Auth/AdminLogin";

import AdminRoleRoute
    from "./pages/admin/Auth/AdminRoleRoute";

import Login
    from "./pages/Auth/Login";

import Register
    from "./pages/Auth/Register";

import PaymentCallback
    from "./pages/Client/PaymentCallback";

/* ======================================================
   ADMIN OPERATIONS
====================================================== */

import AdminLayout
    from "./pages/admin/layout/AdminLayout";

import AdminOverview
    from "./pages/admin/overview/AdminOverview";

import AdminApplications
    from "./pages/admin/Applications/AdminApplications";

import AdminApplicationDetails
    from "./pages/admin/Applications/components/ApplicationDetails/AdminApplicationDetails";

import AdminConsultations
    from "./pages/admin/consultations/AdminConsultations";

import AdminClients
    from "./pages/admin/clients/AdminClients";

import AdminClientDetails
    from "./pages/admin/clients/AdminClientDetails";

import AdminDocuments
    from "./pages/admin/documents/AdminDocuments";

import AdminForms
    from "./pages/admin/forms/AdminForms";

import AdminFormSubmissions
    from "./pages/admin/forms/AdminFormSubmissions";

import AdminFormSubmissionDetails
    from "./pages/admin/forms/AdminFormSubmissionDetails";

import AdminFormSubmissionDocumentViewer
    from "./pages/admin/forms/AdminFormSubmissionDocumentViewer";

import AdminNotifications
    from "./pages/admin/notifications/AdminNotifications";

import AdminOpportunities
    from "./pages/admin/opportunities/AdminOpportunities";

import OpportunityForm
    from "./pages/admin/opportunities/OpportunityForm";

import AdminBlog
    from "./pages/admin/blog/AdminBlog";

import AdminBlogEditor
    from "./pages/admin/blog/AdminBlogEditor";

import AdminStaff
    from "./pages/admin/staff-management/AdminStaff";

import AdminStaffDetails
    from "./pages/admin/staff-management/AdminStaffDetails";

import AdminCreateStaff
    from "./pages/admin/staff-management/AdminCreateStaff";

import StaffRoutes
    from "./pages/admin/staff/staff.routes";

/* ======================================================
   ADMIN FINANCE
====================================================== */

import AdminFinance
    from "./pages/admin/finance/AdminFinance";

import DestinationsPage
    from "./pages/admin/opportunities/destinations/DestinationsPage";

/* ======================================================
   WEBMAIL
====================================================== */

import Webmailer
    from "./pages/Webmailer/Webmailer";

/* ======================================================
   PUBLIC WEBSITE WHATSAPP BUTTON
====================================================== */


import TraineeApprenticeship
    from "./pages/Services/TraineeApprenticeship/TraineeApprenticeship";
import NewZealandTraineeApprenticeship from "./pages/Services/TraineeApprenticeship/NewZealandTraineeApprenticeship";
import AustraliaTraineeApprenticeship from "./pages/Services/TraineeApprenticeship/AustraliaTraineeApprenticeship";
/**
 * Display the WhatsApp floating button on public website pages.
 *
 * Hide it on:
 * - Admin operations
 * - Staff workspace
 * - Client portal
 * - Authentication pages
 * - Payment callback
 * - Webmail
 */
function PublicWhatsAppFloat() {
    const { pathname } = useLocation();

    const isRestrictedArea =
        pathname === "/admin" ||
        pathname.startsWith("/admin/") ||

        pathname === "/portal" ||
        pathname.startsWith("/portal/") ||

        pathname === "/login" ||
        pathname === "/register" ||

        pathname === "/payment/callback" ||

        pathname === "/webmail";

    if (isRestrictedArea) {
        return null;
    }

    return <WhatsAppFloat />;
}

/* ======================================================
   APP
====================================================== */

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />

            {/* Public website floating WhatsApp button */}
            <PublicWhatsAppFloat />

            <Routes>

                {/* ======================================================
                    PUBLIC WEBSITE
                ====================================================== */}

                <Route
                    path="/"
                    element={
                        <>
                            <Navbar />
                            <Home />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/about"
                    element={
                        <>
                            <Navbar />
                            <About />
                            <Footer />
                        </>
                    }
                />

                {/* ======================================================
                    PAYMENT CALLBACK
                ====================================================== */}

                <Route
                    path="/payment/callback"
                    element={<PaymentCallback />}
                />

                {/* ======================================================
                    SERVICES
                ====================================================== */}

                <Route
                    path="/services"
                    element={
                        <>
                            <Navbar />
                            <Services />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/services/canada-migration"
                    element={
                        <>
                            <Navbar />
                            <CanadaMigration />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/services/global-works"
                    element={
                        <>
                            <Navbar />
                            <GlobalWorkImmigration />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/services/tourist-visa"
                    element={
                        <>
                            <Navbar />
                            <TouristVisa />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/services/ireland-nursing"
                    element={
                        <>
                            <Navbar />
                            <IrelandNursing />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/services/trainee-apprenticeship"
                    element={
                        <>
                            <Navbar />
                            <TraineeApprenticeship />
                            <Footer />
                        </>
                    }
                />
                  <Route
                    path="/services/new-zealand-trainee-apprenticeship"
                    element={
                        <>
                            <Navbar />
                            <NewZealandTraineeApprenticeship />
                            <Footer />
                        </>
                    }
                />
                 <Route
                    path="/services/australia-trainee-apprenticeship"
                    element={
                        <>
                            <Navbar />
                            <AustraliaTraineeApprenticeship />
                            <Footer />
                        </>
                    }
                />

                {/* ======================================================
                    PATHWAYS CATALOGUE
                ====================================================== */}

                <Route
                    path="/pathways"
                    element={
                        <>
                            <Navbar />
                            <Pathways />
                            <Footer />
                        </>
                    }
                />

                {/* ======================================================
                    WEBINAR
                ====================================================== */}

                <Route
                    path="/irelandnursingwebinar"
                    element={<Webinar />}
                />

                {/* ======================================================
                    OPPORTUNITIES
                ====================================================== */}

                <Route
                    path="/opportunities/:country"
                    element={
                        <>
                            <Navbar />
                            <Opportunities />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/opportunities/:country/:slug"
                    element={
                        <>
                            <Navbar />
                            <OpportunityDetails />
                            <Footer />
                        </>
                    }
                />

                {/* ======================================================
                    BLOG
                ====================================================== */}

                <Route
                    path="/blog"
                    element={
                        <>
                            <Navbar />
                            <Blog />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/blog/:slug"
                    element={
                        <>
                            <Navbar />
                            <BlogPost />
                            <Footer />
                        </>
                    }
                />

                {/* ======================================================
                    SHOP
                ====================================================== */}

                <Route
                    path="/shop"
                    element={
                        <>
                            <Navbar />
                            <Shop />
                            <Footer />
                        </>
                    }
                />

                {/* ======================================================
                    CONTACT
                ====================================================== */}

                <Route
                    path="/contact"
                    element={
                        <>
                            <Navbar />
                            <Contact />
                            <Footer />
                        </>
                    }
                />

                {/* ======================================================
                    PUBLIC MIGRATION ASSESSMENT
                ====================================================== */}

                <Route
                    path="/free-assessment"
                    element={
                        <>
                            <Navbar />
                            <Assessment />
                            <Footer />
                        </>
                    }
                />

                {/* ======================================================
                    CONSULTATION
                ====================================================== */}

                <Route
                    path="/consultation"
                    element={
                        <>
                            <Navbar />
                            <ConsultationBooking />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/consultation/payment-success"
                    element={<ConsultationPaymentSuccess />}
                />

                {/* ======================================================
                    WEBMAIL
                ====================================================== */}

                <Route
                    path="/webmail"
                    element={<Webmailer />}
                />

                {/* ======================================================
                    CLIENT AUTHENTICATION
                ====================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* ======================================================
                    SHARED OPERATIONS LOGIN
                ====================================================== */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                {/* ======================================================
                    ADMIN OPERATIONS PORTAL
                    ADMIN ONLY
                ====================================================== */}

                <Route
                    element={
                        <AdminRoleRoute
                            allowedRoles={["ADMIN"]}
                        />
                    }
                >
                    <Route
                        path="/admin"
                        element={<AdminLayout />}
                    >
                        {/* ADMIN OVERVIEW */}

                        <Route
                            index
                            element={<AdminOverview />}
                        />

                        {/* APPLICATIONS */}

                        <Route
                            path="applications"
                            element={<AdminApplications />}
                        />

                        <Route
                            path="applications/:id"
                            element={<AdminApplicationDetails />}
                        />

                        {/* OPPORTUNITIES */}

                        <Route
                            path="opportunities"
                            element={<AdminOpportunities />}
                        />

                        <Route
                            path="opportunities/new"
                            element={<OpportunityForm />}
                        />

                        <Route
                            path="opportunities/:id/edit"
                            element={<OpportunityForm />}
                        />

                        <Route
                            path="opportunities/destinations"
                            element={<DestinationsPage />}
                        />

                        {/* CONSULTATIONS */}

                        <Route
                            path="consultations"
                            element={<AdminConsultations />}
                        />

                        {/* FINANCE */}

                        <Route
                            path="finance"
                            element={<AdminFinance />}
                        />

                        {/* CLIENTS */}

                        <Route
                            path="clients"
                            element={<AdminClients />}
                        />

                        <Route
                            path="clients/:id"
                            element={<AdminClientDetails />}
                        />

                        {/* DOCUMENTS */}

                        <Route
                            path="documents"
                            element={<AdminDocuments />}
                        />

                        {/* PUBLIC FORM SUBMISSIONS */}

                        <Route
                            path="forms"
                            element={<AdminForms />}
                        />

                        <Route
                            path="forms/:formKey"
                            element={<AdminFormSubmissions />}
                        />

                        <Route
                            path="forms/:formKey/:submissionId"
                            element={<AdminFormSubmissionDetails />}
                        />

                        <Route
                            path="forms/:formKey/:submissionId/documents/:documentId"
                            element={<AdminFormSubmissionDocumentViewer />}
                        />

                        {/* BLOG */}

                        <Route
                            path="blog"
                            element={<AdminBlog />}
                        />

                        <Route
                            path="blog/new"
                            element={<AdminBlogEditor />}
                        />

                        <Route
                            path="blog/:id/edit"
                            element={<AdminBlogEditor />}
                        />

                        {/* NOTIFICATIONS */}

                        <Route
                            path="notifications"
                            element={<AdminNotifications />}
                        />

                        {/* STAFF MANAGEMENT */}

                        <Route
                            path="staff-management"
                            element={<AdminStaff />}
                        />

                        <Route
                            path="staff-management/new"
                            element={<AdminCreateStaff />}
                        />

                        <Route
                            path="staff-management/:id"
                            element={<AdminStaffDetails />}
                        />
                    </Route>
                </Route>

                {/* ======================================================
                    STAFF OPERATIONS WORKSPACE
                    STAFF ONLY
                ====================================================== */}

                <Route
                    element={
                        <AdminRoleRoute
                            allowedRoles={["STAFF"]}
                        />
                    }
                >
                    <Route
                        path="/admin"
                        element={<AdminLayout />}
                    >
                        <Route
                            path="staff/*"
                            element={<StaffRoutes />}
                        />
                    </Route>
                </Route>

                {/* ======================================================
                    PROTECTED CLIENT PORTAL
                ====================================================== */}

                <Route
                    element={<ProtectedRoute />}
                >
                    <Route
                        path="/portal"
                        element={<PortalLayout />}
                    >
                        {/* CLIENT DASHBOARD */}

                        <Route
                            index
                            element={<ClientDashboard />}
                        />

                        {/* CLIENT APPLICATIONS */}

                        <Route
                            path="applications"
                            element={<Applications />}
                        />

                        <Route
                            path="applications/new"
                            element={<NewApplication />}
                        />

                        <Route
                            path="applications/:id"
                            element={<ApplicationDetail />}
                        />

                        {/* CLIENT DOCUMENTS */}

                        <Route
                            path="documents"
                            element={<Documents />}
                        />

                        <Route
                            path="documents/:documentId/view"
                            element={<DocumentViewer />}
                        />

                        {/* CLIENT FINANCE */}

                        <Route
                            path="finance"
                            element={<ClientFinance />}
                        />

                        {/* CLIENT UPDATES */}

                        <Route
                            path="updates"
                            element={<ClientUpdates />}
                        />

                        {/* CLIENT PROFILE */}

                        <Route
                            path="profile"
                            element={<Profile />}
                        />

                        {/* CLIENT ELIGIBILITY ASSESSMENT */}

                        <Route
                            path="assessment"
                            element={<Assessment />}
                        />
                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;