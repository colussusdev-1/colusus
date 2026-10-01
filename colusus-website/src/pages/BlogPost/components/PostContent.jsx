
import {
  ArrowUpRight,
  BookOpen,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import "./PostContent.css";

const looksLikeHtml = (value) => {
  return /<\s*\/?\s*[a-z][^>]*>/i.test(
    String(value),
  );
};

const PostContent = ({
  post,
}) => {
  const content =
    post?.content || "";

  const intro =
    post?.excerpt || "";

  const renderContent = () => {
    if (!content) {
      return (
        <div className="post-content__empty">
          <BookOpen
            size={20}
            strokeWidth={1.7}
          />

          <p>
            This article is currently
            being prepared for
            publication.
          </p>
        </div>
      );
    }

    if (looksLikeHtml(content)) {
      return (
        <div
          className="post-content__rich"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      );
    }

    return (
      <div className="post-content__text">
        {String(content)
          .split(/\n{2,}/)
          .filter(
            (paragraph) =>
              paragraph.trim(),
          )
          .map(
            (
              paragraph,
              index,
            ) => (
              <p key={index}>
                {paragraph
                  .split("\n")
                  .map(
                    (
                      line,
                      lineIndex,
                    ) => (
                      <span
                        key={
                          lineIndex
                        }
                      >
                        {line}

                        {lineIndex <
                          paragraph.split(
                            "\n",
                          ).length -
                          1 && (
                            <br />
                          )}
                      </span>
                    ),
                  )}
              </p>
            ),
          )}
      </div>
    );
  };

  return (
    <section className="post-content">
      <div className="post-content__layout">
        <aside className="post-content__aside">
          <div className="post-content__aside-card">
            <span>
              In this article
            </span>

            <strong>
              {post?.title}
            </strong>
          </div>
        </aside>

        <article className="post-content__article">
          {intro && (
            <p className="post-content__lead">
              {intro}
            </p>
          )}

          <div className="post-content__body">
            {renderContent()}
          </div>

          <div className="post-content__footer">
            <div className="post-content__footer-line" />

            <div className="post-content__footer-row">
              <div className="post-content__footer-copy">
                <BookOpen
                  size={15}
                  strokeWidth={1.8}
                />

                <span>
                  End of article
                </span>
              </div>

              <Link
                to="/blog"
                className="post-content__back"
              >
                <span>
                  Back to Journal
                </span>

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.9}
                />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default PostContent;
