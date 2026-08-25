import Update from "./update.model.js";

/*
============================================================
COLUSUS — UPDATE SERVICE
============================================================
*/

/*
============================================================
CREATE UPDATE
============================================================
|
| Internal service.
|
| This will eventually be called whenever something important
| happens in Applications, Documents, Profile, Payments etc.
|
============================================================
*/

const createUpdate = async ({
  userId,

  type,

  title,

  message,

  applicationId = null,

  documentId = null,

  metadata = {},
}) => {
  if (!userId) {
    throw new Error("User ID is required to create an update.");
  }

  if (!type) {
    throw new Error("Update type is required.");
  }

  if (!title) {
    throw new Error("Update title is required.");
  }

  if (!message) {
    throw new Error("Update message is required.");
  }

  const update = await Update.create({
    user: userId,

    type,

    title,

    message,

    applicationId,

    documentId,

    metadata,
  });

  return update;
};

/*
============================================================
GET USER UPDATES
============================================================
*/

const getUserUpdates = async (userId, options = {}) => {
  const {
    limit = 50,

    unreadOnly = false,
  } = options;

  const query = {
    user: userId,
  };

  if (unreadOnly) {
    query.read = false;
  }

  const updates = await Update.find(query)

    .sort({
      createdAt: -1,
    })

    .limit(Math.min(Number(limit) || 50, 100))

    .lean();

  return updates;
};

/*
============================================================
GET UNREAD COUNT
============================================================
*/

const getUnreadCount = async (userId) => {
  const count = await Update.countDocuments({
    user: userId,

    read: false,
  });

  return count;
};

/*
============================================================
MARK SINGLE UPDATE AS READ
============================================================
*/

const markAsRead = async (
  updateId,

  userId,
) => {
  const update = await Update.findOne({
    _id: updateId,

    user: userId,
  });

  if (!update) {
    return null;
  }

  if (!update.read) {
    update.read = true;

    update.readAt = new Date();

    await update.save();
  }

  return update;
};

/*
============================================================
MARK ALL UPDATES AS READ
============================================================
*/

const markAllAsRead = async (userId) => {
  const result = await Update.updateMany(
    {
      user: userId,

      read: false,
    },

    {
      $set: {
        read: true,

        readAt: new Date(),
      },
    },
  );

  return {
    matchedCount: result.matchedCount ?? 0,

    modifiedCount: result.modifiedCount ?? 0,
  };
};

/*
============================================================
DELETE UPDATE
============================================================
*/

const deleteUpdate = async (
  updateId,

  userId,
) => {
  const deleted = await Update.findOneAndDelete({
    _id: updateId,

    user: userId,
  });

  return deleted;
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  createUpdate,

  getUserUpdates,

  getUnreadCount,

  markAsRead,

  markAllAsRead,

  deleteUpdate,
};
