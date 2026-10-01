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
      result?.message ||
        result?.error ||
        `Request failed with status ${response.status}.`,
    );
  }

  return result;
};

export const getPosts = async ({
  category = "all",
  page = 1,
  limit = 12,
} = {}) => {
  const params = new URLSearchParams();

  params.set("page", String(page));

  params.set("limit", String(limit));

  if (category && category !== "all") {
    params.set("category", category);
  }

  return request(`${BLOG_ENDPOINT}?${params.toString()}`);
};

export const getFeaturedPost = async () => {
  return request(`${BLOG_ENDPOINT}/featured`);
};

export const getBlogCategories = async () => {
  return request(`${BLOG_ENDPOINT}/categories`);
};

export const getPost = async (slug) => {
  if (!slug) {
    throw new Error("A blog post slug is required.");
  }

  return request(`${BLOG_ENDPOINT}/post/${encodeURIComponent(slug)}`);
};

export const recordPostView = async (postId) => {
  if (!postId) {
    return null;
  }

  return request(`${BLOG_ENDPOINT}/post/${encodeURIComponent(postId)}/view`, {
    method: "POST",
  });
};

export const getPostComments = async (postId) => {
  if (!postId) {
    return {
      success: true,
      data: [],
    };
  }

  return request(
    `${BLOG_ENDPOINT}/post/${encodeURIComponent(postId)}/comments`,
  );
};

export const submitComment = async (postId, payload) => {
  if (!postId) {
    throw new Error("A blog post ID is required.");
  }

  return request(
    `${BLOG_ENDPOINT}/post/${encodeURIComponent(postId)}/comments`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
};
