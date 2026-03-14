import { ApiError } from "../utils/ApiError.js";

export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ApiError(403, "Access denied"));
      return;
    }

    next();
  };
};
