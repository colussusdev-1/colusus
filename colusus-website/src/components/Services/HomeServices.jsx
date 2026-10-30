import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Globe2,
    GraduationCap,
    BriefcaseBusiness,
    Plane,
    FileCheck2,
    Users,
} from "lucide-react";

import "./HomeServices.css";

const services = [
    {
        id: "01",
        title: "International Recruitment",
        category: "GLOBAL CAREERS",
        description:
            "Explore international career opportunities and connect your professional experience with global employers.",
        image:
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
        icon: BriefcaseBusiness,
    },
    {
        id: "02",
        title: "Study Abroad",
        category: "GLOBAL EDUCATION",
        description:
            "Discover international education opportunities and get guidance through your study application journey.",
        image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=85",
        icon: GraduationCap,
    },
    {
        id: "03",
        title: "Skilled Migration",
        category: "MIGRATION PATHWAYS",
        description:
            "Explore migration pathways that align with your qualifications, professional experience and future goals.",
        image:
            "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85",
        icon: Globe2,
    },
    {
        id: "04",
        title: "Trainee & Apprenticeship",
        category: "INTERNATIONAL EXPERIENCE",
        description:
            "Explore international trainee and apprenticeship opportunities designed to build practical skills and experience.",
        image:
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
        icon: Users,
    },
    {
        id: "05",
        title: "Immigration & Relocation",
        category: "PERSONALISED GUIDANCE",
        description:
            "Get professional guidance to better understand immigration requirements, documentation and relocation processes.",
        image:
            "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=85",
        icon: Plane,
    },
    {
        id: "06",
        title: "Application Support",
        category: "APPLICATION GUIDANCE",
        description:
            "Navigate application requirements, document preparation and important steps throughout your journey.",
        image:
            "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=85",
        icon: FileCheck2,
    },
];

const HomeServices = () => {
    return (
        <section className="home-services">

            <div className="home-services-container">

                {/* HEADER */}
                <div className="home-services-header">

                    <div className="home-services-heading">

                        <span className="home-services-label">
                            WHAT WE DO
                        </span>

                        <h2>
                            Opportunities
                            <br />
                            <span>Without Borders.</span>
                        </h2>

                    </div>

                    <div className="home-services-intro">

                        <p>
                            Different ambitions. Different destinations.
                            One trusted partner to help you explore the
                            opportunities ahead.
                        </p>

                        <Link
                            to="/services"
                            className="home-services-all-link"
                        >
                            Explore all services
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                </div>


                {/* SERVICES GRID */}
                <div className="home-services-grid">

                    {services.map((service) => {

                        const Icon = service.icon;

                        return (
                            <Link
                                to="/services"
                                className="home-service-card"
                                key={service.id}
                            >

                                <div className="home-service-image">

                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        loading="lazy"
                                    />

                                    <span className="home-service-number">
                                        {service.id}
                                    </span>

                                    <div className="home-service-icon">
                                        <Icon size={20} strokeWidth={1.8} />
                                    </div>

                                    <div className="home-service-image-overlay" />

                                </div>


                                <div className="home-service-content">

                                    <span className="home-service-category">
                                        {service.category}
                                    </span>

                                    <h3>
                                        {service.title}
                                    </h3>

                                    <p>
                                        {service.description}
                                    </p>

                                    <div className="home-service-link">

                                        <span>EXPLORE SERVICE</span>

                                        <ArrowRight size={17} />

                                    </div>

                                </div>

                            </Link>
                        );

                    })}

                </div>


                {/* BOTTOM CTA */}
                <div className="home-services-footer">

                    <div>
                        <h3>
                            Your next chapter could begin anywhere.
                        </h3>

                        <p>
                            Discover the pathways available and find
                            the one that matches your ambitions.
                        </p>
                    </div>

                    <Link
                        to="/services"
                        className="home-services-button"
                    >
                        Discover Our Services
                        <ArrowRight size={18} />
                    </Link>

                </div>

            </div>

        </section>
    );
};

export default HomeServices;