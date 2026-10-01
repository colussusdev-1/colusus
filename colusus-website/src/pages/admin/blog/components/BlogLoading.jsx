import "./BlogLoading.css";

const BlogLoading = ({
    rows = 6,
}) => {
    return (
        <div
            className="blog-loading"
            aria-label="Loading journal articles"
            role="status"
        >
            <div className="blog-loading__header">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
            </div>

            <div className="blog-loading__rows">
                {Array.from(
                    { length: rows },
                    (_, index) => (
                        <div
                            key={index}
                            className="blog-loading__row"
                        >
                            <div className="blog-loading__article">
                                <span className="blog-loading__thumbnail" />

                                <div className="blog-loading__article-copy">
                                    <span className="blog-loading__line blog-loading__line--title" />
                                    <span className="blog-loading__line blog-loading__line--slug" />
                                </div>
                            </div>

                            <span className="blog-loading__status" />

                            <span className="blog-loading__category" />

                            <span className="blog-loading__author" />

                            <span className="blog-loading__date" />

                            <span className="blog-loading__views" />

                            <div className="blog-loading__actions">
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                    ),
                )}
            </div>
        </div>
    );
};

export default BlogLoading;