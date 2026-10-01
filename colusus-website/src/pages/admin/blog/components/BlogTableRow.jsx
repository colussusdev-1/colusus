import {
    ArrowUpRight,
    CalendarDays,
    Eye,
    MoreHorizontal,
    Star,
    Trash2,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import "./BlogTableRow.css";

const formatDate = (date) => {
    if (!date) {
        return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(parsedDate);
};

const getAuthorName = (post) => {
    if (typeof post?.author === "string") {
        return post.author;
    }

    return (
        post?.author?.name ||
        post?.author?.fullName ||
        post?.author?.email ||
        "Colossus Editorial"
    );
};

const getCategoryName = (post) => {
    if (typeof post?.category === "string") {
        return post.category;
    }

    return (
        post?.category?.name ||
        "Journal"
    );
};

const getStatusLabel = (status) => {
    switch (status) {
        case "PUBLISHED":
            return "Published";

        case "SCHEDULED":
            return "Scheduled";

        case "DRAFT":
        default:
            return "Draft";
    }
};

const getStatusClass = (status) => {
    switch (status) {
        case "PUBLISHED":
            return "published";

        case "SCHEDULED":
            return "scheduled";

        case "DRAFT":
        default:
            return "draft";
    }
};

const getPostImage = (post) => {
    const image =
        post?.coverImage ||
        post?.featuredImage ||
        post?.image;

    if (!image) {
        return "";
    }

    if (typeof image === "string") {
        return image;
    }

    return (
        image?.url ||
        image?.secure_url ||
        ""
    );
};

const BlogTableRow = ({
    post,
    actionLoading,
    onPublish,
    onUnpublish,
    onToggleFeatured,
    onDelete,
}) => {
    const navigate = useNavigate();

    const postId = post?._id || post?.id;

    const image = getPostImage(post);

    const status = post?.status || "DRAFT";

    const statusClass = getStatusClass(status);

    const statusLabel = getStatusLabel(status);

    const date =
        post?.publishedAt ||
        post?.scheduledFor ||
        post?.createdAt;

    const views = Number(post?.views || 0);

    const isActionLoading =
        actionLoading === postId;

    const isPublishLoading =
        actionLoading === `publish-${postId}`;

    const isUnpublishLoading =
        actionLoading === `unpublish-${postId}`;

    const isFeaturedLoading =
        actionLoading === `featured-${postId}`;

    const isDeleteLoading =
        actionLoading === `delete-${postId}`;

    return (
        <tr>
            <td>
                <div className="blog-table-row__article">
                    <div className="blog-table-row__thumb">
                        {image ? (
                            <img
                                src={image}
                                alt=""
                            />
                        ) : (
                            <div className="blog-table-row__thumb-placeholder">
                                <span />
                            </div>
                        )}
                    </div>

                    <div className="blog-table-row__copy">
                        <div className="blog-table-row__title-row">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/admin/blog/${postId}/edit`
                                    )
                                }
                            >
                                {post?.title ||
                                    "Untitled article"}
                            </button>

                            {post?.featured && (
                                <span className="blog-table-row__featured">
                                    <Star
                                        size={10}
                                        strokeWidth={2}
                                        fill="currentColor"
                                    />

                                    Featured
                                </span>
                            )}
                        </div>

                        <span>
                            /{post?.slug || "untitled"}
                        </span>
                    </div>
                </div>
            </td>

            <td>
                <span
                    className={`blog-table-row__status blog-table-row__status--${statusClass}`}
                >
                    <span />

                    {statusLabel}
                </span>
            </td>

            <td>
                <span className="blog-table-row__category">
                    {getCategoryName(post)}
                </span>
            </td>

            <td>
                <span className="blog-table-row__author">
                    {getAuthorName(post)}
                </span>
            </td>

            <td>
                <span className="blog-table-row__date">
                    <CalendarDays
                        size={12}
                        strokeWidth={1.8}
                    />

                    {formatDate(date)}
                </span>
            </td>

            <td>
                <span className="blog-table-row__views">
                    <Eye
                        size={12}
                        strokeWidth={1.8}
                    />

                    {views.toLocaleString()}
                </span>
            </td>

            <td>
                <div className="blog-table-row__actions">
                    {status === "DRAFT" && (
                        <button
                            type="button"
                            className="blog-table-row__action blog-table-row__action--publish"
                            disabled={isActionLoading}
                            onClick={() =>
                                onPublish(postId)
                            }
                        >
                            <ArrowUpRight
                                size={12}
                                strokeWidth={2}
                            />

                            {isPublishLoading
                                ? "..."
                                : "Publish"}
                        </button>
                    )}

                    {status === "PUBLISHED" && (
                        <button
                            type="button"
                            className="blog-table-row__action"
                            disabled={isActionLoading}
                            onClick={() =>
                                onUnpublish(postId)
                            }
                        >
                            {isUnpublishLoading
                                ? "..."
                                : "Unpublish"}
                        </button>
                    )}

                    <button
                        type="button"
                        className="blog-table-row__icon-action"
                        title={
                            post?.featured
                                ? "Remove featured"
                                : "Set as featured"
                        }
                        disabled={
                            isActionLoading
                        }
                        onClick={() =>
                            onToggleFeatured(
                                postId
                            )
                        }
                    >
                        <Star
                            size={13}
                            strokeWidth={1.8}
                            fill={
                                post?.featured
                                    ? "currentColor"
                                    : "none"
                            }
                        />
                    </button>

                    <Link
                        to={`/admin/blog/${postId}/edit`}
                        className="blog-table-row__icon-action"
                        title="Edit article"
                    >
                        <MoreHorizontal
                            size={14}
                            strokeWidth={1.8}
                        />
                    </Link>

                    <Link
                        to={`/blog/${post?.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="blog-table-row__icon-action"
                        title="Open article"
                    >
                        <ArrowUpRight
                            size={13}
                            strokeWidth={1.8}
                        />
                    </Link>

                    <button
                        type="button"
                        className="blog-table-row__icon-action blog-table-row__icon-action--danger"
                        title="Delete article"
                        disabled={isActionLoading}
                        onClick={() =>
                            onDelete(postId)
                        }
                    >
                        <Trash2
                            size={13}
                            strokeWidth={1.8}
                        />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default BlogTableRow;