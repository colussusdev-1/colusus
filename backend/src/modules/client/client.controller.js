import clientService from "./client.service.js";

/*
|--------------------------------------------------------------------------
| Client Dashboard
|--------------------------------------------------------------------------
*/

export const getClientDashboard = async (req, res, next) => {
  try {
    const dashboard = await clientService.getClientDashboard(req.user.id);

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Client Profile
|--------------------------------------------------------------------------
*/

export const getClientProfile = async (req, res, next) => {
  try {
    const profile = await clientService.getClientProfile(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Client profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Client Applications
|--------------------------------------------------------------------------
*/

export const getClientApplications = async (req, res, next) => {
  try {
    const applications = await clientService.getClientApplications(req.user.id);

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Client Documents
|--------------------------------------------------------------------------
*/

export const getClientDocuments = async (req, res, next) => {
  try {
    const documents = await clientService.getClientDocuments(req.user.id);

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Client Progress
|--------------------------------------------------------------------------
*/

export const getClientProgress = async (req, res, next) => {
  try {
    const progress = await clientService.getClientProgress(req.user.id);

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Application Timeline
|--------------------------------------------------------------------------
*/

export const getApplicationTimeline = async (req, res, next) => {
  try {
    const timeline = await clientService.getApplicationTimeline(
      req.params.id,
      req.user.id,
    );

    if (!timeline) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Client Document Overview
|--------------------------------------------------------------------------
*/

export const getClientDocumentOverview = async (req, res, next) => {
  try {
    const overview = await clientService.getClientDocumentOverview(req.user.id);

    res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Notification Unread Count
|--------------------------------------------------------------------------
*/

export const getNotificationUnreadCount = async (req, res, next) => {
  try {
    const count = await clientService.getNotificationUnreadCount(req.user.id);

    res.status(200).json({
      success: true,
      data: count,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    await clientService.markAllNotificationsAsRead(req.user.id);

    res.status(200).json({
      success: true,

      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Notification Summary
|--------------------------------------------------------------------------
*/

export const getNotificationSummary = async (req, res, next) => {
  try {
    const summary = await clientService.getNotificationSummary(req.user.id);

    res.status(200).json({
      success: true,

      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
/*
|--------------------------------------------------------------------------
| Get Client Activity Feed
|--------------------------------------------------------------------------
*/

export const getClientActivityFeed = async (
  req,
  res,
  next
) => {

  try {

    const activities =
      await clientService.getClientActivityFeed(
        req.user.id
      );


    res.status(200).json({

      success:true,

      data:{
        activities
      }

    });


  } catch(error){

    next(error);

  }

};
