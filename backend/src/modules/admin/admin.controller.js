import adminService from "./admin.service.js";

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET DASHBOARD STATS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/dashboard
|
|--------------------------------------------------------------------------
*/

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();

    return res.status(200).json({
      success: true,

      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| APPLICATION MANAGEMENT
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET ALL APPLICATIONS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/applications
|
|--------------------------------------------------------------------------
*/

export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await adminService.getAllApplications();

    return res.status(200).json({
      success: true,

      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE APPLICATION
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/applications/:id
|
| Returns:
|
| - application
| - client
| - assigned staff
| - activity
| - internal notes
|
|--------------------------------------------------------------------------
*/

export const getApplicationById = async (req, res, next) => {
  try {
    const application = await adminService.getApplicationById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,

        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,

      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE APPLICATION STATUS
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/applications/:id/status
|
| Body:
|
| {
|   "status": "PROCESSING",
|   "notes": "Application has moved into processing."
| }
|
| The authenticated Admin/Staff user is recorded as:
|
| - lastUpdatedBy
| - activity.metadata.updatedBy
|
|--------------------------------------------------------------------------
*/

export const updateApplicationStatus = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------------------
    | REQUEST DATA
    ----------------------------------------------------------------------
    */

    const { status, notes = "" } = req.body;

    /*
    ----------------------------------------------------------------------
    | VALIDATE STATUS
    ----------------------------------------------------------------------
    */

    if (!status) {
      return res.status(400).json({
        success: false,

        message: "Status is required",
      });
    }

    /*
    ----------------------------------------------------------------------
    | AUTHENTICATED USER
    ----------------------------------------------------------------------
    */

    const updatedBy = req.user?.id;

    if (!updatedBy) {
      return res.status(401).json({
        success: false,

        message: "Authenticated staff user not found",
      });
    }

    /*
    ----------------------------------------------------------------------
    | UPDATE APPLICATION
    ----------------------------------------------------------------------
    |
    | Service handles:
    |
    | - status
    | - notes
    | - lastUpdatedBy
    | - activity
    | - workflow
    | - notification
    | - progress
    |
    ----------------------------------------------------------------------
    */

    const application = await adminService.updateApplicationStatus(
      req.params.id,

      status,

      notes,

      updatedBy,
    );

    /*
    ----------------------------------------------------------------------
    | APPLICATION NOT FOUND
    ----------------------------------------------------------------------
    */

    if (!application) {
      return res.status(404).json({
        success: false,

        message: "Application not found",
      });
    }

    /*
    ----------------------------------------------------------------------
    | SUCCESS
    ----------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message: "Application status updated successfully",

      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| APPLICATION NOTES
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET APPLICATION INTERNAL NOTES
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/applications/:id/notes
|
|--------------------------------------------------------------------------
*/

export const getApplicationNotes = async (req, res, next) => {
  try {
    const notes = await adminService.getApplicationNotes(req.params.id);

    /*
    ----------------------------------------------------------------------
    | APPLICATION NOT FOUND
    ----------------------------------------------------------------------
    */

    if (!notes) {
      return res.status(404).json({
        success: false,

        message: "Application not found",
      });
    }

    /*
    ----------------------------------------------------------------------
    | SUCCESS
    ----------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| ADD APPLICATION INTERNAL NOTE
|--------------------------------------------------------------------------
|
| POST /api/v1/admin/applications/:id/notes
|
| Body:
|
| {
|   "message": "Client needs to provide updated bank statement."
| }
|
|--------------------------------------------------------------------------
*/

export const addApplicationNote = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------------------
    | REQUEST DATA
    ----------------------------------------------------------------------
    */

    const { message } = req.body;

    /*
    ----------------------------------------------------------------------
    | VALIDATE MESSAGE
    ----------------------------------------------------------------------
    */

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,

        message: "Note message is required.",
      });
    }

    /*
    ----------------------------------------------------------------------
    | AUTHENTICATED STAFF
    ----------------------------------------------------------------------
    */

    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,

        message: "Authenticated staff user not found",
      });
    }

    /*
    ----------------------------------------------------------------------
    | CREATE NOTE
    ----------------------------------------------------------------------
    |
    | Service handles:
    |
    | - internalNotes
    | - createdBy
    | - activity
    | - lastUpdatedBy
    |
    ----------------------------------------------------------------------
    */

    const application = await adminService.addApplicationNote(
      req.params.id,

      message,

      adminId,
    );

    /*
    ----------------------------------------------------------------------
    | APPLICATION NOT FOUND
    ----------------------------------------------------------------------
    */

    if (!application) {
      return res.status(404).json({
        success: false,

        message: "Application not found",
      });
    }

    /*
    ----------------------------------------------------------------------
    | SUCCESS
    ----------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,

      message: "Internal note added successfully",

      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| STAFF / APPLICATION ASSIGNMENT
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET ASSIGNABLE STAFF
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/staff
|
| Returns ADMIN and STAFF accounts that can be assigned
| to applications.
|
|--------------------------------------------------------------------------
*/

export const getAssignableStaff = async (req, res, next) => {
  try {
    const staff = await adminService.getAssignableStaff();

    return res.status(200).json({
      success: true,

      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| ASSIGN / REASSIGN APPLICATION
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/applications/:id/assignment
|
| Body:
|
| {
|   "staffId": "USER_OBJECT_ID"
| }
|
| To remove the assignment:
|
| {
|   "staffId": null
| }
|
|--------------------------------------------------------------------------
*/

export const assignApplication = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------------------
    | REQUEST DATA
    ----------------------------------------------------------------------
    */

    const { staffId } = req.body;

    /*
    ----------------------------------------------------------------------
    | AUTHENTICATED ADMIN / STAFF
    ----------------------------------------------------------------------
    */

    const updatedBy = req.user?.id;

    if (!updatedBy) {
      return res.status(401).json({
        success: false,

        message: "Authenticated staff user not found",
      });
    }

    /*
    ----------------------------------------------------------------------
    | ASSIGN APPLICATION
    ----------------------------------------------------------------------
    |
    | The service handles:
    |
    | - validating staff
    | - assigning
    | - reassigning
    | - unassigning
    | - activity creation
    | - lastUpdatedBy
    |
    ----------------------------------------------------------------------
    */

    const application = await adminService.assignApplication(
      req.params.id,

      staffId,

      updatedBy,
    );

    /*
    ----------------------------------------------------------------------
    | APPLICATION NOT FOUND
    ----------------------------------------------------------------------
    */

    if (!application) {
      return res.status(404).json({
        success: false,

        message: "Application not found",
      });
    }

    /*
    ----------------------------------------------------------------------
    | SUCCESS MESSAGE
    ----------------------------------------------------------------------
    */

    let message = "Application assigned successfully";

    if (staffId === null || staffId === undefined || staffId === "") {
      message = "Application unassigned successfully";
    }

    /*
    ----------------------------------------------------------------------
    | SUCCESS
    ----------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message,

      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  /*
  | Dashboard
  */

  getDashboardStats,

  /*
  | Applications
  */

  getAllApplications,

  getApplicationById,

  updateApplicationStatus,

  /*
  | Notes
  */

  getApplicationNotes,

  addApplicationNote,

  /*
  | Assignment
  */

  getAssignableStaff,

  assignApplication,
};
