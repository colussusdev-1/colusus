import "./AboutTeam.css";

import {
    HiOutlineUsers,
    HiOutlineGlobeAlt,
    HiOutlineSparkles,
    HiOutlineAcademicCap,
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

import tony from "../../../../assets/images/team/tony.jpg";
import stanley from "../../../../assets/images/team/Stanley.jpg";
import nnamdi from "../../../../assets/images/team/Nnamdi.jpg";
import rosemary from "../../../../assets/images/team/Rosemary.jpg";
import jane from "../../../../assets/images/team/jane.jpg";
import esther from "../../../../assets/images/team/Esther.jpg";
import praise from "../../../../assets/images/team/Praise.jpg";
import olaide from "../../../../assets/images/team/olaide.png"
/* =====================================================
   COMPANY STATS
===================================================== */

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

/* =====================================================
   FOUNDER
===================================================== */

const founder = {

    name: "Tony Chiugo Josephat",

    role: "Chief Immigration Director",

    badge: "Founder & Immigration Lead",

    desc:
        "Leading global immigration strategies and helping individuals, families and businesses confidently navigate international migration opportunities through trusted advisory, compliance and long-term planning.",

    image: tony,

};

/* =====================================================
   EXECUTIVE
===================================================== */

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

/* =====================================================
   OPERATIONS
===================================================== */

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

/* =====================================================
   TECHNOLOGY
===================================================== */

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

        image: null,

    },

];

/* =====================================================
   CLIENT EXPERIENCE
===================================================== */

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

/* =====================================================
   AVATAR
===================================================== */

const Avatar = ({ member }) => {

    return (

        <div className="team-avatar">

            {

                member.image ?

                    <img

                        src={member.image}

                        alt={member.name}

                        className={member.className || ""}

                    />

                    :

                    <div className="avatar-placeholder">

                        {member.name.charAt(0)}

                    </div>

            }

        </div>

    );

};

/* =====================================================
   STATS
===================================================== */

const TeamStats = () => {

    return (

        <section className="team-stats">

            {

                stats.map((item, index) => {

                    const Icon = item.icon;

                    return (

                        <article

                            key={index}

                            className="stat-card"

                        >

                            <Icon className="stat-icon" />

                            <h3>

                                {item.value}

                            </h3>

                            <p>

                                {item.label}

                            </p>

                        </article>

                    );

                })

            }

        </section>

    );

};

/* =====================================================
   FOUNDER
===================================================== */

const FounderCard = () => {

    return (

        <section className="founder-card">

            <div className="founder-image">

                <img

                    src={founder.image}

                    alt={founder.name}

                />

            </div>

            <div className="founder-content">

                <span className="founder-badge">

                    {founder.badge}

                </span>

                <h2>

                    {founder.name}

                </h2>

                <h4>

                    {founder.role}

                </h4>

                <p>

                    {founder.desc}

                </p>

                <div className="founder-tags">

                    <span>Global Migration</span>

                    <span>Business Advisory</span>

                    <span>Strategic Planning</span>

                    <span>International Expansion</span>

                </div>

            </div>

        </section>

    );

};
/* =====================================================
   TEAM CARD
===================================================== */

const TeamCard = ({ member }) => {

    return (

        <article className="team-card">

            <div className="team-card-image">

                <Avatar member={member} />

            </div>

            <div className="team-card-content">

                <span className="team-role-tag">

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



                <div className="team-card-footer">

                    <span>

                        Colossus Migration

                    </span>

                    <div className="team-status">

                        ● Available

                    </div>

                </div>

            </div>



        </article>

    );

};

/* =====================================================
   TEAM GROUP
===================================================== */

const TeamGroup = ({

    title,

    data,

}) => {

    return (

        <section className="team-section">

            <div className="team-section-header">

                <h2>

                    {title}

                </h2>

                <span>

                    {data.length} Team Member{data.length > 1 ? "s" : ""}

                </span>

            </div>

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

                    delay: 3500,

                    disableOnInteraction: false,

                }}

                loop={

                    data.length > 2

                }

                spaceBetween={30}

                breakpoints={{

                    0: {

                        slidesPerView: 1.1,

                    },

                    640: {

                        slidesPerView: 1.5,

                    },

                    900: {

                        slidesPerView: 2,

                    },

                    1200: {

                        slidesPerView: 3,

                    },

                }}

            >

                {

                    data.map((member, index) => (

                        <SwiperSlide

                            key={index}

                        >

                            <TeamCard

                                member={member}

                            />

                        </SwiperSlide>

                    ))

                }

            </Swiper>

        </section>

    );

};

/* =====================================================
   MAIN
===================================================== */

const AboutTeam = () => {

    return (

        <section className="about-team">

            <div className="team-container">

                <header className="team-header">

                    <span>

                        OUR PEOPLE

                    </span>

                    <h2>

                        Meet the professionals

                        <strong>

                            behind every successful migration

                        </strong>

                    </h2>

                    <p>

                        Behind every successful migration journey is a team of experienced professionals dedicated to providing strategic guidance, trusted expertise and exceptional client service from consultation to destination.

                    </p>

                </header>

                <TeamStats />

                <FounderCard />

                <TeamGroup

                    title="Executive Leadership"

                    data={leadership}

                />

                <TeamGroup

                    title="Operations & Migration"

                    data={operations}

                />

                <TeamGroup

                    title="Technology"

                    data={technology}

                />

                <TeamGroup

                    title="Client Experience"

                    data={clientExperience}

                />

            </div>

        </section>

    );

};

export default AboutTeam;