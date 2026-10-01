
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    CheckCircle2,
    Clock3,
    MessageCircle,
    Send,
    UserRound,
} from "lucide-react";

import {
    createPostComment,
    getPostComments,
} from "../services/blogPost.api";

import "./Comments.css";

const formatDate = (
    date,
) => {
    if (!date) {
        return "";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime(),
        )
    ) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        },
    ).format(parsedDate);
};

const getInitial = (
    name,
) => {
    if (!name) {
        return "C";
    }

    return String(name)
        .trim()
        .charAt(0)
        .toUpperCase();
};

const Comments = ({
    postId,
    commentsEnabled = true,
}) => {
    const [
        comments,
        setComments,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        submitted,
        setSubmitted,
    ] = useState(false);

    const [
        form,
        setForm,
    ] = useState({
        name: "",
        email: "",
        content: "",
    });

    const loadComments =
        useCallback(
            async () => {
                if (!postId) {
                    setComments([]);
                    setLoading(false);
                    return;
                }

                try {
                    setLoading(true);
                    setError("");

                    const result =
                        await getPostComments(
                            postId,
                        );

                    const nextComments =
                        Array.isArray(
                            result?.data,
                        )
                            ? result.data
                            : Array.isArray(
                                result,
                            )
                                ? result
                                : [];

                    setComments(
                        nextComments,
                    );
                } catch (err) {
                    console.error(
                        "Failed to load comments:",
                        err,
                    );

                    setError(
                        err?.message ||
                        "Comments could not be loaded right now.",
                    );
                } finally {
                    setLoading(false);
                }
            },
            [postId],
        );

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const orderedComments =
        useMemo(() => {
            return [
                ...comments,
            ].sort(
                (
                    first,
                    second,
                ) => {
                    if (
                        first?.pinned &&
                        !second?.pinned
                    ) {
                        return -1;
                    }

                    if (
                        !first?.pinned &&
                        second?.pinned
                    ) {
                        return 1;
                    }

                    const firstDate =
                        new Date(
                            first?.publishedAt ||
                            first?.createdAt ||
                            0,
                        ).getTime();

                    const secondDate =
                        new Date(
                            second?.publishedAt ||
                            second?.createdAt ||
                            0,
                        ).getTime();

                    return (
                        secondDate -
                        firstDate
                    );
                },
            );
        }, [comments]);

    const handleChange = (
        event,
    ) => {
        const {
            name,
            value,
        } = event.target;

        setForm(
            (current) => ({
                ...current,
                [name]: value,
            }),
        );

        if (error) {
            setError("");
        }

        if (submitted) {
            setSubmitted(false);
        }
    };

    const handleSubmit = async (
        event,
    ) => {
        event.preventDefault();

        if (!postId || submitting) {
            return;
        }

        const name =
            form.name.trim();

        const email =
            form.email.trim();

        const content =
            form.content.trim();

        if (!name || !content) {
            setError(
                "Please enter your name and comment.",
            );

            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setSubmitted(false);

            await createPostComment({
                postId,
                name,
                email,
                content,
            });

            setForm({
                name: "",
                email: "",
                content: "",
            });

            setSubmitted(true);
        } catch (err) {
            console.error(
                "Failed to submit comment:",
                err,
            );

            setError(
                err?.message ||
                "Your comment could not be submitted. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!commentsEnabled) {
        return null;
    }

    const commentCount =
        orderedComments.length;

    return (
        <section
            className="post-comments"
            aria-labelledby="post-comments-title"
        >
            <div className="post-comments__inner">
                <div className="post-comments__header">
                    <div className="post-comments__heading">
                        <span className="post-comments__eyebrow">
                            Join the conversation
                        </span>

                        <h2 id="post-comments-title">
                            Reader thoughts
                        </h2>

                        <p>
                            Have something to add,
                            ask, or share? Leave a
                            comment below.
                        </p>
                    </div>

                    <div className="post-comments__count">
                        <MessageCircle
                            size={15}
                            strokeWidth={1.8}
                        />

                        <strong>
                            {commentCount}
                        </strong>

                        <span>
                            {commentCount ===
                                1
                                ? "comment"
                                : "comments"}
                        </span>
                    </div>
                </div>

                <div className="post-comments__layout">
                    <div className="post-comments__list">
                        {loading ? (
                            <div className="post-comments__state">
                                <span className="post-comments__spinner" />

                                <p>
                                    Loading
                                    comments...
                                </p>
                            </div>
                        ) : error &&
                            !commentCount ? (
                            <div className="post-comments__state post-comments__state--error">
                                <MessageCircle
                                    size={18}
                                    strokeWidth={1.7}
                                />

                                <p>
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        loadComments
                                    }
                                >
                                    Try again
                                </button>
                            </div>
                        ) : commentCount ===
                            0 ? (
                            <div className="post-comments__state post-comments__state--empty">
                                <MessageCircle
                                    size={20}
                                    strokeWidth={1.6}
                                />

                                <strong>
                                    Be the first
                                    to comment.
                                </strong>

                                <p>
                                    There are no
                                    published
                                    comments on
                                    this article
                                    yet.
                                </p>
                            </div>
                        ) : (
                            orderedComments.map(
                                (
                                    comment,
                                ) => (
                                    <article
                                        className={`post-comment ${comment?.pinned
                                                ? "post-comment--pinned"
                                                : ""
                                            }`}
                                        key={
                                            comment?._id ||
                                            comment?.id
                                        }
                                    >
                                        <div className="post-comment__avatar">
                                            {getInitial(
                                                comment?.name,
                                            )}
                                        </div>

                                        <div className="post-comment__body">
                                            <div className="post-comment__top">
                                                <div className="post-comment__author">
                                                    <strong>
                                                        {
                                                            comment?.name
                                                        }
                                                    </strong>

                                                    {comment?.isEditorial && (
                                                        <span className="post-comment__editorial">
                                                            Editorial
                                                        </span>
                                                    )}

                                                    {comment?.pinned && (
                                                        <span className="post-comment__pinned">
                                                            Pinned
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="post-comment__date">
                                                    {formatDate(
                                                        comment?.publishedAt ||
                                                        comment?.createdAt,
                                                    )}
                                                </span>
                                            </div>

                                            <p>
                                                {
                                                    comment?.content
                                                }
                                            </p>
                                        </div>
                                    </article>
                                ),
                            )
                        )}
                    </div>

                    <div className="post-comments__form-wrap">
                        <div className="post-comments__form-heading">
                            <span>
                                Leave a comment
                            </span>

                            <Clock3
                                size={14}
                                strokeWidth={1.8}
                            />
                        </div>

                        {submitted ? (
                            <div className="post-comments__success">
                                <span className="post-comments__success-icon">
                                    <CheckCircle2
                                        size={20}
                                        strokeWidth={
                                            1.8
                                        }
                                    />
                                </span>

                                <strong>
                                    Comment
                                    received.
                                </strong>

                                <p>
                                    Thanks for
                                    contributing
                                    to the
                                    conversation.
                                    Your comment
                                    will appear
                                    once it has
                                    been reviewed.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSubmitted(
                                            false,
                                        )
                                    }
                                >
                                    Leave another
                                </button>
                            </div>
                        ) : (
                            <form
                                className="post-comments__form"
                                onSubmit={
                                    handleSubmit
                                }
                            >
                                <div className="post-comments__fields">
                                    <label>
                                        <span>
                                            Name
                                        </span>

                                        <div className="post-comments__input-wrap">
                                            <UserRound
                                                size={
                                                    14
                                                }
                                                strokeWidth={
                                                    1.8
                                                }
                                            />

                                            <input
                                                type="text"
                                                name="name"
                                                value={
                                                    form.name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Your name"
                                                autoComplete="name"
                                                maxLength={
                                                    120
                                                }
                                                required
                                            />
                                        </div>
                                    </label>

                                    <label>
                                        <span>
                                            Email
                                            <em>
                                                Optional
                                            </em>
                                        </span>

                                        <div className="post-comments__input-wrap">
                                            <input
                                                type="email"
                                                name="email"
                                                value={
                                                    form.email
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="you@example.com"
                                                autoComplete="email"
                                                maxLength={
                                                    160
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label className="post-comments__message-field">
                                        <span>
                                            Comment
                                        </span>

                                        <textarea
                                            name="content"
                                            value={
                                                form.content
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Share your thoughts..."
                                            rows={
                                                5
                                            }
                                            maxLength={
                                                2000
                                            }
                                            required
                                        />
                                    </label>
                                </div>

                                {error && (
                                    <div className="post-comments__form-error">
                                        {error}
                                    </div>
                                )}

                                <div className="post-comments__form-footer">
                                    <p>
                                        Comments are
                                        reviewed
                                        before
                                        appearing
                                        publicly.
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={
                                            submitting
                                        }
                                    >
                                        <span>
                                            {submitting
                                                ? "Sending..."
                                                : "Post comment"}
                                        </span>

                                        <Send
                                            size={14}
                                            strokeWidth={
                                                1.9
                                            }
                                        />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Comments;

