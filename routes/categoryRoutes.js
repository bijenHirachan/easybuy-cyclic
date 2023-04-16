import express from "express";
import {
  categoryProducts,
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAuthenticated, authorizeAdmin } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/categories")
  .get(getAllCategories)
  .post(isAuthenticated, authorizeAdmin, createCategory);
router
  .route("/categories/:id")
  .put(isAuthenticated, authorizeAdmin, updateCategory)
  .delete(isAuthenticated, authorizeAdmin, deleteCategory);

router.route("/products-categories/:id").get(categoryProducts);

export default router;
