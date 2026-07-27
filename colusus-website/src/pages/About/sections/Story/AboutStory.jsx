import "./AboutStory.css";

import {
    HiOutlineCheckCircle,
    HiOutlineSparkles,
} from "react-icons/hi";

import storyImage from "../../../../assets/images/about/about.jpg";

const features = [
    "Established Since 2019",
    "Trusted Immigration Guidance",
    "Global Opportunities",
    "Personalized Client Support",
];

const AboutStory = () => {

    return (

        <section className="about-story">

            <div className="container about-story-container">

                {/* LEFT */}

                <div className="about-story-image-wrapper">

                    <span className="about-story-glow glow-one"></span>

                    <span className="about-story-glow glow-two"></span>

                    <div className="about-story-frame">

                        <div className="about-story-image">

                            <img
                                src={storyImage}
                                alt="Our Story"
                            />

                            <span className="about-story-reflection"></span>

                        </div>

                    </div>

                   

                </div>

                {/* RIGHT */}

                <div className="about-story-content">

                    <span className="about-story-tag">

                        OUR STORY

                    </span>

                    <h2 className="about-story-title">

                        Founded on a Vision.

                        <span>
                            Built Around People.
                        </span>

                    </h2>

                    <p className="about-story-description">

                        Colossus Migration & Tours was founded in 2019 with a
                        simple belief that international opportunities should
                        be accessible to everyone.

                    </p>

                    <p className="about-story-description">

                        Whether your dream is to study abroad, build a global
                        career, relocate with your family, expand a business or
                        simply explore the world, every journey deserves trusted
                        guidance and professional support.

                    </p>

                    <p className="about-story-description">

                        We simplify complex immigration and travel processes
                        through transparent advice, structured planning and
                        personalized assistance, helping every client move
                        forward with confidence regardless of background,
                        nationality or circumstances.

                    </p>

                    <div className="about-story-features">

                        {features.map((feature) => (

                            <div
                                className="about-story-feature"
                                key={feature}
                            >

                                <HiOutlineCheckCircle />

                                <span>

                                    {feature}

                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </section>

    );

};

export default AboutStory;