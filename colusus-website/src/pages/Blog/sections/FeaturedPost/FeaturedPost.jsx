import "./FeaturedPost.css";

import { FiArrowRight, FiClock } from "react-icons/fi";

const FeaturedPost = () => {

    const featured = {

        title:
            "How To Successfully Relocate To Canada In 2026",

        excerpt:
            "Everything you need to know about work permits, immigration pathways, job opportunities, settlement planning and avoiding common relocation mistakes.",

        image:
            "https://images.unsplash.com/photo-1517935706615-2717063c2225",

        category:
            "Immigration Guide",

        readTime:
            "8 min read",

        date:
            "July 2026"

    };

    return (

        <section className="featured-post">

            <div className="featured-container">

                <div className="featured-image">

                    <img
                        src={featured.image}
                        alt={featured.title}
                    />

                </div>

                <div className="featured-content">

                    <span className="featured-badge">

                        Featured Article

                    </span>

                    <span className="featured-category">

                        {featured.category}

                    </span>

                    <h2>

                        {featured.title}

                    </h2>

                    <p>

                        {featured.excerpt}

                    </p>

                    <div className="featured-meta">

                        <span>

                            {featured.date}

                        </span>

                        <span>

                            <FiClock />

                            {featured.readTime}

                        </span>

                    </div>

                    <button className="featured-btn">

                        Read Article

                        <FiArrowRight />

                    </button>

                </div>

            </div>

        </section>

    );

};

export default FeaturedPost;