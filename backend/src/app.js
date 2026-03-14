import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { swaggerSpec } from "./config/swagger.js";
import authRoutes from "./routes/v1/authRoutes.js";
import productRoutes from "./routes/v1/productRoutes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = (
        process.env.CORS_ORIGIN || "http://localhost:5173"
      )
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(mongoSanitize());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
