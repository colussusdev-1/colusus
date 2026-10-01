import {
    ArrowUpRight,
    Plus,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import "./BlogHeader.css";

const BlogHeader = () => {
    return (
        <header className="blog-header">
            <div className="blog-header__main">
                <div className="blog-header__eyebrow">
                    <span className="blog-header__eyebrow-mark">
                        <span />
                    </span>

                    <span>
                        Colossus Journal
                    </span>
                </div>

                <div className="blog-header__title-group">
                    <h1>
                        Journal
                    </h1>

                    <p>
                        Create, manage and publish
                        the stories, guides and
                        insights behind Colossus.
                    </p>
                </div>
            </div>

            <div className="blog-header__actions">
                <Link
                    to="/admin/blog/new"
                    className="blog-header__create"
                >
                    <span className="blog-header__create-icon">
                        <Plus
                            size={16}
                            strokeWidth={2}
                        />
                    </span>

                    <span className="blog-header__create-label">
                        New article
                    </span>

                    <ArrowUpRight
                        className="blog-header__create-arrow"
                        size={15}
                        strokeWidth={1.9}
                    />
                </Link>
            </div>
        </header>
    );
};

export default BlogHeader;