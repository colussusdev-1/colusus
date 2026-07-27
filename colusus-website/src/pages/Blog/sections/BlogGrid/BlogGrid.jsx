import "./BlogGrid.css";

import blogData from "../../blogData";

import BlogCard from "./BlogCard";

const BlogGrid = () => {

    return (

        <section className="blog-grid-section">

            <div className="blog-grid-container">

                <div className="blog-grid-header">

                    <span>

                        Latest Articles

                    </span>

                    <h2>

                        Explore Our Recent Insights

                    </h2>

                    <p>

                        Immigration updates, career advice,
                        international business opportunities,
                        travel guides and global mobility insights.

                    </p>

                </div>

                <div className="blog-grid">

                    {

                        blogData.map((blog) => (

                            <BlogCard
                                key={blog.id}
                                blog={blog}
                            />

                        ))

                    }

                </div>

            </div>

        </section>

    );

};

export default BlogGrid;