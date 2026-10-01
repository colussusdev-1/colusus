
const BlogSkeleton = () => {
    return (
        <section
            className="blog-skeleton"
            aria-label="Loading journal"
            aria-busy="true"
        >
            <div className="blog-skeleton__filter">
                <div className="blog-skeleton__filter-label" />
                <div className="blog-skeleton__filter-control" />
            </div>

            <div className="blog-skeleton__featured">
                <div className="blog-skeleton__featured-image" />

                <div className="blog-skeleton__featured-content">
                    <div className="blog-skeleton__line blog-skeleton__line--eyebrow" />

                    <div className="blog-skeleton__line blog-skeleton__line--title" />

                    <div className="blog-skeleton__line blog-skeleton__line--title blog-skeleton__line--short" />

                    <div className="blog-skeleton__line blog-skeleton__line--body" />

                    <div className="blog-skeleton__line blog-skeleton__line--body blog-skeleton__line--medium" />

                    <div className="blog-skeleton__featured-footer">
                        <div className="blog-skeleton__author">
                            <span className="blog-skeleton__avatar" />

                            <div>
                                <div className="blog-skeleton__line blog-skeleton__line--author" />
                                <div className="blog-skeleton__line blog-skeleton__line--author blog-skeleton__line--author-short" />
                            </div>
                        </div>

                        <div className="blog-skeleton__button" />
                    </div>
                </div>
            </div>

            <div className="blog-skeleton__section-heading">
                <div>
                    <div className="blog-skeleton__line blog-skeleton__line--section-label" />

                    <div className="blog-skeleton__line blog-skeleton__line--section-title" />
                </div>

                <div className="blog-skeleton__count" />
            </div>

            <div className="blog-skeleton__grid">
                {Array.from({
                    length: 6,
                }).map((_, index) => (
                    <article
                        className="blog-skeleton__card"
                        key={index}
                    >
                        <div className="blog-skeleton__card-image" />

                        <div className="blog-skeleton__card-content">
                            <div className="blog-skeleton__line blog-skeleton__line--meta" />

                            <div className="blog-skeleton__line blog-skeleton__line--card-title" />

                            <div className="blog-skeleton__line blog-skeleton__line--card-title blog-skeleton__line--short" />

                            <div className="blog-skeleton__card-footer">
                                <div className="blog-skeleton__line blog-skeleton__line--footer" />

                                <div className="blog-skeleton__line blog-skeleton__line--footer blog-skeleton__line--footer-short" />
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default BlogSkeleton;

