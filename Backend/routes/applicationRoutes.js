const express = require("express");
const { isAuthenticated, isAuthorized } = require("../middlewares/auth.js");
const {
  applyForJob,
  getApplicationById,
  getJobApplications,
  getUserApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController.js");

const applicationRouter = express.Router();

// Application routes
applicationRouter.post(
  "/:jobId/apply",
  isAuthenticated,
  isAuthorized("Job Seeker"),
  applyForJob
);
applicationRouter.get(
  "/:jobId/applications",
  isAuthenticated,
  isAuthorized("Recruiter"),
  getJobApplications
);
applicationRouter.get(
  "/myapplications",
  isAuthenticated,
  isAuthorized("Job Seeker"),
  getUserApplications
);
applicationRouter.patch(
  "/:applicationId",
  isAuthenticated,
  isAuthorized("Recruiter"),
  updateApplicationStatus
);
applicationRouter.get(
  "/:applicationId",
  isAuthenticated,
  isAuthorized("Recruiter"),
  getApplicationById
);

module.exports = applicationRouter;