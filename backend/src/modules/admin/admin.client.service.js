import User from "../users/user.model.js";
import ClientProfile from "../client-profile/client-profile.model.js";
import Application from "../applications/application.model.js";
import Document from "../documents/document.model.js";
import Notification from "../notifications/notification.model.js";

/*
|--------------------------------------------------------------------------
| Get All Clients
|--------------------------------------------------------------------------
|
| Returns the client account together with the most useful profile
| information and application/document counts.
|
|--------------------------------------------------------------------------
*/

const getAllClients = async (search) => {
  /*
  |--------------------------------------------------------------------------
  | CLIENT QUERY
  |--------------------------------------------------------------------------
  */

  const query = {
    role: "CLIENT",
  };

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  if (search && search.trim()) {
    const normalizedSearch = search.trim();

    query.$or = [
      {
        name: {
          $regex: normalizedSearch,
          $options: "i",
        },
      },

      {
        email: {
          $regex: normalizedSearch,
          $options: "i",
        },
      },
    ];
  }

  /*
  |--------------------------------------------------------------------------
  | FETCH CLIENT USERS
  |--------------------------------------------------------------------------
  */

  const clients = await User.find(query)
    .select("name email role isActive createdAt")
    .sort({
      createdAt: -1,
    })
    .lean();

  /*
  |--------------------------------------------------------------------------
  | NO CLIENTS
  |--------------------------------------------------------------------------
  */

  if (clients.length === 0) {
    return [];
  }

  /*
  |--------------------------------------------------------------------------
  | BUILD CLIENT RECORDS
  |--------------------------------------------------------------------------
  */

  const formattedClients = await Promise.all(
    clients.map(async (client) => {
      /*
      |--------------------------------------------------------------------------
      | PROFILE
      |--------------------------------------------------------------------------
      */

      const profile = await ClientProfile.findOne({
        user: client._id,
      })
        .select(
          [
            "phoneNumber",
            "dateOfBirth",
            "nationality",
            "currentCountry",
            "address",
            "passportNumber",
            "migrationGoal",
            "preferredDestination",
          ].join(" "),
        )
        .lean();

      /*
      |--------------------------------------------------------------------------
      | APPLICATION COUNT
      |--------------------------------------------------------------------------
      */

      const applications = await Application.countDocuments({
        user: client._id,
      });

      /*
      |--------------------------------------------------------------------------
      | DOCUMENT COUNT
      |--------------------------------------------------------------------------
      */

      const documents = await Document.countDocuments({
        user: client._id,
      });

      /*
      |--------------------------------------------------------------------------
      | RETURN
      |--------------------------------------------------------------------------
      */

      return {
        user: client,

        profile: profile || null,

        applications,

        documents,
      };
    }),
  );

  return formattedClients;
};

/*
|--------------------------------------------------------------------------
| Get Client Details
|--------------------------------------------------------------------------
|
| Returns the complete admin view of one client.
|
| Includes:
|
| - User account
| - Client profile
| - Applications
| - Documents
| - Recent notifications
|
|--------------------------------------------------------------------------
*/

const getClientDetails = async (clientId) => {
  /*
  |--------------------------------------------------------------------------
  | CLIENT
  |--------------------------------------------------------------------------
  */

  const client = await User.findOne({
    _id: clientId,

    role: "CLIENT",
  })
    .select("name email role isActive createdAt")
    .lean();

  /*
  |--------------------------------------------------------------------------
  | CLIENT NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (!client) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | LOAD CLIENT DATA
  |--------------------------------------------------------------------------
  */

  const [profile, applications, documents, notifications] = await Promise.all([
    /*
      ------------------------------------------------------------------------
      | PROFILE
      ------------------------------------------------------------------------
      */

    ClientProfile.findOne({
      user: clientId,
    })
      .select(
        [
          "phoneNumber",
          "dateOfBirth",
          "nationality",
          "currentCountry",
          "address",
          "passportNumber",
          "migrationGoal",
          "preferredDestination",
          "createdAt",
          "updatedAt",
        ].join(" "),
      )
      .lean(),

    /*
      ------------------------------------------------------------------------
      | APPLICATIONS
      ------------------------------------------------------------------------
      */

    Application.find({
      user: clientId,
    })
      .populate("opportunity")
      .sort({
        createdAt: -1,
      })
      .lean(),

    /*
      ------------------------------------------------------------------------
      | DOCUMENTS
      ------------------------------------------------------------------------
      */

    Document.find({
      user: clientId,
    })
      .sort({
        createdAt: -1,
      })
      .lean(),

    /*
      ------------------------------------------------------------------------
      | NOTIFICATIONS
      ------------------------------------------------------------------------
      */

    Notification.find({
      user: clientId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .lean(),
  ]);

  /*
  |--------------------------------------------------------------------------
  | RETURN COMPLETE CLIENT
  |--------------------------------------------------------------------------
  */

  return {
    client,

    profile: profile || null,

    applications,

    documents,

    notifications,
  };
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getAllClients,

  getClientDetails,
};
