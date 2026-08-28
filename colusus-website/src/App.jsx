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
| ADMIN
|--------------------------------------------------------------------------
*/

import AdminLogin
    from "./pages/admin/Auth/AdminLogin";

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


/*
|--------------------------------------------------------------------------
| AUTHENTICATION
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
                    OPPORTUNITIES
                ====================================================== */}

                {/* Country opportunities page */}

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


                {/* Individual pathway page */}

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
                    MIGRATION ASSESSMENT
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
                    ADMIN AUTHENTICATION
                ====================================================== */}

                <Route
                    path="/admin/login"
                    element={
                        <AdminLogin />
                    }
                />


                {/* ======================================================
                    ADMIN PORTAL
                ====================================================== */}

                <Route
                    path="/admin"
                    element={
                        <AdminLayout />
                    }
                >

                    <Route
                        index
                        element={
                            <AdminOverview />
                        }
                    />


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


                    <Route
                        path="consultations"
                        element={
                            <AdminConsultations />
                        }
                    />

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

                        <Route
                            index
                            element={
                                <ClientDashboard />
                            }
                        />


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


                        <Route
                            path="updates"
                            element={
                                <ClientUpdates />
                            }
                        />


                        <Route
                            path="profile"
                            element={
                                <Profile />
                            }
                        />

                    </Route>

                </Route>


            </Routes>

        </BrowserRouter>

    );

}


export default App;