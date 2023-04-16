import express from "express";
import {
  changePassword,
  deleteUser,
  forgotPassword,
  getMyProfile,
  getUsers,
  login,
  logout,
  register,
  resetPassword,
  subscribeForNewsletter,
  updateProfile,
  updateProfilePicture,
  updateUserRole,
} from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/users").get(getUsers).post(singleUpload, register);
router.route("/login").post(login);
router.route("/changepassword").put(isAuthenticated, changePassword);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/logout").get(isAuthenticated, logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:token").put(resetPassword);

router
  .route("/updateprofilepicture")
  .put(isAuthenticated, singleUpload, updateProfilePicture);

router.route("/me").get(isAuthenticated, getMyProfile);

router
  .route("/users/:id")
  .put(isAuthenticated, authorizeAdmin, updateUserRole)
  .delete(isAuthenticated, authorizeAdmin, deleteUser);

router.route("/subscribe").post(subscribeForNewsletter);

export default router;
