import api from "../../../../services/api";

const BASE_URL = "/admin/blog";

const unwrap = (response) => {
  return response?.data;
};

/**
 * Get admin blog posts
 */
export const getAdminPosts = async ({
  page = 1,
  limit = 100,
  status = "",
  category = "",
  featured = "",
  search = "",
} = {}) => {
  const response = await api.get(BASE_URL, {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
      ...(featured !== "" ? { featured } : {}),
      ...(search ? { search } : {}),
    },
  });

  return unwrap(response);
};

/**
 * Get a single admin post
 */
export const getAdminPost = async (postId) => {
  const response = await api.get(`${BASE_URL}/${postId}`);

  return unwrap(response);
};

/**
 * Create a new post
 */
export const createAdminPost = async (payload) => {
  const response = await api.post(BASE_URL, payload);

  return unwrap(response);
};

/**
 * Update an existing post
 */
export const updateAdminPost = async (postId, payload) => {
  const response = await api.patch(`${BASE_URL}/${postId}`, payload);

  return unwrap(response);
};

/**
 * Delete a post
 */
export const deleteAdminPost = async (postId) => {
  const response = await api.delete(`${BASE_URL}/${postId}`);

  return unwrap(response);
};

/**
 * Publish a post
 */
export const publishAdminPost = async (postId) => {
  const response = await api.post(`${BASE_URL}/${postId}/publish`);

  return unwrap(response);
};

/**
 * Unpublish a post
 */
export const unpublishAdminPost = async (postId) => {
  const response = await api.post(`${BASE_URL}/${postId}/unpublish`);

  return unwrap(response);
};

/**
 * Schedule a post
 */
export const scheduleAdminPost = async (postId, scheduledFor) => {
  const response = await api.post(`${BASE_URL}/${postId}/schedule`, {
    scheduledFor,
  });

  return unwrap(response);
};

/**
 * Toggle featured state
 *
 * Backend endpoint:
 * PATCH /api/v1/admin/blog/:id/featured
 *
 * The backend determines the new state itself.
 */
export const setFeaturedPost = async (postId) => {
  const response = await api.patch(`${BASE_URL}/${postId}/featured`);

  return unwrap(response);
};

/**
 * Get admin comments
 */
export const getAdminComments = async ({
  page = 1,
  limit = 50,
  status = "",
  post = "",
} = {}) => {
  const response = await api.get(`${BASE_URL}/comments`, {
    params: {
      page,
      limit,
      ...(status
        ? {
            status,
          }
        : {}),
      ...(post
        ? {
            post,
          }
        : {}),
    },
  });

  return unwrap(response);
};

/**
 * Create an editorial comment
 */
export const createEditorialComment = async (postId, payload) => {
  const response = await api.post(`${BASE_URL}/${postId}/comments`, payload);

  return unwrap(response);
};

/**
 * Update a comment
 */
export const updateAdminComment = async (commentId, payload) => {
  const response = await api.patch(
    `${BASE_URL}/comments/${commentId}`,
    payload,
  );

  return unwrap(response);
};

/**
 * Delete a comment
 */
export const deleteAdminComment = async (commentId) => {
  const response = await api.delete(`${BASE_URL}/comments/${commentId}`);

  return unwrap(response);
};

/**
 * Approve a comment
 */
export const approveAdminComment = async (commentId) => {
  const response = await api.post(`${BASE_URL}/comments/${commentId}/approve`);

  return unwrap(response);
};

/**
 * Reject a comment
 */
export const rejectAdminComment = async (commentId) => {
  const response = await api.post(`${BASE_URL}/comments/${commentId}/reject`);

  return unwrap(response);
};

/**
 * Schedule a comment
 */
export const scheduleAdminComment = async (commentId, scheduledFor) => {
  const response = await api.post(
    `${BASE_URL}/comments/${commentId}/schedule`,
    {
      scheduledFor,
    },
  );

  return unwrap(response);
};

/**
 * Toggle comment pin
 */
export const togglePinComment = async (commentId) => {
  const response = await api.post(`${BASE_URL}/comments/${commentId}/pin`);

  return unwrap(response);
};
