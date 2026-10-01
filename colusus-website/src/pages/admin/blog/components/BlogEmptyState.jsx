import {
    FileText,
    Plus,
    RotateCcw,
    SearchX,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import "./BlogEmptyState.css";

const BlogEmptyState = ({
    hasFilters = false,
    onClearFilters,
}) => {
    if (hasFilters) {
        return (
            <div className="blog-empty">
                <div className="blog-empty__icon">
                    <SearchX
                        size={21}
                        strokeWidth={1.7}
                    />
                </div>

                <div className="blog-empty__content">
                    <span className="blog-empty__eyebrow">
                        No results
                    </span>

                    <h2>
                        No matching articles
                    </h2>

                    <p>
                        Nothing in your journal
                        matches the current
                        search or status filter.
                    </p>
                </div>

                <button
                    type="button"
                    className="blog-empty__secondary-action"
                    onClick={
                        onClearFilters
                    }
                >
                    <RotateCcw
                        size={14}
                        strokeWidth={1.8}
                    />

                    Clear filters
                </button>
            </div>
        );
    }

    return (
        <div className="blog-empty">
            <div className="blog-empty__icon blog-empty__icon--primary">
                <FileText
                    size={21}
                    strokeWidth={1.7}
                />
            </div>

            <div className="blog-empty__content">
                <span className="blog-empty__eyebrow">
                    Colossus Journal
                </span>

                <h2>
                    Your journal is empty
                </h2>

                <p>
                    Create your first article
                    to start publishing stories,
                    guides and insights to the
                    Colossus Journal.
                </p>
            </div>

            <Link
                to="/admin/blog/new"
                className="blog-empty__primary-action"
            >
                <span className="blog-empty__primary-icon">
                    <Plus
                        size={15}
                        strokeWidth={2}
                    />
                </span>

                Create article
            </Link>
        </div>
    );
};

export default BlogEmptyState;