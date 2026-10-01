
import {
  ArrowLeft,
  ArrowUpRight,
  FileQuestion,
  RefreshCw,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import "./PostNotFound.css";


const PostNotFound = ({
  message = "",
  onRetry,
}) => {
  return (
    <section className="post-not-found">

      <div className="post-not-found__atmosphere">
        <span />
        <span />
        <span />
      </div>


      <div className="post-not-found__inner">

        <div className="post-not-found__visual">

          <div className="post-not-found__icon">
            <FileQuestion
              size={25}
              strokeWidth={1.6}
            />
          </div>

          <span className="post-not-found__orb" />

        </div>


        <div className="post-not-found__content">

          <span className="post-not-found__eyebrow">
            Colossus Journal
          </span>

          <h1>
            This article
            <span>
              isn’t here.
            </span>
          </h1>

          <p>
            {message ||
              "The article may have moved, been unpublished, or the link may no longer be valid."}
          </p>


          <div className="post-not-found__actions">

            <Link
              to="/blog"
              className="post-not-found__primary"
            >
              <ArrowLeft
                size={16}
                strokeWidth={2}
              />

              <span>
                Back to Journal
              </span>
            </Link>


            {onRetry && (
              <button
                type="button"
                className="post-not-found__secondary"
                onClick={onRetry}
              >
                <RefreshCw
                  size={15}
                  strokeWidth={2}
                />

                <span>
                  Try again
                </span>
              </button>
            )}


            <Link
              to="/"
              className="post-not-found__home"
            >
              <span>
                Return to Colossus
              </span>

              <ArrowUpRight
                size={15}
                strokeWidth={2}
              />
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
};


export default PostNotFound;

