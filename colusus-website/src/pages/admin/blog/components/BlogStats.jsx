import {
    CheckCircle2,
    Clock3,
    FileText,
} from "lucide-react";

import "./BlogStats.css";

const BlogStats = ({
    stats,
}) => {
    return (
        <section
            className="blog-stats"
            aria-label="Journal statistics"
        >
            <div className="blog-stats__item">
                <div className="blog-stats__content">
                    <span className="blog-stats__label">
                        Total
                    </span>

                    <strong className="blog-stats__value">
                        {stats?.total ?? 0}
                    </strong>
                </div>

                <span className="blog-stats__icon">
                    <FileText
                        size={17}
                        strokeWidth={1.8}
                    />
                </span>
            </div>

            <div className="blog-stats__item">
                <div className="blog-stats__content">
                    <span className="blog-stats__label">
                        Published
                    </span>

                    <strong className="blog-stats__value">
                        {stats?.published ?? 0}
                    </strong>
                </div>

                <span className="blog-stats__icon blog-stats__icon--success">
                    <CheckCircle2
                        size={17}
                        strokeWidth={1.8}
                    />
                </span>
            </div>

            <div className="blog-stats__item">
                <div className="blog-stats__content">
                    <span className="blog-stats__label">
                        Drafts
                    </span>

                    <strong className="blog-stats__value">
                        {stats?.drafts ?? 0}
                    </strong>
                </div>

                <span className="blog-stats__icon">
                    <FileText
                        size={17}
                        strokeWidth={1.8}
                    />
                </span>
            </div>

            <div className="blog-stats__item">
                <div className="blog-stats__content">
                    <span className="blog-stats__label">
                        Scheduled
                    </span>

                    <strong className="blog-stats__value">
                        {stats?.scheduled ?? 0}
                    </strong>
                </div>

                <span className="blog-stats__icon blog-stats__icon--scheduled">
                    <Clock3
                        size={17}
                        strokeWidth={1.8}
                    />
                </span>
            </div>
        </section>
    );
};

export default BlogStats;