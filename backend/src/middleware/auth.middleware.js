import jwt from "jsonwebtoken";
import config from "../config/environment.js";

/*
|--------------------------------------------------------------------------
| AUTHENTICATION MIDDLEWARE
|--------------------------------------------------------------------------
|
| Responsibilities:
| - Extract and validate Bearer tokens.
| - Verify JWT signatures and expiration.
| - Validate the authenticated user's identity.
| - Attach the authenticated user to req.user.
| - Normalize the user's role for authorization checks.
|
*/

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    /*
    |--------------------------------------------------------------------------
    | AUTHORIZATION HEADER
    |--------------------------------------------------------------------------
    */

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | BEARER TOKEN
    |--------------------------------------------------------------------------
    */

    const [scheme, token, ...extraParts] = authHeader.trim().split(/\s+/);

    if (scheme?.toLowerCase() !== "bearer" || !token || extraParts.length > 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication format. Use Bearer <token>.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | JWT CONFIGURATION
    |--------------------------------------------------------------------------
    */

    if (!config.jwtSecret) {
      console.error("Authentication configuration error: JWT secret missing.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | VERIFY JWT
    |--------------------------------------------------------------------------
    */

    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ["HS256"],
    });

    /*
    |--------------------------------------------------------------------------
    | VALIDATE JWT PAYLOAD
    |--------------------------------------------------------------------------
    */

    if (
      !decoded ||
      typeof decoded !== "object" ||
      typeof decoded.id !== "string" ||
      !decoded.id.trim()
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | NORMALIZE ROLE
    |--------------------------------------------------------------------------
    |
    | This supports role checks such as:
    | allowRoles("ADMIN", "SUPER_ADMIN")
    |
    */

    const role =
      typeof decoded.role === "string"
        ? decoded.role.trim().toUpperCase()
        : null;

    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATED USER
    |--------------------------------------------------------------------------
    */

    req.user = {
      id: decoded.id,
      role,
    };

    if (decoded.iat !== undefined) {
      req.user.iat = decoded.iat;
    }

    if (decoded.exp !== undefined) {
      req.user.exp = decoded.exp;
    }

    /*
    |--------------------------------------------------------------------------
    | TEMPORARY DEBUG LOG
    |--------------------------------------------------------------------------
    */

    if (process.env.NODE_ENV !== "production") {
      console.log("Authenticated user:", {
        id: req.user.id,
        role: req.user.role,
      });
    }

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }

    if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    console.error("Authentication middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed due to a server error.",
    });
  }
};

export default authenticate;
