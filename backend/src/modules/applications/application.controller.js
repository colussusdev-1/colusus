import applicationService from "./application.service.js";

/*
============================================================
CREATE APPLICATION
============================================================
|
| Creates a new application from the selected opportunity.
|
| New applications begin as:
|
| DRAFT
|
| The service also checks the client's profile completion.
|
============================================================
*/

export const createApplication = async (req, res, next) => {
  try {
    const result = await applicationService.createApplication({
      /*
        ------------------------------------------------------
        AUTHENTICATED CLIENT
        ------------------------------------------------------
        */

      user: req.user.id,

      /*
        ------------------------------------------------------
        SELECTED OPPORTUNITY
        ------------------------------------------------------
        */

      opportunity: req.body.opportunity,

      /*
        ------------------------------------------------------
        DESTINATION COUNTRY
        ------------------------------------------------------
        */

      destinationCountry: req.body.destinationCountry,

      /*
        ------------------------------------------------------
        PRIORITY
        ------------------------------------------------------
        */

      priority: req.body.priority,

      /*
        ------------------------------------------------------
        CLIENT NOTES
        ------------------------------------------------------
        */

      notes: req.body.notes,
    });

    return res.status(201).json({
      success: true,

      message: "Application draft created successfully",

      /*
      ------------------------------------------------------
      RESPONSE
      ------------------------------------------------------

      Contains:

      application
      profileComplete
      requiresProfileCompletion
      missingProfileFields

      ------------------------------------------------------
      */

      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET USER APPLICATIONS
============================================================
*/

export const getApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getUserApplications(
      req.user.id,
    );

    return res.status(200).json({
      success: true,

      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET SINGLE APPLICATION
============================================================
|
| Returns the application together with:
|
| - Opportunity
| - Current journey step
| - Current status
| - Fresh document progress
|
============================================================
*/

export const getApplication = async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationById(
      req.params.id,
      req.user.id,
    );

    /*
    ------------------------------------------------------
    APPLICATION NOT FOUND
    ------------------------------------------------------
    */

    if (!application) {
      return res.status(404).json({
        success: false,

        message: "Application not found",
      });
    }

    /*
    ------------------------------------------------------
    SUCCESS
    ------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
UPDATE APPLICATION JOURNEY
============================================================
|
| Persists client-side application progress.
|
| Supported client updates:
|
| - currentStep
| - currentStepIndex
| - personalInformation
| - answers
| - notes
|
| The service determines whether the application should
| transition from:
|
| DRAFT → IN_PROGRESS
|
| The client cannot directly set:
|
| - SUBMITTED
| - UNDER_REVIEW
| - DOCUMENT_REQUEST
| - PROCESSING
| - APPROVED
| - REJECTED
|
| Those remain controlled by the backend/admin workflow.
|
============================================================
*/

export const updateApplication = async (req, res, next) => {
  try {
    /*
    ------------------------------------------------------
    APPLICATION ID
    ------------------------------------------------------
    */

    const applicationId = req.params.id;

    /*
    ------------------------------------------------------
    AUTHENTICATED CLIENT
    ------------------------------------------------------
    */

    const userId = req.user.id;

    /*
    ------------------------------------------------------
    UPDATE APPLICATION
    ------------------------------------------------------
    |
    | Only pass fields that the client is actually allowed
    | to modify.
    |
    ------------------------------------------------------
    */

    const application = await applicationService.updateApplication(
      applicationId,
      userId,
      {
        /*
          --------------------------------------------------
          JOURNEY
          --------------------------------------------------
          */

        currentStep: req.body.currentStep,

        currentStepIndex: req.body.currentStepIndex,

        /*
          --------------------------------------------------
          PERSONAL INFORMATION
          --------------------------------------------------
          */

        personalInformation: req.body.personalInformation,

        /*
          --------------------------------------------------
          APPLICATION ANSWERS
          --------------------------------------------------
          */

        answers: req.body.answers,

        /*
          --------------------------------------------------
          CLIENT NOTES
          --------------------------------------------------
          */

        notes: req.body.notes,
      },
    );

    /*
    ------------------------------------------------------
    SUCCESS
    ------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message: "Application progress updated successfully",

      data: application,
    });
  } catch (error) {
    next(error);
  }
};
