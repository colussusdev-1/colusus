import Application from "./application.model.js";



const createApplication = async (data) => {

    const application = await Application.create(data);

    return application;

};



const getUserApplications = async (userId) => {

    const applications = await Application.find({
        user: userId
    })
    .sort({
        createdAt: -1
    });


    return applications;

};



const getApplicationById = async (id, userId) => {

    return Application.findOne({

        _id: id,

        user: userId

    });

};



export default {

    createApplication,

    getUserApplications,

    getApplicationById,

};