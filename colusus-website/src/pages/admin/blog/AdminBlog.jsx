import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getAdminPosts,
    deleteAdminPost,
    publishAdminPost,
    setFeaturedPost,
    unpublishAdminPost,
} from "./services/blog.admin.api";

import BlogHeader from "./components/BlogHeader";
import BlogStats from "./components/BlogStats";
import BlogToolbar from "./components/BlogToolbar";
import BlogError from "./components/BlogError";
import BlogLoading from "./components/BlogLoading";
import BlogEmptyState from "./components/BlogEmptyState";
import BlogTable from "./components/BlogTable";

import "./AdminBlog.css";

const STATUS_OPTIONS = [
    {
        value: "ALL",
        label: "All articles",
    },
    {
        value: "DRAFT",
        label: "Drafts",
    },
    {
        value: "SCHEDULED",
        label: "Scheduled",
    },
    {
        value: "PUBLISHED",
        label: "Published",
    },
];

const getAuthorName = (author) => {
    if (!author) {
        return "Colossus Editorial";
    }

    if (
        typeof author ===
        "string"
    ) {
        return author;
    }

    return (
        author.name ||
        author.fullName ||
        author.displayName ||
        author.email ||
        "Colossus Editorial"
    );
};

const AdminBlog = () => {
    const [
        posts,
        setPosts,
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
        search,
        setSearch,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState("ALL");

    const [
        actionLoading,
        setActionLoading,
    ] = useState("");

    const loadPosts =
        useCallback(
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const result =
                        await getAdminPosts({
                            page: 1,
                            limit: 100,
                            status:
                                status ===
                                    "ALL"
                                    ? ""
                                    : status,
                        });

                    const nextPosts =
                        Array.isArray(
                            result?.data,
                        )
                            ? result.data
                            : [];

                    setPosts(
                        nextPosts,
                    );
                } catch (
                err
                ) {
                    console.error(
                        "Failed to load admin blog:",
                        err,
                    );

                    setError(
                        err?.message ||
                        "Unable to load journal articles.",
                    );
                } finally {
                    setLoading(
                        false,
                    );
                }
            },
            [status],
        );

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const filteredPosts =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return posts;
            }

            return posts.filter(
                (post) => {
                    const title =
                        String(
                            post?.title ||
                            "",
                        ).toLowerCase();

                    const category =
                        String(
                            typeof post?.category ===
                                "string"
                                ? post.category
                                : post?.category
                                    ?.name ||
                                "",
                        ).toLowerCase();

                    const author =
                        getAuthorName(
                            post?.author,
                        ).toLowerCase();

                    return (
                        title.includes(
                            query,
                        ) ||
                        category.includes(
                            query,
                        ) ||
                        author.includes(
                            query,
                        )
                    );
                },
            );
        }, [
            posts,
            search,
        ]);

    const stats =
        useMemo(() => {
            return {
                total:
                    posts.length,

                published:
                    posts.filter(
                        (post) =>
                            post?.status ===
                            "PUBLISHED",
                    ).length,

                drafts:
                    posts.filter(
                        (post) =>
                            post?.status ===
                            "DRAFT",
                    ).length,

                scheduled:
                    posts.filter(
                        (post) =>
                            post?.status ===
                            "SCHEDULED",
                    ).length,
            };
        }, [posts]);

    const handlePublish =
        async (post) => {
            const postId =
                post?._id ||
                post?.id;

            if (!postId) {
                return;
            }

            try {
                setActionLoading(
                    `publish-${postId}`,
                );

                await publishAdminPost(
                    postId,
                );

                await loadPosts();
            } catch (
            err
            ) {
                console.error(
                    "Failed to publish post:",
                    err,
                );

                setError(
                    err?.message ||
                    "Unable to publish this article.",
                );
            } finally {
                setActionLoading(
                    "",
                );
            }
        };

    const handleUnpublish =
        async (post) => {
            const postId =
                post?._id ||
                post?.id;

            if (!postId) {
                return;
            }

            try {
                setActionLoading(
                    `unpublish-${postId}`,
                );

                await unpublishAdminPost(
                    postId,
                );

                await loadPosts();
            } catch (
            err
            ) {
                console.error(
                    "Failed to unpublish post:",
                    err,
                );

                setError(
                    err?.message ||
                    "Unable to unpublish this article.",
                );
            } finally {
                setActionLoading(
                    "",
                );
            }
        };

    const handleToggleFeatured =
        async (post) => {
            const postId =
                post?._id ||
                post?.id;

            if (!postId) {
                return;
            }

            try {
                setActionLoading(
                    `featured-${postId}`,
                );

                await setFeaturedPost(
                    postId,
                );

                await loadPosts();
            } catch (
            err
            ) {
                console.error(
                    "Failed to update featured state:",
                    err,
                );

                setError(
                    err?.message ||
                    "Unable to update featured state.",
                );
            } finally {
                setActionLoading(
                    "",
                );
            }
        };

    const handleDelete =
        async (post) => {
            const postId =
                post?._id ||
                post?.id;

            if (!postId) {
                return;
            }

            const confirmed =
                window.confirm(
                    `Delete "${post?.title || "this article"}"? This action cannot be undone.`,
                );

            if (!confirmed) {
                return;
            }

            try {
                setActionLoading(
                    `delete-${postId}`,
                );

                await deleteAdminPost(
                    postId,
                );

                setPosts(
                    (current) =>
                        current.filter(
                            (item) =>
                                String(
                                    item?._id ||
                                    item?.id,
                                ) !==
                                String(
                                    postId,
                                ),
                        ),
                );
            } catch (
            err
            ) {
                console.error(
                    "Failed to delete post:",
                    err,
                );

                setError(
                    err?.message ||
                    "Unable to delete this article.",
                );
            } finally {
                setActionLoading(
                    "",
                );
            }
        };

    const hasFilters =
        Boolean(
            search.trim(),
        ) ||
        status !== "ALL";

    return (
        <section className="admin-blog">
            <BlogHeader />

            <BlogStats
                stats={stats}
            />

            <BlogToolbar
                search={search}
                onSearchChange={(
                    event,
                ) =>
                    setSearch(
                        event.target
                            .value,
                    )
                }
                status={status}
                onStatusChange={
                    setStatus
                }
                statusOptions={
                    STATUS_OPTIONS
                }
            />

            <BlogError
                error={error}
                onRetry={loadPosts}
            />

            <div className="admin-blog__content">
                {loading ? (
                    <BlogLoading
                        rows={6}
                    />
                ) : filteredPosts.length ===
                    0 ? (
                    <BlogEmptyState
                        hasFilters={
                            hasFilters
                        }
                        onClearFilters={() => {
                            setSearch(
                                "",
                            );

                            setStatus(
                                "ALL",
                            );
                        }}
                    />
                ) : (
                    <BlogTable
                        posts={
                            filteredPosts
                        }
                        actionLoading={
                            actionLoading
                        }
                        onPublish={
                            handlePublish
                        }
                        onUnpublish={
                            handleUnpublish
                        }
                        onToggleFeatured={
                            handleToggleFeatured
                        }
                        onDelete={
                            handleDelete
                        }
                    />
                )}
            </div>
        </section>
    );
};

export default AdminBlog;