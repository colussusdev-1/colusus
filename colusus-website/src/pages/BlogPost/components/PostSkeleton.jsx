
import "./PostSkeleton.css";


const PostSkeleton = () => {
  return (
    <section className="post-skeleton">

      <div className="post-skeleton__hero">

        <div className="post-skeleton__hero-inner">

          <div className="post-skeleton__back skeleton-block" />

          <div className="post-skeleton__category skeleton-block" />

          <div className="post-skeleton__title">
            <span className="skeleton-block" />
            <span className="skeleton-block" />
            <span className="skeleton-block post-skeleton__title-line--short" />
          </div>

          <div className="post-skeleton__excerpt">
            <span className="skeleton-block" />
            <span className="skeleton-block post-skeleton__excerpt-line--short" />
          </div>

          <div className="post-skeleton__meta">
            <span className="skeleton-block" />
            <span className="skeleton-block" />
            <span className="skeleton-block" />
          </div>

          <div className="post-skeleton__image skeleton-block" />

        </div>

      </div>


      <div className="post-skeleton__body">

        <div className="post-skeleton__body-inner">

          <aside className="post-skeleton__sidebar">
            <span className="skeleton-block" />
            <span className="skeleton-block" />
            <span className="skeleton-block" />
            <span className="skeleton-block" />
          </aside>


          <article className="post-skeleton__article">

            <span className="skeleton-block post-skeleton__lead" />

            <div className="post-skeleton__paragraph">
              <span className="skeleton-block" />
              <span className="skeleton-block" />
              <span className="skeleton-block" />
              <span className="skeleton-block post-skeleton__line--short" />
            </div>

            <div className="post-skeleton__paragraph">
              <span className="skeleton-block" />
              <span className="skeleton-block" />
              <span className="skeleton-block post-skeleton__line--medium" />
            </div>

            <div className="post-skeleton__heading skeleton-block" />

            <div className="post-skeleton__paragraph">
              <span className="skeleton-block" />
              <span className="skeleton-block" />
              <span className="skeleton-block" />
            </div>

          </article>

        </div>

      </div>

    </section>
  );
};


export default PostSkeleton;