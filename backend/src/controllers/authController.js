import User from "../models/User.js";
import { signToken } from "../services/tokenService.js";
import { ApiError } from "../utils/ApiError.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "Email already in use");
    }

    const user = await User.create({ name, email, password, role });
    const token = signToken({ sub: user._id, role: user.role });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = signToken({ sub: user._id, role: user.role });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};
