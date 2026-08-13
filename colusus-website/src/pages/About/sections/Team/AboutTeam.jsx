import { useEffect, useRef } from "react";

import "./AboutTeam.css";

import {
    HiOutlineUsers,
    HiOutlineGlobeAlt,
    HiOutlineSparkles,
    HiOutlineAcademicCap,
    HiOutlinePaperAirplane,
} from "react-icons/hi";

import {
    Swiper,
    SwiperSlide,
} from "swiper/react";

import {
    Navigation,
    Pagination,
    Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


/* =========================================================
   TEAM IMAGES
========================================================= */

import tony from "../../../../assets/images/team/tony.jpg";
import stanley from "../../../../assets/images/team/Stanley.jpg";
import nnamdi from "../../../../assets/images/team/Nnamdi.jpg";
import rosemary from "../../../../assets/images/team/Rosemary.jpg";
import jane from "../../../../assets/images/team/jane.jpg";
import esther from "../../../../assets/images/team/Esther.jpg";
import praise from "../../../../assets/images/team/Praise.jpg";
import olaide from "../../../../assets/images/team/olaide.png";
import sam from "../../../../assets/images/team/sam.jpg";

/* =========================================================
   BACKGROUNDS
========================================================= */

import teamBackground
    from "../../../../assets/images/team/team-background.png";

import founderBackground
    from "../../../../assets/images/team/globalconnectivitynetworkbackground.png";


/* =========================================================
   COMPANY STATS
========================================================= */

const stats = [

    {
        icon: HiOutlineUsers,
        value: "7+",
        label: "Professionals",
    },

    {
        icon: HiOutlineGlobeAlt,
        value: "25+",
        label: "Countries Served",
    },

    {
        icon: HiOutlineSparkles,
        value: "100%",
        label: "Client Commitment",
    },

    {
        icon: HiOutlineAcademicCap,
        value: "15+",
        label: "Years Combined Experience",
    },

];


/* =========================================================
   FOUNDER
========================================================= */

const founder = {

    name: "Tony Chiugo Josephat",

    role: "Chief Immigration Director",

    badge: "Founder & Immigration Lead",

    desc:
        "Leading global immigration strategies and helping individuals, families and businesses confidently navigate international migration opportunities through trusted advisory, compliance and long-term planning.",

    image: tony,

};


/* =========================================================
   EXECUTIVE LEADERSHIP
========================================================= */

const leadership = [

    {
        name: "Esther Adeoje",

        role: "Executive Strategist",

        tag: "Strategy & Growth",

        desc:
            "Developing strategic initiatives that strengthen organizational growth, customer experience and international expansion.",

        image: esther,
    },

];


/* =========================================================
   OPERATIONS
========================================================= */

const operations = [

    {
        name: "Stanley Okonkwo",

        role: "Finance Controller & Account Manager",

        tag: "Finance",

        desc:
            "Overseeing financial operations, budgeting and customer account management.",

        image: stanley,
    },

    {
        name: "Nnamdi Chinedu C.",

        role: "Head of Operations & Migration",

        tag: "Migration",

        desc:
            "Managing migration workflows while ensuring every client receives a smooth and transparent journey.",

        image: nnamdi,
    },

];


/* =========================================================
   TECHNOLOGY
========================================================= */

const technology = [

    {
        name: "Akosile Olaide J.",

        role: "Web Application Engineer",

        tag: "Technology",

        desc:
            "Designing digital platforms, automation systems and web applications powering the Colossus ecosystem.",

        image: olaide,
    },

    {
        name: "Udeme Sam",

        role: "Software Engineer",

        tag: "Technology",

        desc:
            "Supporting software engineering, frontend development and digital infrastructure.",

        image: sam,
    },

];


/* =========================================================
   CLIENT EXPERIENCE
========================================================= */

const clientExperience = [

    {
        name: "Rosemary O. Effiong",

        role: "Office Admin & Content Creator",

        tag: "Client Experience",

        desc:
            "Ensuring smooth daily operations while strengthening communication through engaging content.",

        image: rosemary,

        className: "rosemary-photo",
    },

    {
        name: "Praise",

        role: "Digital Marketing Lead",

        tag: "Marketing",

        desc:
            "Driving digital visibility and helping the brand connect with audiences worldwide.",

        image: praise,
    },

    {
        name: "Jane Lilian Onyebuchi",

        role: "Administration Manager",

        tag: "Administration",

        desc:
            "Coordinating internal operations while supporting efficient organizational management.",

        image: jane,
    },

];


/* =========================================================
   AVATAR
========================================================= */

const Avatar = ({ member }) => {

    return (

        <div className="about-team-i-avatar">

            {member.image ? (

                <img
                    src={member.image}
                    alt={member.name}
                    className={member.className || ""}
                />

            ) : (

                <div className="about-team-i-avatar-placeholder">

                    {member.name.charAt(0)}

                </div>

            )}

        </div>

    );

};


/* =========================================================
   TEAM STATS
========================================================= */

const TeamStats = () => {

    return (

        <div className="about-team-i-stats">

            {stats.map((item, index) => {

                const Icon = item.icon;

                return (

                    <article
                        key={index}
                        className="about-team-i-stat team-stat-reveal"
                        style={{
                            "--team-stat-delay":
                                `${index * 110}ms`,
                        }}
                    >

                        <div className="about-team-i-stat-icon">

                            <Icon />

                        </div>

                        <div className="about-team-i-stat-content">

                            <strong>
                                {item.value}
                            </strong>

                            <span>
                                {item.label}
                            </span>

                        </div>

                    </article>

                );

            })}

        </div>

    );

};


/* =========================================================
   FOUNDER CARD
========================================================= */

const FounderCard = () => {

    return (

        <section
            className="about-team-i-founder team-founder-reveal"
            style={{
                "--founder-background":
                    `url(${founderBackground})`,
            }}
        >

            <div className="about-team-i-founder-image">

                <img
                    src={founder.image}
                    alt={founder.name}
                />

                <div className="about-team-i-founder-image-overlay" />

                <span className="about-team-i-founder-image-label">

                    <span />

                    Leadership

                </span>

            </div>


            <div className="about-team-i-founder-content">

                <div className="about-team-i-founder-top">

                    <span className="about-team-i-founder-badge">

                        {founder.badge}

                    </span>

                    <span className="about-team-i-founder-number">

                        01

                    </span>

                </div>


                <h2>
                    {founder.name}
                </h2>


                <h3>
                    {founder.role}
                </h3>


                <p>
                    {founder.desc}
                </p>


                <div className="about-team-i-founder-tags">

                    <span>
                        Global Migration
                    </span>

                    <span>
                        Business Advisory
                    </span>

                    <span>
                        Strategic Planning
                    </span>

                    <span>
                        International Expansion
                    </span>

                </div>


                <div className="about-team-i-founder-footer">

                    <span>
                        Colossus Migration & Tours
                    </span>

                    <span className="about-team-i-founder-status">

                        <i />

                        Active Leadership

                    </span>

                </div>

            </div>

        </section>

    );

};


/* =========================================================
   TEAM CARD
========================================================= */

const TeamCard = ({ member }) => {

    return (

        <article className="about-team-i-card">

            <div className="about-team-i-card-image">

                <Avatar member={member} />

                <div className="about-team-i-card-image-overlay" />

                <span className="about-team-i-card-index">
                    TEAM
                </span>

            </div>


            <div className="about-team-i-card-content">

                <span className="about-team-i-role">
                    {member.tag}
                </span>


                <h3>
                    {member.name}
                </h3>


                <h4>
                    {member.role}
                </h4>


                <p>
                    {member.desc}
                </p>


                <div className="about-team-i-card-footer">

                    <span>
                        Colossus Migration
                    </span>


                    <span className="about-team-i-status">

                        <i />

                        Available

                    </span>

                </div>

            </div>

        </article>

    );

};


/* =========================================================
   TEAM GROUP
========================================================= */

const TeamGroup = ({
    title,
    data,
    number,
}) => {

    return (

        <section className="about-team-i-group team-group-reveal">

            <div className="about-team-i-group-header">

                <div>

                    <span className="about-team-i-group-kicker">
                        OUR PEOPLE
                    </span>

                    <h2>
                        {title}
                    </h2>

                </div>


                <div className="about-team-i-group-meta">

                    <span>
                        {String(number).padStart(2, "0")}
                    </span>

                    <strong>

                        {data.length}{" "}

                        {data.length === 1
                            ? "Team Member"
                            : "Team Members"}

                    </strong>

                </div>

            </div>


            <div className="about-team-i-slider-wrap">

                <Swiper

                    modules={[
                        Navigation,
                        Pagination,
                        Autoplay,
                    ]}

                    navigation

                    pagination={{
                        clickable: true,
                    }}

                    autoplay={{
                        delay: 4200,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}

                    loop={data.length > 2}

                    spaceBetween={22}

                    slidesPerView={1.15}

                    breakpoints={{

                        560: {
                            slidesPerView: 1.5,
                        },

                        760: {
                            slidesPerView: 2,
                        },

                        1100: {
                            slidesPerView: 3,
                        },

                    }}

                    className="about-team-i-swiper"

                >

                    {data.map((member, index) => (

                        <SwiperSlide key={index}>

                            <TeamCard
                                member={member}
                            />

                        </SwiperSlide>

                    ))}

                </Swiper>

            </div>

        </section>

    );

};


/* =========================================================
   MAIN TEAM SECTION
========================================================= */

const AboutTeam = () => {

    const sectionRef = useRef(null);


    useEffect(() => {

        const section = sectionRef.current;

        if (!section) return;


        const observer = new IntersectionObserver(

            ([entry]) => {

                if (entry.isIntersecting) {

                    section.classList.add(
                        "about-team-i-is-visible"
                    );

                    observer.unobserve(section);

                }

            },

            {
                threshold: 0.08,
                rootMargin: "0px 0px -70px 0px",
            }

        );


        observer.observe(section);


        return () => observer.disconnect();

    }, []);


    return (

        <section
            ref={sectionRef}
            className="about-team-i"
            style={{
                "--about-team-background":
                    `url(${teamBackground})`,
            }}
            aria-labelledby="about-team-i-title"
        >


            {/* =================================================
                FULL TEAM BACKGROUND

                IMPORTANT:
                This remains separate from founderBackground.
            ================================================= */}

            <div
                className="about-team-i-background"
                aria-hidden="true"
            >

                <div className="about-team-i-background-image" />

                <div className="about-team-i-background-overlay" />

                <div className="about-team-i-glow" />

            </div>


            <div className="about-team-i-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="about-team-i-header">

                    <span className="about-team-i-tag">

                        <span className="about-team-i-tag-dot" />

                        OUR PEOPLE

                    </span>


                    <h1 id="about-team-i-title">

                        <span className="team-title-main">
                            Meet the professionals
                        </span>

                        <span className="team-title-accent">
                            behind every successful migration
                        </span>

                    </h1>


                    <span className="about-team-i-title-line" />


                    <p>

                        Behind every successful migration journey
                        is a team of experienced professionals
                        dedicated to providing strategic guidance,
                        trusted expertise and exceptional client
                        service from consultation to destination.

                    </p>

                </header>


                {/* =================================================
                    STATS
                ================================================= */}

                <TeamStats />


                {/* =================================================
                    FOUNDER
                ================================================= */}

                <FounderCard />


                {/* =================================================
                    GROUPS
                ================================================= */}

                <TeamGroup
                    title="Executive Leadership"
                    data={leadership}
                    number={1}
                />


                <TeamGroup
                    title="Operations & Migration"
                    data={operations}
                    number={2}
                />


                <TeamGroup
                    title="Technology"
                    data={technology}
                    number={3}
                />


                <TeamGroup
                    title="Client Experience"
                    data={clientExperience}
                    number={4}
                />


                {/* =================================================
                    CLOSING
                ================================================= */}

                <div className="about-team-i-closing team-closing-reveal">

                    <span className="about-team-i-closing-plane">

                        <HiOutlinePaperAirplane />

                    </span>

                    <p>

                        Different expertise.

                        <strong>
                            One mission.
                        </strong>

                    </p>

                    <span>

                        Helping people move forward with confidence.

                    </span>

                </div>


            </div>

        </section>

    );

};


export default AboutTeam;