
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  UserRound,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import "./PostHero.css";

const formatDate = (
  date,
) => {
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

const getCategoryName = (
  category,
) => {
  if (!category) {
    return "Journal";
  }

  if (
    typeof category ===
    "string"
  ) {
    return category;
  }

  return (
    category.name ||
    category.label ||
    "Journal"
  );
};

const getAuthorName = (
  author,
) => {
  if (!author) {
    return "Colossus Editorial";
  }

  if (
    typeof author ===
    "string"
  ) {
    return author;
  }

  return (
    author.name ||
    author.fullName ||
    author.displayName ||
    "Colossus Editorial"
  );
};

const getImageUrl = (
  image,
) => {
  if (!image) {
    return "";
  }

  if (
    typeof image ===
    "string"
  ) {
    return image;
  }

  return (
    image.url ||
    image.secure_url ||
    ""
  );
};

const PostHero = ({
  post,
}) => {
  const category =
    getCategoryName(
      post?.category,
    );

  const author =
    getAuthorName(
      post?.author,
    );

  const publishedDate =
    formatDate(
      post?.publishedAt ||
      post?.createdAt,
    );

  const readTime =
    Math.max(
      Number(
        post?.readingTime ||
        post?.readTime ||
        post?.estimatedReadTime,
      ) || 1,
      1,
    );

  const image =
    getImageUrl(
      post?.coverImage ||
      post?.featuredImage ||
      post?.image,
    );

  return (
    <header className="post-hero">
      <div
        className="post-hero__background"
        aria-hidden="true"
      >
        {image && (
          <img
            src={image}
            alt=""
            className="post-hero__background-image"
          />
        )}

        <div className="post-hero__background-wash" />

        <div className="post-hero__glow post-hero__glow--one" />

        <div className="post-hero__glow post-hero__glow--two" />
      </div>

      <div className="post-hero__inner">
        <div className="post-hero__top">
          <Link
            to="/blog"
            className="post-hero__back"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.9}
            />

            <span>
              Back to Journal
            </span>
          </Link>

          <span className="post-hero__index">
            Colossus Journal
          </span>
        </div>

        <div className="post-hero__content">
          <div className="post-hero__category">
            <span
              className="post-hero__category-dot"
              aria-hidden="true"
            />

            <span>
              {category}
            </span>
          </div>

          <h1 className="post-hero__title">
            {post?.title ||
              "Journal article"}
          </h1>

          {post?.excerpt && (
            <p className="post-hero__excerpt">
              {post.excerpt}
            </p>
          )}

          <div className="post-hero__meta">
            <div className="post-hero__meta-group">
              <span className="post-hero__meta-item">
                <UserRound
                  size={13}
                  strokeWidth={1.8}
                />

                <span>
                  {author}
                </span>
              </span>

              {publishedDate && (
                <span className="post-hero__meta-item">
                  <CalendarDays
                    size={13}
                    strokeWidth={1.8}
                  />

                  <span>
                    {
                      publishedDate
                    }
                  </span>
                </span>
              )}

              <span className="post-hero__meta-item">
                <Clock3
                  size={13}
                  strokeWidth={1.8}
                />

                <span>
                  {readTime}{" "}
                  min read
                </span>
              </span>
            </div>

            <Link
              to="/blog"
              className="post-hero__browse"
            >
              <span>
                Browse articles
              </span>

              <ArrowUpRight
                size={14}
                strokeWidth={1.9}
              />
            </Link>
          </div>
        </div>

        {image && (
          <div className="post-hero__image-wrap">
            <img
              src={image}
              alt={
                post?.title ||
                "Journal article"
              }
              className="post-hero__image"
              loading="eager"
              decoding="async"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default PostHero;
