
import {
  ArrowUpRight,
  Clock3,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import "./RelatedPosts.css";

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(
    parsedDate.getTime(),
  )) {
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

const RelatedPosts = ({
  posts = [],
}) => {
  if (!posts.length) {
    return null;
  }

  return (
    <section className="related-posts">
      <div className="related-posts__inner">
        <div className="related-posts__heading">
          <div>
            <span className="related-posts__eyebrow">
              Continue reading
            </span>

            <h2>
              More from the Journal
            </h2>
          </div>

          <Link
            to="/blog"
            className="related-posts__all"
          >
            <span>
              View all articles
            </span>

            <ArrowUpRight
              size={14}
              strokeWidth={1.9}
            />
          </Link>
        </div>

        <div className="related-posts__grid">
          {posts
            .slice(0, 3)
            .map((post) => {
              if (!post?.slug) {
                return null;
              }

              const date =
                formatDate(
                  post.publishedAt,
                );

              return (
                <article
                  className="related-posts__card"
                  key={
                    post._id ||
                    post.slug
                  }
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="related-posts__card-link"
                    aria-label={`Read ${post.title}`}
                  >
                    <div className="related-posts__image-wrap">
                      {post.coverImage?.url ? (
                        <img
                          src={
                            post.coverImage.url
                          }
                          alt={
                            post.title ||
                            "Journal article"
                          }
                          className="related-posts__image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="related-posts__image-placeholder">
                          <span>
                            Colossus
                          </span>

                          <strong>
                            Journal
                          </strong>
                        </div>
                      )}

                      <span className="related-posts__arrow">
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.8}
                        />
                      </span>
                    </div>

                    <div className="related-posts__card-body">
                      <div className="related-posts__meta">
                        <span>
                          {post.category ||
                            "Journal"}
                        </span>

                        {date && (
                          <>
                            <i />

                            <span>
                              {date}
                            </span>
                          </>
                        )}
                      </div>

                      <h3>
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p>
                          {
                            post.excerpt
                          }
                        </p>
                      )}

                      <span className="related-posts__read-time">
                        <Clock3
                          size={12}
                          strokeWidth={1.9}
                        />

                        {post.readingTime ||
                          1}{" "}
                        min read
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;

