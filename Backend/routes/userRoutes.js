const express = require("express");
const {
  register,
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  getMe,
  deleteUserbyId,
  getJobRecommendations,
} = require("../controllers/userController.js");
const { isAuthenticated, isAuthorized } = require("../middlewares/auth.js");

// Create a new router
const userRouter = express.Router();

// Define routes
userRouter.post("/register", register);
userRouter.get("/verify-email", verifyEmail);
userRouter.post("/login", login);
userRouter.get("/logout", isAuthenticated, logout);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.get("/me", isAuthenticated, getMe);
userRouter.patch("/update-profile", isAuthenticated, updateProfile);
userRouter.delete("/delete/:id", isAuthenticated, deleteUserbyId);

userRouter.get(
  "/recommendations",
  isAuthenticated,
  isAuthorized("Job Seeker"),
  getJobRecommendations
);

module.exports = userRouter;