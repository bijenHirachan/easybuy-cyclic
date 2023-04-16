import express from "express";
import {
  createFeaturedProduct,
  deleteFeaturedProduct,
  getAllFeaturedProducts,
} from "../controllers/featuredProductController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/featured-products").get(getAllFeaturedProducts);
router
  .route("/featured-product/:productId")
  .post(isAuthenticated, authorizeAdmin, createFeaturedProduct)
  .delete(isAuthenticated, authorizeAdmin, deleteFeaturedProduct);

export default router;
