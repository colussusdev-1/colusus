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

// ✅ Import your Webmailer component
import Webmailer from "./pages/Webmailer/Webmailer";

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/canada-migration" element={<CanadaMigration />} />
                <Route path="/services/global-works" element={<GlobalWorkImmigration />} />
                <Route path="/services/tourist-visa" element={<TouristVisa />} />

                <Route path="/opportunities/:country" element={<Opportunities />} />
                <Route path="/opportunities/:country/:slug" element={<OpportunityDetails />} />

                <Route path="/blog" element={<Blog />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/free-assessment" element={<FreeAssessment />} />
                <Route path="/consultation" element={<ConsultationBooking />} />

                {/* ✅ Updated Webmail route */}
                <Route path="/webmail" element={<Webmailer />} />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

export default App;
