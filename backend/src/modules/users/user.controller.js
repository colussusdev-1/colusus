import userService from "./user.service.js";


export const getProfile = async (req, res, next) => {

    try {

        const user = await userService.findUserByEmail(
            req.user.email
        );


        res.json({

            success: true,

            data: user,

        });


    } catch(error){

        next(error);

    }

};