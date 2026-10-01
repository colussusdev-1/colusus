import BlogTableRow from "./BlogTableRow";

import "./BlogTable.css";

const BlogTable = ({
    posts,
    actionLoading,
    onPublish,
    onUnpublish,
    onToggleFeatured,
    onDelete,
}) => {
    return (
        <div className="blog-table__wrap">
            <table className="blog-table">
                <thead>
                    <tr>
                        <th>Article</th>
                        <th>Status</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>Views</th>
                        <th aria-label="Actions" />
                    </tr>
                </thead>

                <tbody>
                    {posts.map((post) => (
                        <BlogTableRow
                            key={post._id || post.id}
                            post={post}
                            actionLoading={actionLoading}
                            onPublish={onPublish}
                            onUnpublish={onUnpublish}
                            onToggleFeatured={onToggleFeatured}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlogTable;