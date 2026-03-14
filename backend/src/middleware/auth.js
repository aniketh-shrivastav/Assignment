import User from "../models/User.js";
import { verifyToken } from "../services/tokenService.js";
import { ApiError } from "../utils/ApiError.js";

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication token missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.sub).select("_id name email role");
    if (!user) {
      throw new ApiError(401, "Invalid token user");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
