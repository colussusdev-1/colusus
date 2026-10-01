
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import BlogHero from "./components/BlogHero";
import CategoryFilter from "./components/CategoryFilter";
import FeaturedPost from "./components/FeaturedPost";
import BlogGrid from "./components/BlogGrid";
import BlogSkeleton from "./components/BlogSkeleton";
import BlogEmpty from "./components/BlogEmpty";

import {
    getBlogCategories,
    getFeaturedPost,
    getPosts,
} from "./services/blog.api";

import "./Blog.css";

const Blog = () => {
    const [featured, setFeatured] =
        useState(null);

    const [posts, setPosts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [category, setCategory] =
        useState("all");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadBlog = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    featuredResult,
                    postsResult,
                    categoriesResult,
                ] = await Promise.all([
                    getFeaturedPost(),

                    getPosts({
                        category,
                        page: 1,
                        limit: 12,
                    }),

                    getBlogCategories(),
                ]);

                const featuredPost =
                    featuredResult?.data ||
                    null;

                const postsData =
                    postsResult?.data;

                const nextPosts =
                    Array.isArray(
                        postsData?.posts,
                    )
                        ? postsData.posts
                        : Array.isArray(
                            postsData,
                        )
                            ? postsData
                            : [];

                const nextCategories =
                    Array.isArray(
                        categoriesResult?.data,
                    )
                        ? categoriesResult.data
                        : [];

                setFeatured(
                    featuredPost,
                );

                setPosts(
                    nextPosts,
                );

                setCategories(
                    nextCategories,
                );
            } catch (err) {
                console.error(
                    "Failed to load blog:",
                    err,
                );

                setError(
                    err?.message ||
                    "We couldn't load the journal right now.",
                );
            } finally {
                setLoading(false);
            }
        },
        [category],
    );

    useEffect(() => {
        loadBlog();
    }, [loadBlog]);

    const visiblePosts =
        useMemo(() => {
            if (!featured) {
                return posts;
            }

            const featuredId =
                featured._id ||
                featured.id ||
                featured.slug;

            return posts.filter(
                (post) => {
                    const postId =
                        post?._id ||
                        post?.id ||
                        post?.slug;

                    if (
                        postId &&
                        featuredId
                    ) {
                        return (
                            String(postId) !==
                            String(
                                featuredId,
                            )
                        );
                    }

                    return (
                        post?.slug !==
                        featured?.slug
                    );
                },
            );
        }, [
            featured,
            posts,
        ]);

    const handleCategoryChange = (
        nextCategory,
    ) => {
        setCategory(
            nextCategory,
        );
    };

    if (loading) {
        return (
            <main className="blog-page">
                <BlogHero />

                <section className="blog-content-stage">
                    <div className="blog-content blog-content--loading">
                        <BlogSkeleton />
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="blog-page">
            <BlogHero />

            <section className="blog-content-stage">
                {error ? (
                    <div className="blog-state">
                        <BlogEmpty
                            title="The journal is taking a moment."
                            description={error}
                            actionLabel="Try again"
                            onAction={
                                loadBlog
                            }
                        />
                    </div>
                ) : (
                    <div className="blog-content">
                        <div className="blog-content__filter">
                            <CategoryFilter
                                categories={
                                    categories
                                }
                                activeCategory={
                                    category
                                }
                                onChange={
                                    handleCategoryChange
                                }
                            />
                        </div>

                        {featured && (
                            <FeaturedPost
                                post={
                                    featured
                                }
                            />
                        )}

                        {visiblePosts.length >
                            0 ? (
                            <BlogGrid
                                posts={
                                    visiblePosts
                                }
                            />
                        ) : (
                            <BlogEmpty
                                title={
                                    featured
                                        ? "More stories are coming."
                                        : "No articles yet."
                                }
                                description={
                                    featured
                                        ? "There are no other published articles in this category right now."
                                        : "There are no published articles in this category."
                                }
                            />
                        )}
                    </div>
                )}
            </section>
        </main>
    );
};

export default Blog;
