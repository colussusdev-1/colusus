import bcrypt from "bcrypt";

import User from "../users/user.model.js";


const register = async (data) => {

    const existingUser = await User.findOne({
        email: data.email,
    });


    if(existingUser){

        throw new Error("User already exists");

    }


    const hashedPassword = await bcrypt.hash(
        data.password,
        12
    );


    const user = await User.create({

        name: data.name,

        email: data.email,

        password: hashedPassword,

        role: data.role || "CLIENT",

    });


    return user;

};



const login = async (email, password) => {


    const user = await User.findOne({
        email,
    });


    if(!user){

        throw new Error("Invalid credentials");

    }


    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );


    if(!passwordMatch){

        throw new Error("Invalid credentials");

    }


    return user;

};



export default {

    register,

    login,

};