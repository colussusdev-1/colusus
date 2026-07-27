import adminService from "./admin.service.js";



/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const getDashboardStats = async (
    req,
    res,
    next
) => {

    try {

        const stats =
        await adminService.getDashboardStats();



        res.status(200).json({

            success:true,

            data:stats

        });


    } catch(error) {

        next(error);

    }

};





/*
|--------------------------------------------------------------------------
| Application Management
|--------------------------------------------------------------------------
*/


// GET ALL APPLICATIONS

export const getAllApplications = async (
    req,
    res,
    next
) => {

    try {


        const applications =
        await adminService.getAllApplications();



        res.status(200).json({

            success:true,

            data:applications

        });



    } catch(error) {

        next(error);

    }

};





// GET SINGLE APPLICATION

export const getApplicationById = async (
    req,
    res,
    next
) => {

    try {


        const application =
        await adminService.getApplicationById(
            req.params.id
        );



        if(!application){

            return res.status(404).json({

                success:false,

                message:"Application not found"

            });

        }



        res.status(200).json({

            success:true,

            data:application

        });



    } catch(error) {

        next(error);

    }

};





// UPDATE APPLICATION STATUS

export const updateApplicationStatus = async (
    req,
    res,
    next
) => {

    try {


        const {
            status
        } = req.body;



        if(!status){

            return res.status(400).json({

                success:false,

                message:"Status is required"

            });

        }



        const application =
        await adminService.updateApplicationStatus(

            req.params.id,

            status

        );



        if(!application){

            return res.status(404).json({

                success:false,

                message:"Application not found"

            });

        }



        res.status(200).json({

            success:true,

            message:"Application status updated successfully",

            data:application

        });



    } catch(error) {

        next(error);

    }

};