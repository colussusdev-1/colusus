import ClientProfile from "./client-profile.model.js";



const createProfile = async (data) => {

    const profile = await ClientProfile.create(data);

    return profile;

};



const getProfileByUserId = async (userId) => {

    const profile = await ClientProfile.findOne({

        user: userId

    });


    return profile;

};



const updateProfile = async (userId, data) => {

    const profile = await ClientProfile.findOneAndUpdate(

        {
            user: userId
        },

        data,

        {
            new: true,
            runValidators: true
        }

    );


    return profile;

};



export default {

    createProfile,

    getProfileByUserId,

    updateProfile,

};