import bcrypt from "bcrypt";
import User from "../users/user.model.js";

const register = async (data) => {
  const email = String(data.email || "")
    .trim()
    .toLowerCase();

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    name: data.name,
    email,
    password: hashedPassword,
    role: data.role || "CLIENT",
  });

  return user;
};

const login = async (email, password) => {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

const checkEmail = async (email) => {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    const error = new Error("A valid email address is required");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.exists({
    email: normalizedEmail,
  });

  return {
    exists: Boolean(existingUser),
  };
};

export default {
  register,
  login,
  checkEmail,
};
