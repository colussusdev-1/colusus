import notificationService from "../notifications/notification.service.js";

import {
  getApplicationNotificationData,
  getDocumentNotificationData,
} from "./workflow.helpers.js";

/*
|--------------------------------------------------------------------------
| Handle Application Status Change
|--------------------------------------------------------------------------
*/

const handleApplicationStatusChange = async ({
  userId,

  applicationId,

  status,
}) => {
  const notificationData = getApplicationNotificationData(status);

  return await notificationService.createNotification({
    userId,

    title: notificationData.title,

    message: notificationData.message,

    type: notificationData.type,

    metadata: {
      applicationId,

      status,
    },
  });
};

/*
|--------------------------------------------------------------------------
| Handle Document Status Change
|--------------------------------------------------------------------------
*/

const handleDocumentStatusChange = async ({
  userId,

  documentId,

  status,
}) => {
  const notificationData = getDocumentNotificationData(status);

  return await notificationService.createNotification({
    userId,

    title: notificationData.title,

    message: notificationData.message,

    type: notificationData.type,

    metadata: {
      documentId,

      status,
    },
  });
};

export default {
  handleApplicationStatusChange,

  handleDocumentStatusChange,
};
