
import {
    ArrowUpRight,
    FileText,
    Sparkles,
} from "lucide-react";

import "./BlogEmpty.css";

const BlogEmpty = ({
    title = "No articles yet.",
    description = "There is nothing to show here right now.",
    actionLabel = "",
    onAction,
}) => {
    return (
        <section
            className="blog-empty"
            aria-live="polite"
        >
            <div
                className="blog-empty__atmosphere"
                aria-hidden="true"
            >
                <span />
                <span />
                <span />
            </div>

            <div
                className="blog-empty__visual"
                aria-hidden="true"
            >
                <div className="blog-empty__icon">
                    <FileText
                        size={21}
                        strokeWidth={1.7}
                    />
                </div>

                <span className="blog-empty__spark">
                    <Sparkles
                        size={12}
                        strokeWidth={1.8}
                    />
                </span>
            </div>

            <div className="blog-empty__content">
                <span className="blog-empty__eyebrow">
                    Colossus Journal
                </span>

                <h3>
                    {title}
                </h3>

                <p>
                    {description}
                </p>

                {actionLabel &&
                    onAction && (
                        <button
                            type="button"
                            className="blog-empty__action"
                            onClick={onAction}
                        >
                            <span>
                                {actionLabel}
                            </span>

                            <ArrowUpRight
                                size={15}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        </button>
                    )}
            </div>
        </section>
    );
};

export default BlogEmpty;

