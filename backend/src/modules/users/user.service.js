import User from "./user.model.js";


const createUser = async (data) => {

    const user = await User.create(data);

    return user;

};


const findUserByEmail = async (email) => {

    return User.findOne({
        email,
    });

};


export default {
    createUser,
    findUserByEmail,
};