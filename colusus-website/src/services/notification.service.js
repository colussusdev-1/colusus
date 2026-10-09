import api from "./api";

/* -------------------------------------------------------------------------- */
/* NOTIFICATION SERVICE                                                       */
/* -------------------------------------------------------------------------- */

const notificationService = {
  /* ------------------------------------------------------------------------ */
  /* GET NOTIFICATIONS                                                       */
  /* ------------------------------------------------------------------------ */

  getNotifications: async (params = {}) => {
    const response = await api.get("/notifications", {
      params,
    });

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* GET UNREAD COUNT                                                        */
  /* ------------------------------------------------------------------------ */

  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count");

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* MARK SINGLE NOTIFICATION AS READ                                        */
  /* ------------------------------------------------------------------------ */

  markAsRead: async (notificationId) => {
    if (!notificationId) {
      throw new Error("Notification ID is required.");
    }

    const response = await api.patch(`/notifications/${notificationId}/read`);

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* MARK ALL NOTIFICATIONS AS READ                                          */
  /* ------------------------------------------------------------------------ */

  markAllAsRead: async () => {
    const response = await api.patch("/notifications/read-all");

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* DELETE SINGLE NOTIFICATION                                              */
  /* ------------------------------------------------------------------------ */

  deleteNotification: async (notificationId) => {
    if (!notificationId) {
      throw new Error("Notification ID is required.");
    }

    const response = await api.delete(`/notifications/${notificationId}`);

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* DELETE ALL NOTIFICATIONS                                                */
  /* ------------------------------------------------------------------------ */

  deleteAll: async () => {
    const response = await api.delete("/notifications");

    return response.data;
  },
};

export default notificationService;
