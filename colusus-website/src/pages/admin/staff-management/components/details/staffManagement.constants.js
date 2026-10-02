export const PERMISSION_GROUPS = [
  {
    key: "dashboard",
    label: "Dashboard",
    permissions: ["dashboard.view"],
  },
  {
    key: "applications",
    label: "Applications",
    permissions: [
      "applications.view",
      "applications.create",
      "applications.update",
      "applications.delete",
      "applications.assign",
      "applications.reassign",
      "applications.status.update",
      "applications.notes.view",
      "applications.notes.create",
    ],
  },
  {
    key: "documents",
    label: "Documents",
    permissions: [
      "documents.view",
      "documents.review",
      "documents.approve",
      "documents.reject",
    ],
  },
  {
    key: "clients",
    label: "Clients",
    permissions: [
      "clients.view",
      "clients.create",
      "clients.update",
      "clients.delete",
    ],
  },
  {
    key: "payments",
    label: "Payments",
    permissions: [
      "payments.view",
      "payments.create",
      "payments.update",
      "payments.refund",
    ],
  },
  {
    key: "invoices",
    label: "Invoices",
    permissions: ["invoices.view", "invoices.create", "invoices.update"],
  },
  {
    key: "receipts",
    label: "Receipts",
    permissions: ["receipts.view", "receipts.create"],
  },
  {
    key: "opportunities",
    label: "Opportunities",
    permissions: [
      "opportunities.view",
      "opportunities.create",
      "opportunities.update",
      "opportunities.delete",
    ],
  },
  {
    key: "staff",
    label: "Staff Management",
    permissions: [
      "staff.view",
      "staff.create",
      "staff.update",
      "staff.deactivate",
      "staff.assign.role",
      "staff.assign.permissions",
    ],
  },
  {
    key: "roles",
    label: "Roles",
    permissions: ["roles.view", "roles.create", "roles.update", "roles.delete"],
  },
  {
    key: "permissions",
    label: "Permissions",
    permissions: ["permissions.view", "permissions.manage"],
  },
  {
    key: "departments",
    label: "Departments",
    permissions: [
      "departments.view",
      "departments.create",
      "departments.update",
      "departments.delete",
    ],
  },
  {
    key: "forms",
    label: "Website Enquiries",
    permissions: ["forms.view", "forms.update", "forms.documents.view"],
  },
  {
    key: "analytics",
    label: "Analytics",
    permissions: ["analytics.view"],
  },
  {
    key: "activity",
    label: "Activity & Audit",
    permissions: ["activity.view", "audit.view"],
  },
  {
    key: "notifications",
    label: "Notifications",
    permissions: ["notifications.view", "notifications.manage"],
  },
];

export const permissionLabel = (permission = "") => {
  return String(permission)
    .split(".")
    .map((part) =>
      part
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    )
    .join(" ");
};

export const getEntityId = (entity) => {
  return entity?._id || entity?.id || "";
};

export const extractData = (response) => {
  return response?.data ?? response;
};

export const extractStaff = (response) => {
  const data = extractData(response);

  return data?.staff || data?.user || data;
};

export const extractAccess = (response) => {
  const data = extractData(response);

  return data?.access || data;
};

export const extractList = (response, keys = []) => {
  const data = extractData(response);

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return Array.isArray(data) ? data : [];
};
