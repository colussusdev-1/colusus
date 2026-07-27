import jwt from "jsonwebtoken";
import config from "../../config/environment.js";


const generateToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        config.jwtSecret,
        {
            expiresIn: config.jwtExpiresIn,
        }
    );

};


export default generateToken;