import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./pages/Home/sections/Footer/Footer";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";

import CanadaMigration
    from "./pages/Services/CanadaMigration/CanadaMigration";

import GlobalWorkImmigration
    from "./pages/Services/GlobalWorkImmigration/GlobalWorkImmigration";

import TouristVisa
    from "./pages/Services/TouristVisa/TouristVisa";

import Blog from "./pages/Blog/Blog";
import Shop from "./pages/Shop/Shop";
import Contact from "./pages/Contact/Contact";


/*
|--------------------------------------------------------------------------
| WEBINAR
|--------------------------------------------------------------------------
*/

import Webinar
    from "./pages/Webinar/Webinar";


/*
|--------------------------------------------------------------------------
| OPPORTUNITIES
|--------------------------------------------------------------------------
*/

import Opportunities
    from "./pages/Opportunities/Opportunities";

import OpportunityDetails
    from "./pages/Opportunities/OpportunityDetails/OpportunityDetails";


/*
|--------------------------------------------------------------------------
| DYNAMIC MIGRATION ASSESSMENT
|--------------------------------------------------------------------------
*/

import Assessment
    from "./features/assessment/Assessment";

import ConsultationBooking
    from "./components/ConsultationBooking/ConsultationBooking";

import NewApplication
    from "./pages/Client/NewApplication";

import Webmailer
    from "./pages/Webmailer/Webmailer";


/*
|--------------------------------------------------------------------------
| CLIENT PORTAL
|--------------------------------------------------------------------------
*/

import PortalLayout
    from "./components/ClientPortal/PortalLayout/PortalLayout";

import ProtectedRoute
    from "./components/ClientPortal/ProtectedRoute";

import ClientDashboard
    from "./pages/Client/ClientDashboard";

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


/*
|--------------------------------------------------------------------------
| OPERATIONS AUTHENTICATION
|--------------------------------------------------------------------------
*/

import AdminLogin
    from "./pages/admin/Auth/AdminLogin";


/*
|--------------------------------------------------------------------------
| OPERATIONS LAYOUT
|--------------------------------------------------------------------------
|
| Shared by ADMIN and STAFF.
|
*/

import AdminLayout
    from "./pages/admin/layout/AdminLayout";


/*
|--------------------------------------------------------------------------
| ADMIN PAGES
|--------------------------------------------------------------------------
*/

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

import AdminNotifications
    from "./pages/admin/notifications/AdminNotifications";


/*
|--------------------------------------------------------------------------
| STAFF
|--------------------------------------------------------------------------
|
| Staff belongs inside:
|
| pages/admin/staff/
|
| Staff uses the shared AdminLayout.
|
| StaffRoutes is responsible for all Staff sub-routes:
|
| /admin/staff
| /admin/staff/applications
| /admin/staff/applications/:id
| /admin/staff/profile
|
*/

import StaffRoutes
    from "./pages/admin/staff/staff.routes";


/*
|--------------------------------------------------------------------------
| ROLE GUARD
|--------------------------------------------------------------------------
*/

import AdminRoleRoute
    from "./pages/admin/Auth/AdminRoleRoute";


/*
|--------------------------------------------------------------------------
| CLIENT AUTHENTICATION
|--------------------------------------------------------------------------
*/

import Login
    from "./pages/Auth/Login";

import Register
    from "./pages/Auth/Register";


