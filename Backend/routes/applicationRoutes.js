const express = require("express");
const { isAuthenticated, isAuthorized } = require("../middlewares/auth.js");
const {
  applyForJob,
  getApplicationById,
  getJobApplications,
  getUserApplications,
  updateApplicationStatus,
  getRecruiterApplications,
} = require("../controllers/applicationController.js");

const applicationRouter = express.Router();

// Application routes

// Get all applications for recruiter (must be before /:jobId routes)
applicationRouter.get(
  "/recruiter/all",
  isAuthenticated,
  isAuthorized("Recruiter"),
  getRecruiterApplications
);

// Apply for a job (Job Seeker)
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