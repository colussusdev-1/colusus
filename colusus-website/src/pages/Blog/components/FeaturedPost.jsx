
import {
    ArrowRight,
    ArrowUpRight,
    Clock3,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import "./FeaturedPost.css";

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

const FeaturedPost = ({
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
        "Featured story";

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

    const postUrl =
        `/blog/${post.slug}`;

    return (
        <section
            className="blog-featured"
            aria-labelledby="featured-story-title"
        >
            <div className="blog-featured__header">
                <div className="blog-featured__heading">
                    <span className="blog-featured__eyebrow">
                        Featured story
                    </span>

                    <h2>
                        Worth knowing
                    </h2>
                </div>

                <span className="blog-featured__header-note">
                    Editor's selection
                </span>
            </div>

            <article className="blog-featured__card">
                <Link
                    to={postUrl}
                    className="blog-featured__image-link"
                    aria-label={`Read ${title}`}
                >
                    <div className="blog-featured__image">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={title}
                                loading="eager"
                                decoding="async"
                            />
                        ) : (
                            <div
                                className="blog-featured__image-placeholder"
                                aria-hidden="true"
                            >
                                <span>
                                    Colossus
                                </span>

                                <strong>
                                    Journal
                                </strong>
                            </div>
                        )}

                        <div
                            className="blog-featured__image-overlay"
                            aria-hidden="true"
                        />

                        <span className="blog-featured__badge">
                            Featured
                        </span>

                        <span
                            className="blog-featured__image-arrow"
                            aria-hidden="true"
                        >
                            <ArrowUpRight
                                size={18}
                                strokeWidth={1.9}
                            />
                        </span>
                    </div>
                </Link>

                <div className="blog-featured__content">
                    <div className="blog-featured__meta">
                        <span className="blog-featured__category">
                            {category}
                        </span>

                        {date && (
                            <>
                                <span
                                    className="blog-featured__meta-dot"
                                    aria-hidden="true"
                                />

                                <span>
                                    {date}
                                </span>
                            </>
                        )}
                    </div>

                    <Link
                        to={postUrl}
                        className="blog-featured__title-link"
                    >
                        <h3
                            id="featured-story-title"
                            className="blog-featured__title"
                        >
                            {title}
                        </h3>

                        <span
                            className="blog-featured__title-arrow"
                            aria-hidden="true"
                        >
                            <ArrowUpRight
                                size={20}
                                strokeWidth={1.8}
                            />
                        </span>
                    </Link>

                    {post.excerpt && (
                        <p className="blog-featured__excerpt">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="blog-featured__bottom">
                        <div className="blog-featured__author">
                            <span
                                className="blog-featured__author-mark"
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

                        <div className="blog-featured__reading">
                            <Clock3
                                size={14}
                                strokeWidth={1.8}
                            />

                            <span>
                                {readingTime}{" "}
                                min read
                            </span>
                        </div>

                        <Link
                            to={postUrl}
                            className="blog-featured__read"
                        >
                            <span>
                                Read story
                            </span>

                            <ArrowRight
                                size={15}
                                strokeWidth={2}
                            />
                        </Link>
                    </div>
                </div>
            </article>
        </section>
    );
};

export default FeaturedPost;
