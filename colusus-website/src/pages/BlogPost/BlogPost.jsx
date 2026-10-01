
import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "react-router-dom";

import PostHero from "./components/PostHero";
import PostMeta from "./components/PostMeta";
import PostContent from "./components/PostContent";
import Comments from "./components/Comments";
import RelatedPosts from "./components/RelatedPosts";
import PostSkeleton from "./components/PostSkeleton";
import PostNotFound from "./components/PostNotFound";

import {
    getPostBySlug,
    getRelatedPosts,
    recordPostView,
} from "./services/blogPost.api";

import "./BlogPost.css";

const BlogPost = () => {
    const {
        slug,
    } = useParams();

    const [
        post,
        setPost,
    ] = useState(null);

    const [
        relatedPosts,
        setRelatedPosts,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const loadPost =
        useCallback(
            async () => {
                if (!slug) {
                    setError(
                        "Article not found.",
                    );

                    setLoading(false);

                    return;
                }

                try {
                    setLoading(true);
                    setError("");
                    setPost(null);
                    setRelatedPosts([]);

                    const postResult =
                        await getPostBySlug(
                            slug,
                        );

                    const postData =
                        postResult?.data ||
                        null;

                    if (!postData) {
                        setError(
                            "Article not found.",
                        );

                        return;
                    }

                    setPost(
                        postData,
                    );

                    try {
                        const relatedResult =
                            await getRelatedPosts(
                                slug,
                            );

                        const nextRelated =
                            Array.isArray(
                                relatedResult?.data,
                            )
                                ? relatedResult.data
                                : [];

                        setRelatedPosts(
                            nextRelated,
                        );
                    } catch (
                    relatedError
                    ) {
                        console.error(
                            "Failed to load related posts:",
                            relatedError,
                        );

                        setRelatedPosts(
                            [],
                        );
                    }

                    const postId =
                        postData._id ||
                        postData.id;

                    if (postId) {
                        try {
                            await recordPostView(
                                postId,
                            );
                        } catch (
                        viewError
                        ) {
                            console.error(
                                "Failed to record post view:",
                                viewError,
                            );
                        }
                    }
                } catch (err) {
                    console.error(
                        "Failed to load blog post:",
                        err,
                    );

                    setError(
                        err?.message ||
                        "We couldn't load this article right now.",
                    );
                } finally {
                    setLoading(
                        false,
                    );
                }
            },
            [slug],
        );

    useEffect(() => {
        loadPost();
    }, [loadPost]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant",
        });
    }, [slug]);

    if (loading) {
        return (
            <main className="blog-post-page">
                <PostSkeleton />
            </main>
        );
    }

    if (error || !post) {
        return (
            <main className="blog-post-page">
                <PostNotFound
                    message={error}
                    onRetry={loadPost}
                />
            </main>
        );
    }

    const postId =
        post._id ||
        post.id;

    return (
        <main className="blog-post-page">
            <PostHero
                post={post}
            />

            <PostMeta
                post={post}
            />

            <PostContent
                post={post}
            />

            <Comments
                postId={postId}
                commentsEnabled={
                    post.commentsEnabled !==
                    false
                }
            />

            {relatedPosts.length >
                0 && (
                    <RelatedPosts
                        posts={
                            relatedPosts
                        }
                    />
                )}
        </main>
    );
};

export default BlogPost;
