const RAW_API_URL = import.meta.env.VITE_API_URL || "";

const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api\/v1$/, "");

const BLOG_ENDPOINT = `${API_BASE_URL}/api/v1/blog`;

const request = async (endpoint, options = {}) => {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let result = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(
      result?.message || result?.error || "Unable to complete the request.",
    );
  }

  return result;
};

export const getPostBySlug = async (slug) => {
  if (!slug) {
    throw new Error("A post slug is required.");
  }

  return request(`${BLOG_ENDPOINT}/post/${encodeURIComponent(slug)}`);
};

export const getRelatedPosts = async (slug) => {
  if (!slug) {
    throw new Error("A post slug is required.");
  }

  return request(`${BLOG_ENDPOINT}/post/${encodeURIComponent(slug)}/related`);
};

export const recordPostView = async (postId) => {
  if (!postId) {
    throw new Error("A post ID is required.");
  }

  return request(`${BLOG_ENDPOINT}/post/${encodeURIComponent(postId)}/view`, {
    method: "POST",
  });
};

export const getPostComments = async (postId) => {
  if (!postId) {
    throw new Error("A post ID is required.");
  }

  return request(
    `${BLOG_ENDPOINT}/post/${encodeURIComponent(postId)}/comments`,
  );
};

export const createPostComment = async ({
  postId,
  name,
  email,
  content,
} = {}) => {
  if (!postId) {
    throw new Error("A post ID is required.");
  }

  return request(
    `${BLOG_ENDPOINT}/post/${encodeURIComponent(postId)}/comments`,
    {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        content,
      }),
    },
  );
};
