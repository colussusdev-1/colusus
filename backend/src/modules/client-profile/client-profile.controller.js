import clientProfileService from "./client-profile.service.js";



export const createProfile = async (
    req,
    res,
    next
) => {

    try {


        const existingProfile =
        await clientProfileService.getProfileByUserId(
            req.user.id
        );


        if (existingProfile) {

            return res.status(400).json({

                success: false,

                message: "Profile already exists"

            });

        }



        const profile =
        await clientProfileService.createProfile({

            user: req.user.id,

            ...req.body

        });



        res.status(201).json({

            success: true,

            message: "Client profile created successfully",

            data: profile

        });



    } catch(error) {

        next(error);

    }

};





export const getProfile = async (
    req,
    res,
    next
) => {

    try {


        const profile =
        await clientProfileService.getProfileByUserId(
            req.user.id
        );



        if (!profile) {

            return res.status(404).json({

                success:false,

                message:"Client profile not found"

            });

        }



        res.status(200).json({

            success:true,

            data:profile

        });



    } catch(error) {

        next(error);

    }

};





export const updateProfile = async (
    req,
    res,
    next
) => {

    try {


        const profile =
        await clientProfileService.updateProfile(

            req.user.id,

            req.body

        );



        if (!profile) {

            return res.status(404).json({

                success:false,

                message:"Client profile not found"

            });

        }



        res.status(200).json({

            success:true,

            message:"Profile updated successfully",

            data:profile

        });



    } catch(error) {

        next(error);

    }

};