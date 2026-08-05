/*
|--------------------------------------------------------------------------
| Build Application Timeline
|--------------------------------------------------------------------------
*/

export const buildApplicationTimeline = (status) => {
  const timeline = [
    {
      title: "Application Submitted",
      completed: true,
    },
    {
      title: "Documents Uploaded",
      completed: false,
    },
    {
      title: "Application Under Review",
      completed: false,
    },
    {
      title: "Final Decision",
      completed: false,
    },
  ];

  switch (status) {
    case "SUBMITTED":
      break;

    case "UNDER_REVIEW":
      timeline[1].completed = true;
      timeline[2].completed = true;
      break;

    case "APPROVED":
      timeline[1].completed = true;
      timeline[2].completed = true;
      timeline[3].completed = true;
      break;

    case "REJECTED":
      timeline[1].completed = true;
      timeline[2].completed = true;
      timeline[3] = {
        title: "Application Rejected",
        completed: true,
      };
      break;

    default:
      break;
  }

  return timeline;
};
