import authService from "./auth.service.js";
import generateToken from "./auth.utils.js";

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
| POST /api/v1/auth/register
|--------------------------------------------------------------------------
*/

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
| POST /api/v1/auth/login
|--------------------------------------------------------------------------
*/

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.login(email, password);

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| CHECK EMAIL
|--------------------------------------------------------------------------
| POST /api/v1/auth/check-email
|--------------------------------------------------------------------------
*/

export const checkEmail = async (req, res, next) => {
  try {
    const result = await authService.checkEmail(req.body?.email);

    return res.status(200).json({
      success: true,
      exists: result.exists,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

const authController = {
  register,
  login,
  checkEmail,
};

export default authController;
