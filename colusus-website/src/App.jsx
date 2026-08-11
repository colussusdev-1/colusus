import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./pages/Home/sections/Footer/Footer";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";

import CanadaMigration from "./pages/Services/CanadaMigration/CanadaMigration";
import GlobalWorkImmigration from "./pages/Services/GlobalWorkImmigration/GlobalWorkImmigration";
import TouristVisa from "./pages/Services/TouristVisa/TouristVisa";

import Blog from "./pages/Blog/Blog";
import Shop from "./pages/Shop/Shop";
import Contact from "./pages/Contact/Contact";

import Opportunities from "./pages/Opportunities/Opportunities";
import OpportunityDetails from "./pages/Opportunities/OpportunityDetails/OpportunityDetails";

import FreeAssessment from "./pages/FreeAssesment/FreeAssessment";
import ConsultationBooking from "./components/ConsultationBooking/ConsultationBooking";
import ApplicationWizard from "./pages/Client/ApplicationWizard";

import Webmailer from "./pages/Webmailer/Webmailer";

/*
|--------------------------------------------------------------------------
| CLIENT PORTAL
|--------------------------------------------------------------------------
*/

import PortalLayout from "./components/ClientPortal/PortalLayout/PortalLayout";
import ProtectedRoute from "./components/ClientPortal/ProtectedRoute";

import ClientDashboard from "./pages/Client/ClientDashboard";
import Applications from "./pages/Client/Applications";
import Documents from "./pages/Client/Documents";
import Updates from "./pages/Client/Updates";
import Profile from "./pages/Client/Profile";

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

import AdminLogin from "./pages/Admin/Auth/AdminLogin";
import AdminConsultations from "./pages/Admin/Consultations/AdminConsultations";

/*
|--------------------------------------------------------------------------
| AUTHENTICATION
|--------------------------------------------------------------------------
*/

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function App() {

    return (

        <BrowserRouter>

            <ScrollToTop />

            <Routes>

                {/*
                =================================================
                PUBLIC WEBSITE
                =================================================
                */}

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

                <Route
                    path="/free-assessment"
                    element={
                        <>
                            <Navbar />
                            <FreeAssessment />
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

                {/*
                =================================================
                WEBMAIL
                =================================================
                */}

                <Route
                    path="/webmail"
                    element={<Webmailer />}
                />

                {/*
                =================================================
                CLIENT AUTHENTICATION
                =================================================
                */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/*
                =================================================
                ADMIN AUTHENTICATION
                =================================================
                */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                {/*
                =================================================
                ADMIN
                =================================================
                */}

                <Route
                    path="/admin/consultations"
                    element={<AdminConsultations />}
                />

                {/*
                =================================================
                PROTECTED CLIENT PORTAL
                =================================================
                */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/portal"
                        element={<PortalLayout />}
                    >

                        {/*
                        -----------------------------------------
                        DASHBOARD
                        -----------------------------------------
                        */}

                        <Route
                            index
                            element={<ClientDashboard />}
                        />

                        {/*
                        -----------------------------------------
                        APPLICATIONS
                        -----------------------------------------
                        */}

                        <Route
                            path="applications"
                            element={<Applications />}
                        />

                        <Route
                            path="applications/new"
                            element={<ApplicationWizard />}
                        />

                        {/*
                        -----------------------------------------
                        DOCUMENTS
                        -----------------------------------------
                        */}

                        <Route
                            path="documents"
                            element={<Documents />}
                        />

                        {/*
                        -----------------------------------------
                        UPDATES
                        -----------------------------------------
                        */}

                        <Route
                            path="updates"
                            element={<Updates />}
                        />

                        {/*
                        -----------------------------------------
                        PROFILE
                        -----------------------------------------
                        */}

                        <Route
                            path="profile"
                            element={<Profile />}
                        />

                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>

    );

}

export default App;