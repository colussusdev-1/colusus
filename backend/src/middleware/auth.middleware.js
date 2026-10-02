import jwt from "jsonwebtoken";

import config from "../config/environment.js";

const authenticate = (req, res, next) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | AUTHORIZATION HEADER
    |--------------------------------------------------------------------------
    */

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | BEARER TOKEN
    |--------------------------------------------------------------------------
    */

    const [scheme, token] = authHeader.split(" ");

    if (!token || scheme?.toLowerCase() !== "bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication format",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | VERIFY JWT
    |--------------------------------------------------------------------------
    */

    const decoded = jwt.verify(token, config.jwtSecret);

    /*
    |--------------------------------------------------------------------------
    | VALIDATE JWT PAYLOAD
    |--------------------------------------------------------------------------
    |
    | Every authenticated request needs a user identity.
    |
    | The role is also required by allowRoles() and the
    | permission system.
    |
    */

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATED USER
    |--------------------------------------------------------------------------
    */

    req.user = {
      id: decoded.id,
      role: decoded.role || null,
    };

    /*
    |--------------------------------------------------------------------------
    | OPTIONAL JWT METADATA
    |--------------------------------------------------------------------------
    |
    | Preserve common JWT fields if they exist.
    |
    */

    if (decoded.iat !== undefined) {
      req.user.iat = decoded.iat;
    }

    if (decoded.exp !== undefined) {
      req.user.exp = decoded.exp;
    }

    /*
    |--------------------------------------------------------------------------
    | DEBUG
    |--------------------------------------------------------------------------
    |
    | Keep this temporarily while we verify the current token.
    |
    | Remove the console.log after confirming the role is correct.
    |
    */

    console.log("Authenticated user:", {
      id: req.user.id,
      role: req.user.role,
    });

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authenticate;
