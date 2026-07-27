import "./WhyChooseCanada.css";

import { useState, useEffect } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";

import { whyChooseCanada } from "./whyChooseData";

const WhyChooseCanada = () => {

    const [active, setActive] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setActive((prev) =>

                (prev + 1) % whyChooseCanada.length

            );

        }, 4000);

        return () => clearInterval(interval);

    }, []);

    const featured = whyChooseCanada[active];

    const others = whyChooseCanada.filter(

        (_, index) => index !== active

    );

    const FeaturedIcon = featured.icon;

    return (

        <div className="why-canada">

            <div className="container">

                {/* Header */}

                <div className="why-canada-header">

                    <span className="why-canada-tag">

                        WHY CANADA?

                    </span>

                    <h2>

                        A Country Built For

                        <span> Your Future.</span>

                    </h2>

                    <p>

                        Canada offers more than immigration opportunities.
                        It provides a secure environment, thriving economy,
                        world-class education and an exceptional quality of
                        life for individuals and families.

                    </p>

                </div>

                {/* Content */}

                <div className="why-canada-layout">

                    {/* Featured */}

                    <div className="why-feature-card">

                        <div className="why-feature-icon">

                            <FeaturedIcon />

                        </div>

                        <span className="why-feature-badge">

                            {featured.badge}

                        </span>

                        <h3>

                            {featured.title}

                        </h3>

                        <p>

                            {featured.description}

                        </p>

                        <ul>

                            {featured.highlights.map((item) => (

                                <li key={item}>

                                    {item}

                                </li>

                            ))}

                        </ul>

                    </div>

                    {/* Right Side */}

                    <div className="why-small-grid">

                        {others.map((item) => {

                            const Icon = item.icon;

                            return (

                                <button

                                    key={item.id}

                                    className="why-small-card"

                                    onClick={() =>

                                        setActive(

                                            whyChooseCanada.findIndex(

                                                (benefit) =>

                                                    benefit.id === item.id

                                            )

                                        )

                                    }

                                >

                                    <div className="why-small-left">

                                        <div className="why-small-icon">

                                            <Icon />

                                        </div>

                                        <div>

                                            <h4>

                                                {item.title}

                                            </h4>

                                            <span>

                                                {item.badge}

                                            </span>

                                        </div>

                                    </div>

                                    <HiOutlineArrowRight />

                                </button>

                            );

                        })}

                    </div>

                </div>

                {/* Bottom Stats */}

                <div className="why-canada-stats">

                    <div className="stat-card">

                        <h3>

                            #1

                        </h3>

                        <span>

                            Top destination for newcomers

                        </span>

                    </div>

                    <div className="stat-card">

                        <h3>

                            100+

                        </h3>

                        <span>

                            Immigration pathways available

                        </span>

                    </div>

                    <div className="stat-card">

                        <h3>

                            High

                        </h3>

                        <span>

                            Global quality of life ranking

                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default WhyChooseCanada;