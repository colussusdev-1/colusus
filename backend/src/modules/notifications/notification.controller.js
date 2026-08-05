import notificationService from "./notification.service.js";

/*
|--------------------------------------------------------------------------
| Get User Notifications
|--------------------------------------------------------------------------
*/

export const getNotifications = async (
  req,

  res,

  next,
) => {
  try {
    const notifications = await notificationService.getUserNotifications(
      req.user.id,
    );

    res.status(200).json({
      success: true,

      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

export const markNotificationAsRead = async (
  req,

  res,

  next,
) => {
  try {
    const notification = await notificationService.markNotificationAsRead(
      req.params.id,

      req.user.id,
    );

    if (!notification) {
      return res.status(404).json({
        success: false,

        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,

      message: "Notification marked as read",

      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

export const deleteNotification = async (
  req,

  res,

  next,
) => {
  try {
    const notification = await notificationService.deleteNotification(
      req.params.id,

      req.user.id,
    );

    if (!notification) {
      return res.status(404).json({
        success: false,

        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,

      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (

    req,

    res,

    next

) => {

    try {


        const notification =
        await notificationService.createNotification({

            userId: req.body.userId,

            title: req.body.title,

            message: req.body.message,

            type: req.body.type

        });



        res.status(201).json({

            success:true,

            data:notification

        });



    } catch(error){

        next(error);

    }

};
