export const createSlug = (value = "") => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const calculateReadingTime = (content = "") => {
  const cleanContent = String(content)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanContent ? cleanContent.split(" ").length : 0;

  return Math.max(1, Math.ceil(words / 200));
};

export const isPublishable = (post) => {
  if (!post) {
    return false;
  }

  if (post.status !== "PUBLISHED") {
    return false;
  }

  if (!post.publishedAt) {
    return false;
  }

  return new Date(post.publishedAt) <= new Date();
};
