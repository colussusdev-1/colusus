
import {
    ArrowUpRight,
    Clock3,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import "./BlogCard.css";

const formatDate = (date) => {
    if (!date) {
        return "";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime(),
        )
    ) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        },
    ).format(parsedDate);
};

const getAuthorName = (
    author,
) => {
    if (!author) {
        return "Colossus";
    }

    if (
        typeof author ===
        "string"
    ) {
        return author;
    }

    return (
        author.name ||
        "Colossus"
    );
};

const BlogCard = ({
    post,
}) => {
    if (
        !post ||
        !post.slug
    ) {
        return null;
    }

    const title =
        post.title ||
        "Untitled article";

    const date =
        formatDate(
            post.publishedAt,
        );

    const author =
        getAuthorName(
            post.author,
        );

    const readingTime =
        Math.max(
            Number(
                post.readingTime,
            ) || 1,
            1,
        );

    const category =
        post.category ||
        "Journal";

    const imageUrl =
        post.coverImage?.url ||
        "";

    return (
        <article className="blog-card">
            <Link
                to={`/blog/${post.slug}`}
                className="blog-card__image-link"
                aria-label={`Read ${title}`}
            >
                <div className="blog-card__image">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <div
                            className="blog-card__placeholder"
                            aria-hidden="true"
                        >
                            <span>
                                COLOSSUS
                            </span>

                            <strong>
                                Journal
                            </strong>
                        </div>
                    )}

                    <div
                        className="blog-card__image-overlay"
                        aria-hidden="true"
                    />

                    <span className="blog-card__category">
                        {category}
                    </span>

                    <span
                        className="blog-card__arrow"
                        aria-hidden="true"
                    >
                        <ArrowUpRight
                            size={17}
                            strokeWidth={1.8}
                        />
                    </span>
                </div>
            </Link>

            <div className="blog-card__content">
                <div className="blog-card__meta">
                    {date && (
                        <span className="blog-card__meta-date">
                            {date}
                        </span>
                    )}

                    {date && (
                        <span
                            className="blog-card__dot"
                            aria-hidden="true"
                        />
                    )}

                    <span className="blog-card__meta-reading">
                        <Clock3
                            size={12}
                            strokeWidth={1.9}
                        />

                        {readingTime}{" "}
                        min read
                    </span>
                </div>

                <Link
                    to={`/blog/${post.slug}`}
                    className="blog-card__title-link"
                >
                    <h3 className="blog-card__title">
                        {title}
                    </h3>

                    <span
                        className="blog-card__title-arrow"
                        aria-hidden="true"
                    >
                        <ArrowUpRight
                            size={17}
                            strokeWidth={1.8}
                        />
                    </span>
                </Link>

                {post.excerpt && (
                    <p className="blog-card__excerpt">
                        {post.excerpt}
                    </p>
                )}

                <div className="blog-card__footer">
                    <div className="blog-card__author">
                        <span
                            className="blog-card__author-mark"
                            aria-hidden="true"
                        >
                            C
                        </span>

                        <div>
                            <span>
                                Written by
                            </span>

                            <strong>
                                {author}
                            </strong>
                        </div>
                    </div>

                    <Link
                        to={`/blog/${post.slug}`}
                        className="blog-card__read"
                    >
                        <span>
                            Read
                        </span>

                        <ArrowUpRight
                            size={14}
                            strokeWidth={1.9}
                        />
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;

