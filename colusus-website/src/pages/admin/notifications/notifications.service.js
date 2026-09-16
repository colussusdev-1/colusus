import api from "../../../services/api";

/*
============================================================
ADMIN NOTIFICATION SERVICE
============================================================
|
| Handles notification API communication for the Admin Portal.
|
| IMPORTANT:
|
| This service uses the shared Axios instance:
|
|     src/services/api.js
|
| Authentication, base URL and production configuration
| are therefore handled centrally.
|
============================================================
*/

/*
============================================================
GET NOTIFICATIONS
============================================================
|
| GET /api/v1/notifications
|
| Query:
|
| ?page=1
| &limit=30
| &unreadOnly=false
|
============================================================
*/

const getNotifications = async ({
  page = 1,

  limit = 30,

  unreadOnly = false,
} = {}) => {
  const response = await api.get(
    "/notifications",

    {
      params: {
        page,

        limit,

        unreadOnly,
      },
    },
  );

  return response.data?.data;
};

/*
============================================================
GET UNREAD COUNT
============================================================
|
| GET /api/v1/notifications/unread-count
|
============================================================
*/

const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count");

  return response.data?.data?.count ?? 0;
};

/*
============================================================
MARK ONE NOTIFICATION AS READ
============================================================
|
| PATCH /api/v1/notifications/:id/read
|
============================================================
*/

const markAsRead = async (notificationId) => {
  if (!notificationId) {
    throw new Error("Notification ID is required.");
  }

  const response = await api.patch(
    `/notifications/${notificationId}/read`,

    {},
  );

  return response.data?.data;
};

/*
============================================================
MARK ALL NOTIFICATIONS AS READ
============================================================
|
| PATCH /api/v1/notifications/read-all
|
============================================================
*/

const markAllAsRead = async () => {
  const response = await api.patch(
    "/notifications/read-all",

    {},
  );

  return response.data?.data;
};

/*
============================================================
DELETE NOTIFICATION
============================================================
|
| DELETE /api/v1/notifications/:id
|
============================================================
*/

const deleteNotification = async (notificationId) => {
  if (!notificationId) {
    throw new Error("Notification ID is required.");
  }

  const response = await api.delete(`/notifications/${notificationId}`);

  return response.data;
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  getNotifications,

  getUnreadCount,

  markAsRead,

  markAllAsRead,

  deleteNotification,
};
