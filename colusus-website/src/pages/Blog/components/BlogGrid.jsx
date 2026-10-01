
import {
    ArrowDown,
    ArrowUpRight,
} from "lucide-react";

import BlogCard from "./BlogCard";

import "./BlogGrid.css";

const BlogGrid = ({
    posts = [],
}) => {
    if (!posts.length) {
        return null;
    }

    const articleLabel =
        posts.length === 1
            ? "article"
            : "articles";

    return (
        <section
            id="blog-articles"
            className="blog-articles"
            aria-label="Blog articles"
        >
            <div className="blog-articles__header">
                <div className="blog-articles__heading">
                    <div className="blog-articles__eyebrow-row">
                        <span className="blog-articles__eyebrow">
                            From the Journal
                        </span>

                        <span className="blog-articles__eyebrow-line" />
                    </div>

                    <h2 className="blog-articles__title">
                        More to explore.
                    </h2>

                    <p className="blog-articles__description">
                        Practical guides, migration
                        updates, opportunities and
                        insights to help you navigate
                        what comes next.
                    </p>
                </div>

                <div className="blog-articles__side">
                    <div className="blog-articles__count">
                        <strong>
                            {posts.length}
                        </strong>

                        <span>
                            {articleLabel}
                            <br />
                            available
                        </span>
                    </div>

                    <span
                        className="blog-articles__scroll-indicator"
                        aria-hidden="true"
                    >
                        <ArrowDown
                            size={14}
                            strokeWidth={1.8}
                        />
                    </span>
                </div>
            </div>

            <div
                className="blog-articles__rule"
                aria-hidden="true"
            />

            <div className="blog-grid">
                {posts.map((post, index) => (
                    <div
                        className="blog-grid__item"
                        key={
                            post?._id ||
                            post?.id ||
                            post?.slug ||
                            index
                        }
                    >
                        <BlogCard
                            post={post}
                        />
                    </div>
                ))}
            </div>

            <div className="blog-articles__footer">
                <span>
                    Showing {posts.length}{" "}
                    {articleLabel}
                </span>

                <a
                    href="#blog-articles"
                    className="blog-articles__back"
                >
                    <span>
                        Back to articles
                    </span>

                    <ArrowUpRight
                        size={14}
                        strokeWidth={1.9}
                    />
                </a>
            </div>
        </section>
    );
};

export default BlogGrid;
