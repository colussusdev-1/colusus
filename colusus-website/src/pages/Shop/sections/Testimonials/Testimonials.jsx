import "./Testimonials.css";

import testimonials from "./testimonialData";

import { FiStar } from "react-icons/fi";

const Testimonials = () => {

    return (

        <section className="testimonials">

            <div className="testimonials-container">

                <div className="testimonials-header">

                    <span>

                        Customer Reviews

                    </span>

                    <h2>

                        Trusted By Professionals Worldwide

                    </h2>

                    <p>

                        Thousands of users rely on our resources
                        to prepare for work, study and relocation abroad.

                    </p>

                </div>

                <div className="testimonials-grid">

                    {

                        testimonials.map(item => (

                            <article
                                key={item.id}
                                className="testimonial-card"
                            >

                                <div className="testimonial-stars">

                                    {

                                        [...Array(item.rating)].map((_,index)=>(

                                            <FiStar
                                                key={index}
                                                fill="currentColor"
                                            />

                                        ))

                                    }

                                </div>

                                <blockquote>

                                    "{item.quote}"

                                </blockquote>

                                <div className="testimonial-user">

                                    <strong>

                                        {item.name}

                                    </strong>

                                    <span>

                                        {item.role} · {item.country}

                                    </span>

                                </div>

                            </article>

                        ))

                    }

                </div>

            </div>

        </section>

    );

};

export default Testimonials;