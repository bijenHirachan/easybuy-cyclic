import express from "express";
import { config } from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import featuredProductRoutes from "./routes/featuredProductRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import ErrorMiddleware from "./middlewares/ErrorMiddleware.js";
import cookieParser from "cookie-parser";
import st from "stripe";
import { stripeWebhook } from "./controllers/paymentController.js";

config();

export const stripe = st(process.env.STRIPE_SECRET);
export const endpointSecret = process.env.STRIPE_WEBHOOK;

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.post(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", featuredProductRoutes);
app.use("/api/v1", paymentRoutes);

export default app;

app.use(ErrorMiddleware);