function App() {

    return (

        <BrowserRouter>

            <ScrollToTop />

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


                {/* ======================================================
                    WEBINAR
                    ====================================================== */}

                <Route
                    path="/irelandnursingwebinar"
                    element={
                        <Webinar />
                    }
                />


                {/* ======================================================
                    OPPORTUNITIES
                    ====================================================== */}

                {/* Country opportunity listing */}

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


                {/* Individual opportunity / pathway */}

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
                    BLOG / SHOP / CONTACT
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
                    path="/shop"
                    element={
                        <>
                            <Navbar />
                            <Shop />
                            <Footer />
                        </>
                    }
                />


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


                {/* ======================================================
                    WEBMAIL
                    ====================================================== */}

                <Route
                    path="/webmail"
                    element={
                        <Webmailer />
                    }
                />


                {/* ======================================================
                    CLIENT AUTHENTICATION
                    ====================================================== */}

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />


                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                {/* ======================================================
                    SHARED OPERATIONS LOGIN
                    ====================================================== */}

                <Route
                    path="/admin/login"
                    element={
                        <AdminLogin />
                    }
                />


                {/* ======================================================
                    ADMIN OPERATIONS PORTAL
                    ======================================================

                    ADMIN ONLY.

                    STAFF CANNOT ENTER THESE ROUTES.

                    The AdminLayout is shared with Staff, but these
                    routes are protected specifically for ADMIN users.

                ====================================================== */}

                <Route
                    element={
                        <AdminRoleRoute
                            allowedRoles={[
                                "ADMIN",
                            ]}
                        />
                    }
                >

                    <Route
                        path="/admin"
                        element={
                            <AdminLayout />
                        }
                    >

                        {/* ==================================================
                            ADMIN OVERVIEW
                        ================================================== */}

                        <Route
                            index
                            element={
                                <AdminOverview />
                            }
                        />


                        {/* ==================================================
                            APPLICATIONS
                        ================================================== */}

                        <Route
                            path="applications"
                            element={
                                <AdminApplications />
                            }
                        />


                        <Route
                            path="applications/:id"
                            element={
                                <AdminApplicationDetails />
                            }
                        />


                        {/* ==================================================
                            CONSULTATIONS
                        ================================================== */}

                        <Route
                            path="consultations"
                            element={
                                <AdminConsultations />
                            }
                        />


                        {/* ==================================================
                            CLIENTS
                        ================================================== */}

                        <Route
                            path="clients"
                            element={
                                <AdminClients />
                            }
                        />


                        <Route
                            path="clients/:id"
                            element={
                                <AdminClientDetails />
                            }
                        />


                        {/* ==================================================
                            DOCUMENTS
                        ================================================== */}

                        <Route
                            path="documents"
                            element={
                                <AdminDocuments />
                            }
                        />


                        {/* ==================================================
                            NOTIFICATIONS
                        ================================================== */}

                        <Route
                            path="notifications"
                            element={
                                <AdminNotifications />
                            }
                        />

                    </Route>

                </Route>


                {/* ======================================================
                    STAFF OPERATIONS WORKSPACE
                    ======================================================

                    STAFF ONLY.

                    Uses the shared:

                        AdminLayout
                        AdminSidebar
                        AdminHeader

                    StaffRoutes owns the Staff sub-navigation.

                    Available:

                        /admin/staff
                        /admin/staff/applications

                    Future:

                        /admin/staff/applications/:id
                        /admin/staff/profile

                ====================================================== */}

                <Route
                    element={
                        <AdminRoleRoute
                            allowedRoles={[
                                "STAFF",
                            ]}
                        />
                    }
                >

                    <Route
                        path="/admin"
                        element={
                            <AdminLayout />
                        }
                    >

                        <Route
                            path="staff/*"
                            element={
                                <StaffRoutes />
                            }
                        />

                    </Route>

                </Route>


                {/* ======================================================
                    PROTECTED CLIENT PORTAL
                    ====================================================== */}

                <Route
                    element={
                        <ProtectedRoute />
                    }
                >

                    <Route
                        path="/portal"
                        element={
                            <PortalLayout />
                        }
                    >

                        {/* ==================================================
                            CLIENT DASHBOARD
                        ================================================== */}

                        <Route
                            index
                            element={
                                <ClientDashboard />
                            }
                        />


                        {/* ==================================================
                            CLIENT APPLICATIONS
                        ================================================== */}

                        <Route
                            path="applications"
                            element={
                                <Applications />
                            }
                        />


                        <Route
                            path="applications/new"
                            element={
                                <NewApplication />
                            }
                        />


                        <Route
                            path="applications/:id"
                            element={
                                <ApplicationDetail />
                            }
                        />


                        {/* ==================================================
                            CLIENT DOCUMENTS
                        ================================================== */}

                        <Route
                            path="documents"
                            element={
                                <Documents />
                            }
                        />


                        <Route
                            path="documents/:documentId/view"
                            element={
                                <DocumentViewer />
                            }
                        />


                        {/* ==================================================
                            CLIENT UPDATES
                            ================================================== */}

                        <Route
                            path="updates"
                            element={
                                <ClientUpdates />
                            }
                        />


                        {/* ==================================================
                            CLIENT PROFILE
                            ================================================== */}

                        <Route
                            path="profile"
                            element={
                                <Profile />
                            }
                        />


                        {/* ==================================================
                            CLIENT ELIGIBILITY ASSESSMENT
                            ================================================== */}

                        <Route
                            path="assessment"
                            element={
                                <Assessment />
                            }
                        />

                    </Route>

                </Route>


            </Routes>

        </BrowserRouter>

    );

}


export default App;