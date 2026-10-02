export const PERMISSIONS = {
  // --------------------------------------------------------------------------
  // DASHBOARD
  // --------------------------------------------------------------------------

  DASHBOARD_VIEW: "dashboard.view",

  // --------------------------------------------------------------------------
  // APPLICATIONS
  // --------------------------------------------------------------------------

  APPLICATIONS_VIEW: "applications.view",
  APPLICATIONS_CREATE: "applications.create",
  APPLICATIONS_UPDATE: "applications.update",
  APPLICATIONS_DELETE: "applications.delete",
  APPLICATIONS_ASSIGN: "applications.assign",
  APPLICATIONS_REASSIGN: "applications.reassign",
  APPLICATIONS_STATUS_UPDATE: "applications.status.update",
  APPLICATIONS_NOTES_VIEW: "applications.notes.view",
  APPLICATIONS_NOTES_CREATE: "applications.notes.create",

  // --------------------------------------------------------------------------
  // DOCUMENTS
  // --------------------------------------------------------------------------

  DOCUMENTS_VIEW: "documents.view",
  DOCUMENTS_REVIEW: "documents.review",
  DOCUMENTS_APPROVE: "documents.approve",
  DOCUMENTS_REJECT: "documents.reject",

  // --------------------------------------------------------------------------
  // CLIENTS
  // --------------------------------------------------------------------------

  CLIENTS_VIEW: "clients.view",
  CLIENTS_CREATE: "clients.create",
  CLIENTS_UPDATE: "clients.update",
  CLIENTS_DELETE: "clients.delete",

  // --------------------------------------------------------------------------
  // PAYMENTS
  // --------------------------------------------------------------------------

  PAYMENTS_VIEW: "payments.view",
  PAYMENTS_CREATE: "payments.create",
  PAYMENTS_UPDATE: "payments.update",
  PAYMENTS_REFUND: "payments.refund",

  // --------------------------------------------------------------------------
  // INVOICES
  // --------------------------------------------------------------------------

  INVOICES_VIEW: "invoices.view",
  INVOICES_CREATE: "invoices.create",
  INVOICES_UPDATE: "invoices.update",

  // --------------------------------------------------------------------------
  // RECEIPTS
  // --------------------------------------------------------------------------

  RECEIPTS_VIEW: "receipts.view",
  RECEIPTS_CREATE: "receipts.create",

  // --------------------------------------------------------------------------
  // OPPORTUNITIES
  // --------------------------------------------------------------------------

  OPPORTUNITIES_VIEW: "opportunities.view",
  OPPORTUNITIES_CREATE: "opportunities.create",
  OPPORTUNITIES_UPDATE: "opportunities.update",
  OPPORTUNITIES_DELETE: "opportunities.delete",

  // --------------------------------------------------------------------------
  // STAFF
  // --------------------------------------------------------------------------

  STAFF_VIEW: "staff.view",
  STAFF_CREATE: "staff.create",
  STAFF_UPDATE: "staff.update",
  STAFF_DEACTIVATE: "staff.deactivate",
  STAFF_ASSIGN_ROLE: "staff.assign.role",
  STAFF_ASSIGN_PERMISSIONS: "staff.assign.permissions",

  // --------------------------------------------------------------------------
  // ROLES
  // --------------------------------------------------------------------------

  ROLES_VIEW: "roles.view",
  ROLES_CREATE: "roles.create",
  ROLES_UPDATE: "roles.update",
  ROLES_DELETE: "roles.delete",

  // --------------------------------------------------------------------------
  // PERMISSIONS
  // --------------------------------------------------------------------------

  PERMISSIONS_VIEW: "permissions.view",
  PERMISSIONS_MANAGE: "permissions.manage",

  // --------------------------------------------------------------------------
  // DEPARTMENTS
  // --------------------------------------------------------------------------

  DEPARTMENTS_VIEW: "departments.view",
  DEPARTMENTS_CREATE: "departments.create",
  DEPARTMENTS_UPDATE: "departments.update",
  DEPARTMENTS_DELETE: "departments.delete",

  // --------------------------------------------------------------------------
  // FORMS / WEBSITE ENQUIRIES
  // --------------------------------------------------------------------------

  FORMS_VIEW: "forms.view",
  FORMS_UPDATE: "forms.update",
  FORMS_DOCUMENTS_VIEW: "forms.documents.view",

  // --------------------------------------------------------------------------
  // ANALYTICS
  // --------------------------------------------------------------------------

  ANALYTICS_VIEW: "analytics.view",

  // --------------------------------------------------------------------------
  // ACTIVITY / AUDIT
  // --------------------------------------------------------------------------

  ACTIVITY_VIEW: "activity.view",
  AUDIT_VIEW: "audit.view",

  // --------------------------------------------------------------------------
  // NOTIFICATIONS
  // --------------------------------------------------------------------------

  NOTIFICATIONS_VIEW: "notifications.view",
  NOTIFICATIONS_MANAGE: "notifications.manage",
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_GROUPS = [
  {
    key: "dashboard",
    label: "Dashboard",
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
  },

  {
    key: "applications",
    label: "Applications",
    permissions: [
      PERMISSIONS.APPLICATIONS_VIEW,
      PERMISSIONS.APPLICATIONS_CREATE,
      PERMISSIONS.APPLICATIONS_UPDATE,
      PERMISSIONS.APPLICATIONS_DELETE,
      PERMISSIONS.APPLICATIONS_ASSIGN,
      PERMISSIONS.APPLICATIONS_REASSIGN,
      PERMISSIONS.APPLICATIONS_STATUS_UPDATE,
      PERMISSIONS.APPLICATIONS_NOTES_VIEW,
      PERMISSIONS.APPLICATIONS_NOTES_CREATE,
    ],
  },

  {
    key: "documents",
    label: "Documents",
    permissions: [
      PERMISSIONS.DOCUMENTS_VIEW,
      PERMISSIONS.DOCUMENTS_REVIEW,
      PERMISSIONS.DOCUMENTS_APPROVE,
      PERMISSIONS.DOCUMENTS_REJECT,
    ],
  },

  {
    key: "clients",
    label: "Clients",
    permissions: [
      PERMISSIONS.CLIENTS_VIEW,
      PERMISSIONS.CLIENTS_CREATE,
      PERMISSIONS.CLIENTS_UPDATE,
      PERMISSIONS.CLIENTS_DELETE,
    ],
  },

  {
    key: "payments",
    label: "Payments",
    permissions: [
      PERMISSIONS.PAYMENTS_VIEW,
      PERMISSIONS.PAYMENTS_CREATE,
      PERMISSIONS.PAYMENTS_UPDATE,
      PERMISSIONS.PAYMENTS_REFUND,
    ],
  },

  {
    key: "invoices",
    label: "Invoices",
    permissions: [
      PERMISSIONS.INVOICES_VIEW,
      PERMISSIONS.INVOICES_CREATE,
      PERMISSIONS.INVOICES_UPDATE,
    ],
  },

  {
    key: "receipts",
    label: "Receipts",
    permissions: [PERMISSIONS.RECEIPTS_VIEW, PERMISSIONS.RECEIPTS_CREATE],
  },

  {
    key: "opportunities",
    label: "Opportunities",
    permissions: [
      PERMISSIONS.OPPORTUNITIES_VIEW,
      PERMISSIONS.OPPORTUNITIES_CREATE,
      PERMISSIONS.OPPORTUNITIES_UPDATE,
      PERMISSIONS.OPPORTUNITIES_DELETE,
    ],
  },

  {
    key: "staff",
    label: "Staff",
    permissions: [
      PERMISSIONS.STAFF_VIEW,
      PERMISSIONS.STAFF_CREATE,
      PERMISSIONS.STAFF_UPDATE,
      PERMISSIONS.STAFF_DEACTIVATE,
      PERMISSIONS.STAFF_ASSIGN_ROLE,
      PERMISSIONS.STAFF_ASSIGN_PERMISSIONS,
    ],
  },

  {
    key: "roles",
    label: "Roles",
    permissions: [
      PERMISSIONS.ROLES_VIEW,
      PERMISSIONS.ROLES_CREATE,
      PERMISSIONS.ROLES_UPDATE,
      PERMISSIONS.ROLES_DELETE,
    ],
  },

  {
    key: "permissions",
    label: "Permissions",
    permissions: [PERMISSIONS.PERMISSIONS_VIEW, PERMISSIONS.PERMISSIONS_MANAGE],
  },

  {
    key: "departments",
    label: "Departments",
    permissions: [
      PERMISSIONS.DEPARTMENTS_VIEW,
      PERMISSIONS.DEPARTMENTS_CREATE,
      PERMISSIONS.DEPARTMENTS_UPDATE,
      PERMISSIONS.DEPARTMENTS_DELETE,
    ],
  },

  // --------------------------------------------------------------------------
  // FORMS / WEBSITE ENQUIRIES
  // --------------------------------------------------------------------------

  {
    key: "forms",
    label: "Website Enquiries",
    permissions: [
      PERMISSIONS.FORMS_VIEW,
      PERMISSIONS.FORMS_UPDATE,
      PERMISSIONS.FORMS_DOCUMENTS_VIEW,
    ],
  },

  {
    key: "analytics",
    label: "Analytics",
    permissions: [PERMISSIONS.ANALYTICS_VIEW],
  },

  {
    key: "activity",
    label: "Activity & Audit",
    permissions: [PERMISSIONS.ACTIVITY_VIEW, PERMISSIONS.AUDIT_VIEW],
  },

  {
    key: "notifications",
    label: "Notifications",
    permissions: [
      PERMISSIONS.NOTIFICATIONS_VIEW,
      PERMISSIONS.NOTIFICATIONS_MANAGE,
    ],
  },
];
