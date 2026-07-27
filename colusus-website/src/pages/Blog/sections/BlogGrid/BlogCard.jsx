import "./BlogCard.css";

import {
    FiArrowRight,
    FiClock
} from "react-icons/fi";

const BlogCard = ({ blog }) => {

    return (

        <article className="blog-card">

            <div className="blog-card-image">

                <img
                    src={blog.image}
                    alt={blog.title}
                />

                <span className="blog-category">

                    {blog.category}

                </span>

            </div>

            <div className="blog-card-content">

                <div className="blog-meta">

                    <span>

                        {blog.date}

                    </span>

                    <span>

                        <FiClock />

                        {blog.readTime}

                    </span>

                </div>

                <h3>

                    {blog.title}

                </h3>

                <p>

                    {blog.excerpt}

                </p>

                <button className="blog-read-btn">

                    Read More

                    <FiArrowRight />

                </button>

            </div>

        </article>

    );

};

export default BlogCard;