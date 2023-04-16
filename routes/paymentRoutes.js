import express from "express";
import {
  changeDeliveryStatus,
  createCheckoutSession,
  getAllOrders,
} from "../controllers/paymentController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/create-checkout-session").post(createCheckoutSession);
router.route("/orders").get(isAuthenticated, authorizeAdmin, getAllOrders);
router
  .route("/orders/:id")
  .put(isAuthenticated, authorizeAdmin, changeDeliveryStatus);

export default router;
