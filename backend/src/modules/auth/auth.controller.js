import authService from "./auth.service.js";
import generateToken from "./auth.utils.js";


export const register = async (req,res,next)=>{

    try {

        const user = await authService.register(
            req.body
        );


        const token = generateToken(user);


        res.status(201).json({

            success:true,

            token,

            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });


    } catch(error){

        next(error);

    }

};



export const login = async(req,res,next)=>{

    try{

        const user = await authService.login(
            req.body.email,
            req.body.password
        );


        const token = generateToken(user);


        res.json({

            success:true,

            token,

            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });


    }catch(error){

        next(error);

    }

};