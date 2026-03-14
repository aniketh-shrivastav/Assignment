export const errorHandler = (error, _req, res, _next) => {
  if (error.name === "ZodError") {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors.map((item) => ({
        path: item.path.join("."),
        message: item.message,
      })),
    });
    return;
  }

  if (error.name === "CastError") {
    res.status(400).json({
      success: false,
      message: "Invalid resource id",
    });
    return;
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
};
