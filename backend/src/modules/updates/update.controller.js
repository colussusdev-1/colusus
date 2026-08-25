import updateService from "./update.service.js";

/*
============================================================
COLUSUS — UPDATE CONTROLLER
============================================================
*/

/*
============================================================
GET CLIENT UPDATES
============================================================
|
| GET /api/v1/updates
|
============================================================
*/

export const getUpdates = async (req, res, next) => {
  try {
    const { unreadOnly, limit } = req.query;

    const updates = await updateService.getUserUpdates(
      req.user.id,

      {
        unreadOnly: unreadOnly === "true",

        limit,
      },
    );

    return res.status(200).json({
      success: true,

      data: updates,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET UNREAD COUNT
============================================================
|
| GET /api/v1/updates/unread-count
|
============================================================
*/

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await updateService.getUnreadCount(req.user.id);

    return res.status(200).json({
      success: true,

      data: {
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
MARK UPDATE AS READ
============================================================
|
| PATCH /api/v1/updates/:id/read
|
============================================================
*/

export const markUpdateAsRead = async (req, res, next) => {
  try {
    const update = await updateService.markAsRead(
      req.params.id,

      req.user.id,
    );

    if (!update) {
      return res.status(404).json({
        success: false,

        message: "Update not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Update marked as read.",

      data: update,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
MARK ALL AS READ
============================================================
|
| PATCH /api/v1/updates/read-all
|
============================================================
*/

export const markAllUpdatesAsRead = async (req, res, next) => {
  try {
    const result = await updateService.markAllAsRead(req.user.id);

    return res.status(200).json({
      success: true,

      message: "All updates marked as read.",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};
