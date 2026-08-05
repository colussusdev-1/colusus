import Notification from "./notification.model.js";

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

const createNotification = async ({
  userId,

  title,

  message,

  type,

  metadata = {},
}) => {
  const notification = await Notification.create({
    user: userId,

    title,

    message,

    type,

    metadata,
  });

  return notification;
};

/*
|--------------------------------------------------------------------------
| Get User Notifications
|--------------------------------------------------------------------------
*/

const getUserNotifications = async (userId) => {
  const notifications = await Notification.find({
    user: userId,
  })

    .sort({
      createdAt: -1,
    });

  return notifications;
};

/*
|--------------------------------------------------------------------------
| Get Unread Notification Count
|--------------------------------------------------------------------------
*/

const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({
    user: userId,

    read: false,
  });

  return count;
};

/*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

const markNotificationAsRead = async (
  notificationId,

  userId,
) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,

      user: userId,
    },

    {
      read: true,
    },

    {
      new: true,
    },
  );

  return notification;
};

/*
|--------------------------------------------------------------------------
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    {
      user: userId,

      read: false,
    },

    {
      read: true,
    },
  );

  return true;
};

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

const deleteNotification = async (
  notificationId,

  userId,
) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,

    user: userId,
  });

  return notification;
};

export default {
  createNotification,

  getUserNotifications,

  getUnreadCount,

  markNotificationAsRead,

  markAllAsRead,

  deleteNotification,
};
