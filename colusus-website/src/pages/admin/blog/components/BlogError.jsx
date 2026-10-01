import {
    AlertCircle,
    RotateCcw,
} from "lucide-react";

import "./BlogError.css";

const BlogError = ({
    error,
    onRetry,
}) => {
    if (!error) {
        return null;
    }

    return (
        <div
            className="blog-error"
            role="alert"
        >
            <div className="blog-error__content">
                <div className="blog-error__icon">
                    <AlertCircle
                        size={17}
                        strokeWidth={1.9}
                    />
                </div>

                <div className="blog-error__copy">
                    <strong>
                        Unable to load journal
                    </strong>

                    <span>
                        {error}
                    </span>
                </div>
            </div>

            <button
                type="button"
                className="blog-error__action"
                onClick={onRetry}
            >
                <RotateCcw
                    size={14}
                    strokeWidth={1.9}
                />

                <span>
                    Try again
                </span>
            </button>
        </div>
    );
};

export default BlogError;