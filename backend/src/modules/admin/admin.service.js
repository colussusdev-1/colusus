import User from "../users/user.model.js";
import Application from "../applications/application.model.js";
import Document from "../documents/document.model.js";



/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

const getDashboardStats = async () => {


    const [
        totalClients,
        totalApplications,
        pendingDocuments,
        approvedDocuments
    ] = await Promise.all([


        User.countDocuments({
            role: "CLIENT"
        }),


        Application.countDocuments(),


        Document.countDocuments({
            status: "UPLOADED"
        }),


        Document.countDocuments({
            status: "APPROVED"
        })


    ]);



    return {

        totalClients,

        totalApplications,

        pendingDocuments,

        approvedDocuments

    };

};





/*
|--------------------------------------------------------------------------
| Application Management
|--------------------------------------------------------------------------
*/


const getAllApplications = async () => {


    const applications = await Application.find()

        .populate(
            "user",
            "name email"
        )

        .sort({

            createdAt: -1

        });



    return applications;

};





const getApplicationById = async (
    applicationId
) => {


    const application = await Application.findById(
        applicationId
    )

    .populate(
        "user",
        "name email"
    )

   



    return application;

};





const updateApplicationStatus = async (

    applicationId,

    status

) => {


    const application =
    await Application.findByIdAndUpdate(

        applicationId,

        {

            status

        },

        {

            new:true,

            runValidators:true

        }

    );



    return application;

};





export default {

    getDashboardStats,

    getAllApplications,

    getApplicationById,

    updateApplicationStatus

};