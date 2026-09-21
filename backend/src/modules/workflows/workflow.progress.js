/*
============================================================
APPLICATION PROGRESS
============================================================
|
| Overall migration journey progress.
|
| This is NOT document completion progress.
|
============================================================
*/

const APPLICATION_PROGRESS = {
  DRAFT: 0,

  IN_PROGRESS: 15,

  SUBMITTED: 30,

  UNDER_REVIEW: 45,

  DOCUMENT_REQUEST: 50,

  PROCESSING: 70,

  APPROVED: 100,

  REJECTED: 0,
};

/*
============================================================
GET APPLICATION PROGRESS
============================================================
*/

export const getApplicationProgress = (status) => {
  return APPLICATION_PROGRESS[status] ?? 0;
};

export default {
  getApplicationProgress,
};
