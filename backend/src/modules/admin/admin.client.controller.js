import adminClientService from "./admin.client.service.js";


/*
|--------------------------------------------------------------------------
| Get All Clients
|--------------------------------------------------------------------------
*/

export const getAllClients = async (req, res, next) => {

  try {

    const clients = await adminClientService.getAllClients(
      req.query.search
    );


    res.status(200).json({

      success: true,

      data: clients,

    });


  } catch (error) {

    next(error);

  }

};



/*
|--------------------------------------------------------------------------
| Get Client Details
|--------------------------------------------------------------------------
*/

export const getClientDetails = async (req, res, next) => {

  try {


    const client =
      await adminClientService.getClientDetails(
        req.params.id
      );



    if (!client) {

      return res.status(404).json({

        success: false,

        message: "Client not found",

      });

    }



    res.status(200).json({

      success: true,

      data: client,

    });



  } catch (error) {

    next(error);

  }

};