import { STATUS_CONFIG, JOURNEY_STAGES } from "./dashboard.constants";

/* --------------------------------------------------
   APPLICATION TYPE
-------------------------------------------------- */

export const formatApplicationType = (type) => {
  if (!type) {
    return "Application";
  }

  return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

/* --------------------------------------------------
   DATE
-------------------------------------------------- */

export const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* --------------------------------------------------
   STATUS CONFIG
-------------------------------------------------- */

export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.SUBMITTED;
};

/* --------------------------------------------------
   PROGRESS
-------------------------------------------------- */

export const calculateProgress = (status) => {
  const progressMap = {
    SUBMITTED: 15,
    UNDER_REVIEW: 35,
    PROCESSING: 60,
    APPROVED: 100,
    REJECTED: 100,
  };

  return progressMap[status] ?? 15;
};

/* --------------------------------------------------
   JOURNEY STAGES
-------------------------------------------------- */

export const getJourneyStages = (application) => {
  if (!application) {
    return [];
  }

  const currentStatus = application.status;

  const currentIndex = JOURNEY_STAGES.findIndex(
    (stage) => stage.status === currentStatus,
  );

  return JOURNEY_STAGES.map((stage, index) => {
    let state = "upcoming";

    if (index < currentIndex) {
      state = "completed";
    }

    if (index === currentIndex) {
      state = "current";
    }

    return {
      ...stage,
      state,
    };
  });
};

/* --------------------------------------------------
   USER
-------------------------------------------------- */

export const getUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("FAILED TO PARSE USER:", error);

    return null;
  }
};
