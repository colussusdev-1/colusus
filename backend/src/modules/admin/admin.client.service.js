import User from "../users/user.model.js";
import Application from "../applications/application.model.js";
import Document from "../documents/document.model.js";
import Notification from "../notifications/notification.model.js";


/*
|--------------------------------------------------------------------------
| Get All Clients
|--------------------------------------------------------------------------
*/

const getAllClients = async (search) => {

  const query = {
    role: "CLIENT",
  };


  if (search) {

    query.$or = [

      {
        name: {
          $regex: search,
          $options: "i",
        },
      },


      {
        email: {
          $regex: search,
          $options: "i",
        },
      },

    ];

  }



  const clients = await User.find(query)

    .select(
      "name email role isActive createdAt"
    )

    .sort({

      createdAt: -1,

    });



  const formattedClients = await Promise.all(

    clients.map(async(client)=>{


      const applications =
        await Application.countDocuments({

          user: client._id,

        });



      const documents =
        await Document.countDocuments({

          user: client._id,

        });



      return {

        ...client.toObject(),

        applications,

        documents,

      };


    })

  );



  return formattedClients;

};



/*
|--------------------------------------------------------------------------
| Get Client Details
|--------------------------------------------------------------------------
*/

const getClientDetails = async (clientId)=>{


  const client = await User.findOne({

    _id: clientId,

    role:"CLIENT",

  })

  .select(
    "name email role isActive createdAt"
  );



  if(!client){

    return null;

  }



  const [

    applications,

    documents,

    notifications,

  ] = await Promise.all([


    Application.find({

      user:clientId,

    })

    .sort({

      createdAt:-1,

    }),



    Document.find({

      user:clientId,

    })

    .sort({

      createdAt:-1,

    }),



    Notification.find({

      user:clientId,

    })

    .sort({

      createdAt:-1,

    })

    .limit(10),



  ]);



  return {

    client,

    applications,

    documents,

    notifications,

  };

};



export default {

  getAllClients,

  getClientDetails,

};