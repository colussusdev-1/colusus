import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    createAdminPost,
    getAdminPost,
    updateAdminPost,
} from "./services/blog.admin.api";

import "./AdminBlogEditor.css";

const DEFAULT_FORM = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    coverImage: {
        url: "",
        publicId: "",
    },
    featured: false,
    commentsEnabled: true,
    status: "DRAFT",
    scheduledFor: "",
    seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
    },
};

const normalizePost = (post) => {
    if (!post) {
        return DEFAULT_FORM;
    }

    return {
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        category:
            typeof post.category === "string"
                ? post.category
                : post.category?.name || "",
        tags: Array.isArray(post.tags)
            ? post.tags
            : [],
        coverImage:
            typeof post.coverImage === "object" &&
                post.coverImage !== null
                ? {
                    url:
                        post.coverImage.url ||
                        post.coverImage.secure_url ||
                        "",
                    publicId:
                        post.coverImage.publicId ||
                        "",
                }
                : {
                    url:
                        typeof post.coverImage ===
                            "string"
                            ? post.coverImage
                            : "",
                    publicId: "",
                },
        featured:
            Boolean(post.featured),
        commentsEnabled:
            post.commentsEnabled !== false,
        status:
            post.status || "DRAFT",
        scheduledFor:
            post.scheduledFor
                ? new Date(post.scheduledFor)
                    .toISOString()
                    .slice(0, 16)
                : "",
        seo: {
            metaTitle:
                post.seo?.metaTitle || "",
            metaDescription:
                post.seo?.metaDescription ||
                "",
            keywords: Array.isArray(
                post.seo?.keywords,
            )
                ? post.seo.keywords
                : [],
        },
    };
};

const AdminBlogEditor = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const isEditing =
        Boolean(id);

    const [
        form,
        setForm,
    ] = useState(DEFAULT_FORM);

    const [
        loading,
        setLoading,
    ] = useState(isEditing);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");

    const updateField = useCallback(
        (
            field,
            value,
        ) => {
            setForm(
                (current) => ({
                    ...current,
                    [field]: value,
                }),
            );
        },
        [],
    );

    const updateSeoField =
        useCallback(
            (
                field,
                value,
            ) => {
                setForm(
                    (current) => ({
                        ...current,

                        seo: {
                            ...current.seo,
                            [field]: value,
                        },
                    }),
                );
            },
            [],
        );

    const loadPost =
        useCallback(
            async () => {
                if (!id) {
                    return;
                }

                try {
                    setLoading(true);
                    setError("");

                    const result =
                        await getAdminPost(
                            id,
                        );

                    setForm(
                        normalizePost(
                            result?.data,
                        ),
                    );
                } catch (
                err
                ) {
                    console.error(
                        "Failed to load blog post:",
                        err,
                    );

                    setError(
                        err?.message ||
                        "Unable to load this article.",
                    );
                } finally {
                    setLoading(
                        false,
                    );
                }
            },
            [id],
        );

    useEffect(() => {
        if (isEditing) {
            loadPost();
        }
    }, [
        isEditing,
        loadPost,
    ]);

    const pageTitle = useMemo(
        () =>
            isEditing
                ? "Edit article"
                : "New article",
        [isEditing],
    );

    const handleSubmit =
        async (
            event,
        ) => {
            event.preventDefault();

            setError("");
            setSuccess("");

            if (
                !form.title.trim()
            ) {
                setError(
                    "Article title is required.",
                );

                return;
            }

            if (
                !form.content.trim()
            ) {
                setError(
                    "Article content is required.",
                );

                return;
            }

            try {
                setSaving(true);

                const payload = {
                    ...form,

                    title:
                        form.title.trim(),

                    slug:
                        form.slug.trim(),

                    excerpt:
                        form.excerpt.trim(),

                    content:
                        form.content.trim(),

                    category:
                        form.category.trim(),

                    scheduledFor:
                        form.scheduledFor ||
                        null,

                    coverImage:
                        form.coverImage?.url
                            ? form.coverImage
                            : null,

                    seo: {
                        ...form.seo,

                        metaTitle:
                            form.seo.metaTitle.trim(),

                        metaDescription:
                            form.seo.metaDescription.trim(),
                    },
                };

                if (isEditing) {
                    await updateAdminPost(
                        id,
                        payload,
                    );

                    setSuccess(
                        "Article updated successfully.",
                    );
                } else {
                    const result =
                        await createAdminPost(
                            payload,
                        );

                    const createdId =
                        result?.data?._id ||
                        result?.data?.id;

                    if (createdId) {
                        navigate(
                            `/admin/blog/${createdId}/edit`,
                            {
                                replace: true,
                            },
                        );

                        return;
                    }

                    setSuccess(
                        "Article created successfully.",
                    );
                }
            } catch (
            err
            ) {
                console.error(
                    "Failed to save blog post:",
                    err,
                );

                setError(
                    err?.message ||
                    "Unable to save this article.",
                );
            } finally {
                setSaving(false);
            }
        };

    if (loading) {
        return (
            <section className="admin-blog-editor">
                <div className="admin-blog-editor__loading">
                    <span />
                    <span />
                    <span />
                </div>
            </section>
        );
    }

    return (
        <section className="admin-blog-editor">
            <header className="admin-blog-editor__header">
                <div>
                    <span className="admin-blog-editor__eyebrow">
                        Colossus Journal
                    </span>

                    <h1>
                        {pageTitle}
                    </h1>

                    <p>
                        {isEditing
                            ? "Update the article content, publishing settings and editorial metadata."
                            : "Create a new article for the Colossus Journal."}
                    </p>
                </div>
            </header>

            {error && (
                <div
                    className="admin-blog-editor__message admin-blog-editor__message--error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    className="admin-blog-editor__message admin-blog-editor__message--success"
                    role="status"
                >
                    {success}
                </div>
            )}

            <form
                className="admin-blog-editor__form"
                onSubmit={
                    handleSubmit
                }
            >
                <div className="admin-blog-editor__placeholder">
                    <p>
                        Editor components
                        will be added here.
                    </p>

                    <small>
                        Title, content, cover
                        image, publishing,
                        SEO and editorial
                        controls.
                    </small>
                </div>

                <div className="admin-blog-editor__actions">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/blog",
                            )
                        }
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : isEditing
                                ? "Save changes"
                                : "Create article"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AdminBlogEditor;