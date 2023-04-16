import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  searchProducts,
  updateProduct,
} from "../controllers/productController.js";
import { isAuthenticated, authorizeAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/products")
  .get(getAllProducts)
  .post(isAuthenticated, authorizeAdmin, singleUpload, createProduct);

router
  .route("/products/:id")
  .get(getSingleProduct)
  .put(isAuthenticated, authorizeAdmin, updateProduct)
  .delete(isAuthenticated, authorizeAdmin, deleteProduct);

router.route("/search-products").get(searchProducts);
export default router;
