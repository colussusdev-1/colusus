
import {
  CalendarDays,
  Clock3,
  Eye,
  Tag,
  UserRound,
} from "lucide-react";

import "./PostMeta.css";

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

const formatViews = (
  views,
) => {
  const count =
    Number(views) || 0;

  if (count < 1000) {
    return String(count);
  }

  if (count < 1000000) {
    return `${(
      count / 1000
    ).toFixed(
      count >= 10000
        ? 0
        : 1,
    )}k`;
  }

  return `${(
    count / 1000000
  ).toFixed(1)}m`;
};

const PostMeta = ({
  post,
}) => {
  if (!post) {
    return null;
  }

  const author =
    getAuthorName(
      post.author,
    );

  const category =
    getCategoryName(
      post.category,
    );

  const publishedDate =
    formatDate(
      post.publishedAt ||
      post.createdAt,
    );

  const readingTime =
    Math.max(
      Number(
        post.readingTime,
      ) || 1,
      1,
    );

  const views =
    formatViews(
      post.views,
    );

  const tags =
    Array.isArray(
      post.tags,
    )
      ? post.tags.filter(
        Boolean,
      )
      : [];

  return (
    <section
      className="post-meta"
      aria-label="Article information"
    >
      <div className="post-meta__inner">
        <div className="post-meta__primary">
          <div className="post-meta__item">
            <span className="post-meta__icon">
              <UserRound
                size={14}
                strokeWidth={1.8}
              />
            </span>

            <div className="post-meta__item-copy">
              <span>
                Written by
              </span>

              <strong>
                {author}
              </strong>
            </div>
          </div>

          {publishedDate && (
            <div className="post-meta__item">
              <span className="post-meta__icon">
                <CalendarDays
                  size={14}
                  strokeWidth={1.8}
                />
              </span>

              <div className="post-meta__item-copy">
                <span>
                  Published
                </span>

                <strong>
                  {
                    publishedDate
                  }
                </strong>
              </div>
            </div>
          )}

          <div className="post-meta__item">
            <span className="post-meta__icon">
              <Clock3
                size={14}
                strokeWidth={1.8}
              />
            </span>

            <div className="post-meta__item-copy">
              <span>
                Reading time
              </span>

              <strong>
                {
                  readingTime
                }{" "}
                min read
              </strong>
            </div>
          </div>

          <div className="post-meta__item">
            <span className="post-meta__icon">
              <Eye
                size={14}
                strokeWidth={1.8}
              />
            </span>

            <div className="post-meta__item-copy">
              <span>
                Views
              </span>

              <strong>
                {views}
              </strong>
            </div>
          </div>
        </div>

        <div className="post-meta__category">
          <span className="post-meta__category-label">
            <Tag
              size={13}
              strokeWidth={1.8}
            />

            Category
          </span>

          <strong>
            {category}
          </strong>
        </div>

        {tags.length > 0 && (
          <div className="post-meta__tags">
            {tags.map(
              (
                tag,
                index,
              ) => (
                <span
                  className="post-meta__tag"
                  key={`${tag}-${index}`}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PostMeta;

